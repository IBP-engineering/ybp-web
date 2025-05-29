<script setup lang="ts">
import * as v from 'valibot'
import type { Database } from '~/types/database.types'
import type { CommentWithAuthorReplies, User } from '~/types/entities'

const props = defineProps<{
  comments: CommentWithAuthorReplies[]
}>()

const commentText = ref('')
const loadingPostComment = ref(false)
const openLoginModal = ref(false)
const sortBy = ref('newest')

const sortOptions = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Terlama', value: 'oldest' },
  { label: 'Teratas', value: 'top' },
]
const sortItems = sortOptions.map(option => option.label)

const getSortValue = (label: string) => {
  const found = sortOptions.find(option => option.label === label)
  return found ? found.value : 'newest'
}
const getSortLabel = (value: string) => {
  const found = sortOptions.find(option => option.value === value)
  return found ? found.label : 'Terbaru'
}

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const toast = useToast()
const slug = route.params.slug
const story = useNuxtData(`story/${slug}`)
const user = useNuxtData<User>('current-user')

const sortedComments = computed(() => {
  if (!props.comments?.length) return []

  const commentsToSort = [...props.comments]

  switch (sortBy.value) {
    case 'oldest':
      return commentsToSort.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
    case 'top':
      return commentsToSort.sort((a, b) => {
        const reactA = Array.isArray(a.reactions) ? a.reactions.length : 0
        const reactB = Array.isArray(b.reactions) ? b.reactions.length : 0
        if (reactB !== reactA) {
          return reactB - reactA
        }
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      })
    case 'newest':
    default:
      return commentsToSort.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
  }
})

const postComment = async () => {
  try {
    if (!user.data.value) {
      openLoginModal.value = true
      return
    }

    if (!story.data.value) {
      toast.add({
        title: 'Pufft',
        description:
          'Story tidak ditemukan. Silahkan restart tab untuk memproses',
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    const validator = v.safeParse(commentValidator, commentText.value)
    if (!validator.success) {
      toast.add({
        title: 'Pufft',
        description: validator.issues[0].message,
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    loadingPostComment.value = true

    await supabase.from('story_comments').insert({
      comment_text: commentText.value,
      user: user.data.value.id,
      story: story.data.value.id,
    })

    commentText.value = ''
    await refreshNuxtData(`story/${slug}/comments`)
    toast.add({
      title: 'OK',
      description: 'Komentar berhasil dikirim',
      color: 'success',
      icon: 'lucide:circle-check-big',
    })
  } catch (error) {
    toast.add({
      title: 'Upss',
      description: 'Sepertinya terjadi kesalahan',
      color: 'error',
      icon: 'i-heroicons-x-mark-solid',
    })
    throw createError(error)
  } finally {
    loadingPostComment.value = false
  }
}

provide(onSuccessLogin, () => {
  openLoginModal.value = false
  toast.add({
    title: 'Berhasil login',
    color: 'success',
  })
})

const sortLabel = ref(getSortLabel(sortBy.value))
watch(sortLabel, label => {
  sortBy.value = getSortValue(label)
})
watch(sortBy, value => {
  sortLabel.value = getSortLabel(value)
})
</script>

<template>
  <section class="flex flex-col gap-4 py-4 w-full md:w-3/4">
    <i v-if="!props.comments.length" class="text-sm">
      -- Tampaknya belum ada komentar --
    </i>

    <div v-if="props.comments.length" class="flex justify-between items-center">
      <span class="text-sm font-stretch-normal text-gray-500">
        {{ props.comments.length }} Komentar
      </span>
      <USelect
        v-model="sortLabel"
        :items="sortItems"
        class="w-40"
        placeholder="Urutkan"
        @update:model-value="label => (sortBy.value = getSortValue(label))"
      />
    </div>

    <div class="flex gap-2 items-center">
      <UTextarea
        v-model="commentText"
        placeholder="Tinggalkan komentar"
        class="w-3/4"
        variant="outline"
        autoresize
        :rows="1"
        :maxrows="6"
        :avatar="{
          src: `${avatarBaseUrl}?seed=${user.data.value?.username}`,
          class: `${user.data.value ? 'block' : 'hidden'}`,
        }"
        :loading="loadingPostComment"
        @keydown.meta.enter="postComment"
        @keydown.ctrl.enter="postComment"
      />
      <UTooltip text="Kirim komentar">
        <UButton
          v-if="commentText.length > 0"
          class="rounded-full"
          variant="soft"
          icon="lucide:send"
          :disabled="loadingPostComment"
          @click="postComment"
        />
      </UTooltip>
    </div>

    <div
      v-if="Boolean(props.comments.length)"
      class="flex flex-col w-full gap-8"
    >
      <StoryCommentItem
        v-for="comment in sortedComments"
        :key="comment.id"
        :comment="comment"
      />
    </div>

    <LazySharedLoginModal v-model:open="openLoginModal" />
  </section>
</template>
