<script setup lang="ts">
import { format } from '@formkit/tempo'
import type { Database } from '~/types/database.types'
import type { StoryStatus } from '~/types/entities'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const supabase = useSupabaseClient<Database>()
const slug = route.params.slug

const { data: story } = await useAsyncData(`hq/stories/${slug}`, async () => {
  const { data, error } = await supabase
    .from('stories')
    .select(
      `*, 
      author:users(display_name, username),
      tags:story_tags!id(tag_id(*)), 
      status:story_statuses!id(*)
      `,
    )
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return {
    ...data,
    cover_path: data.cover_path
      ? supabase.storage.from('story-cover').getPublicUrl(data.cover_path).data
          .publicUrl
      : null,
    status: data.status as unknown as StoryStatus,
    tags: data.tags.map(tag => tag.tag_id) as unknown as {
      id: string
      description: string
      title: string
      slug: string
    }[],
  }
})
</script>

<template>
  <div>
    <PageHeader title="Detail story" back-button-text="Stories" mode="detail" />
    <div class="mx-auto mt-8 w-full max-w-screen-xl px-4 md:px-0">
      <div
        class="flex flex-col gap-4 overflow-hidden rounded border bg-white shadow md:flex-row"
      >
        <img
          v-if="story.cover_path"
          :src="story.cover_path"
          height="300"
          class="h-full min-h-[200px] w-full md:w-[400px]"
          alt="Story cover"
        />
        <div class="flex flex-col px-4 py-3">
          <StoryBadgeStatus :status="story.status" />
          <h2 class="text-xl font-bold leading-relaxed md:text-2xl">
            {{ story.title }} tambahan 222
          </h2>
          <div v-if="story.tags?.length > 0" class="mt-2 flex gap-2">
            <div
              class="rounded border border-gray-300 bg-gray-200 px-2"
              v-for="tag in story.tags"
              :key="tag.id"
            >
              <UTooltip :title="tag.title" :text="tag.description">
                <span>#{{ tag?.slug }}</span>
              </UTooltip>
            </div>
          </div>
          <small class="mt-4 text-gray-600">
            Ditulis oleh
            {{ story.author.display_name }}, pada
            {{ format(story.created_at, 'DD MMM YYYY, HH:mm', 'id') }}
          </small>
          <small class="text-gray-600">
            Update terakhir pada
            {{ format(story.updated_at, 'DD MMM YYYY, HH:mm', 'id') }}
          </small>
        </div>
      </div>

      <div class="mt-8">
        <LazyProseRender :content="story.content" />
      </div>
    </div>
  </div>
</template>
