<script lang="ts" setup>
import { format } from '@formkit/tempo'

defineOgImageComponent('default')

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()
const toast = useToast()
const openLoginModal = ref(false)
const openShareModal = ref(false)
const slug = route.params.slug
const authorUsername = route.params.username.toString()

const { data: story, refresh } = await useAsyncData(
  `story/${slug}`,
  async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(slug)),
      author:users(id, bio, display_name, username, location, created_at),
      reactions:story_reactions!id(*)
      `,
      )
      .eq('slug', slug)
      .single()

    if (error) {
      console.error(error)
      return null
    }

    const coverWithPath = data.cover_path
      ? supabase.storage.from('story-cover').getPublicUrl(data.cover_path).data
          .publicUrl
      : null

    return {
      ...data,
      cover_path: coverWithPath,
      tags: data.tags.map(
        tag => (tag.tag as unknown as { slug: string }).slug as string,
      ),
    }
  },
)

if (!story.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman tidak ditemukan',
  })
}

const isUserHasReacted = computed(() => {
  const userId = user.value?.id

  if (!userId || !story.value) {
    return false
  }

  const hasReacted = story.value.reactions.some(
    react => react.reacted_by === userId,
  )

  return hasReacted
})

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
        .insert({ story: story.value.id, reacted_by: userId })
    }
  } catch (error) {
    console.error(error)
  } finally {
    refresh()
  }
}

const shareStory = () => {
  openShareModal.value = true
}

provide(onSuccessLogin, () => {
  openLoginModal.value = false
  toast.add({
    title: 'Berhasil login',
    color: 'green',
  })
})

useSeoMeta({
  title: story.value?.title,
  description: `Cerita berjudul ${story.value.title} dari penulis ${story.value.author.display_name}`,
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl md:px-4 xl:px-0">
    <div class="mt-12 flex w-full flex-col-reverse gap-4 lg:flex-row">
      <div class="mt-8 flex w-24 items-center gap-2 px-4 md:flex-col md:px-0">
        <UTooltip text="Sukai cerita">
          <UButton
            icon="i-heroicons-hand-thumb-up-solid"
            variant="soft"
            :color="isUserHasReacted ? 'primary' : 'gray'"
            class="flex md:flex-col"
            @click="likeStory"
          >
            <span class="block">
              {{ story.reactions.length }}
            </span>
          </UButton>
        </UTooltip>
        <UTooltip text="Bagikan cerita">
          <UButton
            icon="heroicons:share"
            variant="soft"
            color="gray"
            @click="shareStory"
          />
        </UTooltip>
      </div>

      <div
        class="w-full overflow-hidden shadow md:rounded-lg md:border md:border-gray-300 md:bg-gray-50"
      >
        <img
          v-if="story.cover_path"
          :src="story.cover_path"
          width="700"
          height="400"
          alt="Story cover"
          class="w-full"
        />
        <div class="px-4 py-4 md:px-10">
          <UAlert
            v-if="story.status !== 'approved'"
            :color="story.status === 'pending' ? 'teal' : 'rose'"
            title="Halo pembaca!"
            icon="heroicons:exclamation-triangle"
          >
            <template #description>
              <p v-if="story.status === 'pending'">
                Cerita ini belum dipublikasikan dan masih dalam tahap pengecekan
                oleh editor kami
              </p>
              <p v-else>
                Cerita ini belum dipublikasikan dan masih ada yang perlu
                diperbaiki oleh penulis
              </p>
            </template>
          </UAlert>

          <div class="my-4 flex items-center gap-4">
            <UserPicture :seed="authorUsername" width="35" height="35" />
            <div>
              <ULink
                :to="`/${authorUsername}`"
                class="text-sm font-semibold hover:underline"
                title="To author page"
                >{{ story.author.display_name }}</ULink
              >
              <small
                :title="format(story.created_at, 'full')"
                class="block text-xs text-gray-600"
                >Ditulis pada
                {{ format(story.created_at, 'DD MMM', 'id') }}</small
              >
            </div>
          </div>
          <h1
            class="text-2xl font-bold md:text-3xl lg:text-4xl lg:leading-tight"
          >
            {{ story.title }}
          </h1>
          <div class="mt-2">
            <StoryTag v-for="tag in story.tags" :key="tag" :tag="tag" />
          </div>

          <div class="prose mt-8" v-html="story.content" />
        </div>
      </div>

      <div
        class="hidden h-full w-full rounded-lg border border-gray-300 bg-gray-50 p-4 shadow md:block lg:max-w-[370px]"
      >
        <NuxtLink
          :to="`/${authorUsername}`"
          class="group mb-4 flex items-center gap-4 rounded"
          title="To author page"
        >
          <UserPicture :seed="authorUsername" width="40" height="40" />
          <b class="group-hover:text-primary-600">{{
            story.author.display_name
          }}</b>
        </NuxtLink>

        <p class="text-gray-600">
          {{ story.author.bio }}
        </p>
        <ul class="mt-4 space-y-4 text-sm">
          <li v-if="story.author.location">
            <b class="text-xs">DOMISILI</b>
            <p class="text-gray-600">{{ story.author.location }}</p>
          </li>
          <li>
            <b class="text-xs">BERGABUNG</b>
            <p class="text-gray-600">
              {{ format(story.author.created_at, 'long', 'id') }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <LazySharedLoginModal v-model:open="openLoginModal" />
    <LazySharedShareStoryModal
      v-model:open="openShareModal"
      :title="story.title"
      :author="story.author.display_name"
    />
  </div>
</template>
