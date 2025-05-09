<script setup lang="ts">
import type { Story, StoryReaction, User } from '~/types/entities'

const props = defineProps<{
  story: Partial<Story> & {
    author: Partial<User>
    reactions: Partial<StoryReaction>[]
  }
  commentCount: number
}>()

const route = useRoute()
const router = useRouter()
const openLoginModal = ref(false)
const openShareModal = ref(false)
const slug = route.params.slug

const toast = useToast()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const isUserHasReacted = computed(() => {
  const userId = user.value?.id

  if (!userId || !props.story) {
    return false
  }

  const hasReacted = props.story.reactions.some(
    react => react.reacted_by === userId,
  )

  return hasReacted
})

const shareStory = () => {
  openShareModal.value = true
}

const likeStory = async () => {
  if (!user.value) {
    openLoginModal.value = true
    return
  }

  const userId = user.value.id

  try {
    if (isUserHasReacted.value) {
      await supabase.from('story_reactions').delete().eq('reacted_by', userId)
    } else {
      await supabase
        .from('story_reactions')
        .insert({ story: props.story.id, reacted_by: userId })
    }
  } catch (error) {
    console.error(error)
  } finally {
    refreshNuxtData(`story/${slug}`)
  }
}

const toCommentSection = () => {
  router.push('#commentary')
}

provide(onSuccessLogin, () => {
  openLoginModal.value = false
  toast.add({
    title: 'Berhasil login',
    color: 'success',
  })
})
</script>

<template>
  <div
    class="mt-0 lg:mt-8 flex w-24 items-center gap-2 px-4 lg:flex-col md:px-0"
  >
    <UTooltip text="Sukai cerita">
      <UButton
        :icon="
          isUserHasReacted
            ? 'i-heroicons-hand-thumb-up-solid'
            : 'i-heroicons-hand-thumb-up'
        "
        :variant="isUserHasReacted ? 'soft' : 'ghost'"
        :color="isUserHasReacted ? 'primary' : 'neutral'"
        class="flex lg:flex-col"
        @click="likeStory"
      >
        <span class="block">
          {{ story.reactions.length }}
        </span>
      </UButton>
    </UTooltip>

    <UTooltip text="Tinggalkan komentar">
      <UButton
        icon="ph:chat-centered"
        variant="ghost"
        color="neutral"
        aria-label="Button to going into comment section"
        class="flex lg:flex-col"
        @click="toCommentSection"
        >{{ commentCount || null }}</UButton
      >
    </UTooltip>

    <UTooltip text="Bagikan cerita">
      <UButton
        icon="heroicons:share"
        variant="ghost"
        color="neutral"
        aria-label="Button to share this article"
        @click="shareStory"
      />
    </UTooltip>

    <LazySharedLoginModal v-model:open="openLoginModal" />
    <LazySharedShareStoryModal
      v-model:open="openShareModal"
      :title="story.title"
      :author="story.author.display_name"
    />
  </div>
</template>
