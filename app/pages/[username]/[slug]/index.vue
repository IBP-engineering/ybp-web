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
      tags:story_tags!id(tag:tag_id(title)),
      author:users(id, username, display_name, created_at)
      `,
    )
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  const coverWithPath = supabase.storage
    .from('story-cover')
    .getPublicUrl(data.cover_path).data.publicUrl

  return { ...data, cover_path: coverWithPath }
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <div class="mt-12 flex w-full gap-4">
      <div class="mt-8">
        <UButton icon="i-heroicons-hand-thumb-up" variant="ghost" color="gray"
          >20</UButton
        >
      </div>

      <div
        class="w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50 shadow"
      >
        <img
          :src="story.cover_path"
          width="700"
          height="400"
          alt="Story cover"
          class="w-full"
        />
        <div class="px-10 py-4">
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
                >Ditulis pada {{ format(story.created_at, 'DD MMM') }}</small
              >
            </div>
          </div>
          <h1 class="text-5xl font-bold leading-relaxed">{{ story.title }}</h1>

          <div class="prose" v-html="story.content" />
        </div>
      </div>

      <div
        class="h-full w-full max-w-[370px] rounded-lg border border-gray-300 bg-gray-50 p-4 shadow"
      >
        <div class="mb-4 flex items-center gap-4">
          <UserPicture :seed="story.author.username" width="40" height="40" />
          <b>{{ story.author.display_name }}</b>
        </div>

        <p class="text-gray-600">
          Programmer/System Admin. Currently working on media solutions. Love
          learning new things :) Posts include a variety of topics, mostly
          media/computer vision related.
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
