<script setup lang="ts">
import { format } from '@formkit/tempo'

defineOgImageComponent('default')

const route = useRoute()
const supabase = useSupabaseClient()
const username = route.params.username

const { data: user } = await useAsyncData(`users/${username}`, async () => {
  const { data } = await supabase
    .from('users')
    .select('id, username, display_name, location, bio, created_at')
    .eq('username', username)
    .eq('is_active', true)
    .single()

  return data
})

if (!user.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'User yang kamu cari tidak ditemukan',
  })
}

const { data: stories } = await useAsyncData(
  `users/${username}/stories`,
  async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(slug))
      `,
      )
      .eq('user_id', user.value.id)
      .eq('status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    return data
  },
)

const storiesFiltered = computed(() => {
  // @ts-expect-error give proper types
  return mapStoryTag(stories.value)
})

useSeoMeta({
  title: user.value.display_name,
  description: `Halaman profil ${user.value.display_name}`,
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg">
    <div
      class="mt-10 flex w-full flex-col items-center rounded-lg border-4 border-gray-300 bg-gray-50 px-4 pb-4 text-center"
    >
      <UserPicture
        :seed="user.username"
        class="-mt-8 border-4 border-white"
        width="80"
        height="80"
      />
      <b class="mt-6 text-3xl">{{ user.display_name }}</b>
      <p class="mt-2 md:w-[75%]">
        {{ user.bio }}
      </p>

      <div class="mt-8 space-x-4 text-gray-500">
        <span v-if="user.location" class="inline-flex items-center gap-1"
          ><UIcon name="heroicons:map-pin-solid" class="h-6 w-6" />
          {{ user.location }}</span
        >
        <span class="inline-flex items-center gap-1"
          ><UIcon name="heroicons:cake-solid" class="h-6 w-6" /> Bergabung pada
          {{ format(user.created_at, 'long', 'id') }}</span
        >
      </div>
    </div>

    <div class="mt-4">
      <div v-if="storiesFiltered?.length > 0" class="space-y-2">
        <StoryCard
          v-for="story in storiesFiltered"
          :key="story.id"
          :story="story"
          :author="user"
        />
      </div>
      <div v-else class="text-center font-medium">
        <p>Pengguna belum menambahkan cerita</p>
        <UIcon name="heroicons:flag-solid" />
      </div>
    </div>
  </div>
</template>
