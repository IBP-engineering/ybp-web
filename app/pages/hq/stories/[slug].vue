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
      <div class="flex gap-4 border-b border-gray-400 pb-2">
        <img
          v-if="story.cover_path"
          :src="story.cover_path"
          height="300"
          class="h-[200px] w-full md:w-[400px]"
          alt="Story cover"
        />
        <div class="flex flex-col">
          <StoryBadgeStatus :status="story.status" />
          <h2 class="text-3xl font-bold leading-relaxed">{{ story.title }}</h2>
          <div v-if="story.tags?.length > 0" class="mb-4 flex gap-2">
            <div
              class="rounded border border-gray-300 bg-gray-200 px-2"
              v-for="tag in story.tags"
              :key="tag.id"
            >
              <UTooltip :title="tag.title" :text="tag.description">
                <b>#{{ tag?.slug }}</b>
              </UTooltip>
            </div>
          </div>
          <p class="text-gray-600">
            Ditulis oleh
            {{ story.author.display_name }}, pada
            {{ format(story.created_at, 'DD MMM YYYY, HH:mm', 'id') }}
          </p>
          <p class="text-gray-600">
            Update terakhir pada
            {{ format(story.updated_at, 'DD MMM YYYY, HH:mm', 'id') }}
          </p>
        </div>
      </div>

      <div class="mt-8">
        <LazyProseRender :content="story.content" />
      </div>
    </div>
  </div>
</template>
