<script setup lang="ts">
import { format } from 'date-fns'
import id from 'date-fns/locale/id'
import type { Database } from '~/types/database.types'
import type { Story, Tag, User } from '~/types/entities'
import type { PostgrestError } from '@supabase/supabase-js'

definePageMeta({
  layout: 'hq',
})

const route = useRoute()
const supabase = useSupabaseClient<Database>()
const slug = route.params.slug
const openReview = ref(false)

const { data: story } = await useAsyncData(`hq/stories/${slug}`, async () => {
  const { data, error } = (await supabase
    .from('stories')
    .select(
      `*, 
      author:users(display_name, username),
      tags:story_tags!id(tag_id(*))
      `,
    )
    .eq('slug', slug.toString())
    .single()) as {
    data: Story & { author: User; tags: [{ tag_id: Tag[] }] }
    error: PostgrestError
  }

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
      <div class="flex justify-end">
        <UButton
          size="lg"
          class="mb-2"
          icon="i-heroicons:eye-solid"
          @click="openReview = true"
          >Tinjau</UButton
        >
      </div>
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
          <h2 class="text-xl leading-relaxed font-bold md:text-2xl">
            {{ story.title }}
          </h2>
          <div v-if="story.tags?.length > 0" class="mt-2 flex gap-2">
            <div
              class="rounded border border-neutral-300 bg-neutral-200 px-2"
              v-for="tag in story.tags"
              :key="tag.id"
              class="rounded border border-gray-300 bg-gray-200 px-2"
            >
              <UTooltip :title="tag.title" :text="tag.description">
                <span>#{{ tag?.slug }}</span>
              </UTooltip>
            </div>
          </div>
          <small class="mt-4 text-neutral-600">
            Ditulis oleh
            {{ story.author.display_name }}, pada
            {{
              format(new Date(story.created_at), 'dd MMM yyyy, HH:mm', {
                locale: id,
              })
            }}
          </small>
          <small class="text-neutral-600">
            Update terakhir pada
            {{
              format(new Date(story.updated_at), 'dd MMM yyyy, HH:mm', {
                locale: id,
              })
            }}
          </small>
        </div>
      </div>

      <div class="mt-8">
        <LazyProseRender :content="story.content" />
      </div>
    </div>
    <LazyModalReview
      v-model="openReview"
      :story-id="story.id"
      :status="story.status"
    />
  </div>
</template>
