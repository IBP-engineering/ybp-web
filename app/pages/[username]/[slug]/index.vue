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
      author:users(id, username, display_name)
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
        class="w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50"
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
            <img
              src="https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=heru"
              width="35"
              height="35"
              alt="Avatar"
              class="rounded-full"
            />
            <div>
              <b class="text-sm">{{ story.author.display_name }}</b>
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

      <div class="h-[300px] w-full max-w-[370px] rounded-lg bg-yellow-500 p-4">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
          voluptate inventore beatae minus, voluptatum, vel ea, atque voluptates
          asperiores itaque incidunt odio illo? Odit mollitia repudiandae enim,
          aliquam minima maiores!
        </p>
      </div>
    </div>
  </div>
</template>
