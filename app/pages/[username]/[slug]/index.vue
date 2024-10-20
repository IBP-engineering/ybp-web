<script lang="ts" setup>
import { format } from '@formkit/tempo'

const supabase = useSupabaseClient()
const route = useRoute()
const slug = route.params.slug

const { data: story } = await useAsyncData(`story/${slug}`, async () => {
  const { data, error } = await supabase
    .from('stories')
    .select(
      `*,
      tags:story_tags!id(tag:tag_id(slug)),
      author:users(id, username, bio, display_name, created_at)
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
    tags: data.tags.map(tag => (tag.tag as any).slug as string),
  }
})

useHead({
  title: story.value?.title ?? 'upps',
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl md:px-4 lg:px-0">
    <div class="mt-12 flex w-full flex-col gap-4 lg:flex-row">
      <div class="mt-8 hidden md:block">
        <UButton icon="i-heroicons-hand-thumb-up" variant="ghost" color="gray"
          >0</UButton
        >
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
            <UserPicture :seed="story.author.username" width="35" height="35" />
            <div>
              <ULink
                :to="`/${story.author.username}`"
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
            <StoryTag v-for="tag in story.tags" :tag="tag" :key="tag" />
          </div>

          <div class="prose mt-8" v-html="story.content" />
        </div>
      </div>

      <div
        class="hidden h-full w-full rounded-lg border border-gray-300 bg-gray-50 p-4 shadow md:block lg:max-w-[370px]"
      >
        <div class="mb-4 flex items-center gap-4">
          <UserPicture :seed="story.author.username" width="40" height="40" />
          <b>{{ story.author.display_name }}</b>
        </div>

        <p class="text-gray-600">
          {{ story.author.bio }}
        </p>
        <ul class="mt-4 space-y-4 text-sm">
          <li>
            <b class="text-xs">DOMISILI</b>
            <p class="text-gray-600">Indonesia</p>
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
  </div>
</template>
