<script setup lang="ts">
import { format } from '@formkit/tempo'

const route = useRoute()
const supabase = useSupabaseClient()
const username = route.params.username

const { data: user } = await useAsyncData(`users/${username}`, async () => {
  const { data } = await supabase
    .from('users')
    .select('id, username, display_name, bio, created_at')
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
  // @ts-ignore
  return mapStoryTag(stories.value)
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg">
    <div
      class="mt-10 flex w-full flex-col items-center rounded-lg border-4 border-gray-300 bg-white px-4 pb-4 text-center"
    >
      <UserPicture
        :seed="user.username"
        class="-mt-8 border-4 border-gray-300"
        width="80"
        height="80"
      />
      <b class="mt-6 text-3xl">{{ user.display_name }}</b>
      <p class="mt-2 md:w-[75%]">
        {{ user.bio }}
      </p>

      <div class="mt-8 space-x-4 text-gray-500">
        <span class="inline-flex items-center gap-1"
          ><UIcon name="heroicons:map-pin-solid" class="h-6 w-6" />
          Indonesia</span
        >
        <span class="inline-flex items-center gap-1"
          ><UIcon name="heroicons:cake-solid" class="h-6 w-6" /> Bergabung pada
          {{ format(user.created_at, 'long', 'id') }}</span
        >
      </div>
    </div>

    <div class="mt-4">
      <div class="space-y-2" v-if="storiesFiltered?.length > 0">
        <div
          v-for="story in storiesFiltered"
          :key="story.id"
          class="rounded border border-gray-300 bg-white p-4 hover:border-gray-400"
        >
          <div class="flex items-center gap-x-2">
            <NuxtLink :to="`/${user.username}`">
              <UserPicture :seed="user.username" width="35" height="35" />
            </NuxtLink>
            <div>
              <NuxtLink
                class="outline-none hover:bg-gray-200 focus:ring"
                :to="`/${user.username}`"
                title="To user page"
                >{{ user.display_name }}</NuxtLink
              >
              <small class="block text-gray-600">{{
                format(story.created_at, 'medium', 'id')
              }}</small>
            </div>
          </div>
          <div class="ml-10 mt-1">
            <NuxtLink
              :to="`/${user.username}/${story.slug}`"
              class="hover:text-primary-600 text-xl font-bold tracking-wide transition"
              :title="story.title"
            >
              {{ story.title }}
            </NuxtLink>
            <div v-if="story.tags.length > 0" class="mt-2 space-x-1">
              <StoryTag
                v-for="tag in story.tags"
                :tag="tag.slug"
                :key="tag.slug"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-center font-medium" v-else>
        <p>Pengguna belum menambahkan cerita</p>
        <UIcon name="heroicons:flag-solid" />
      </div>
    </div>
  </div>
</template>
