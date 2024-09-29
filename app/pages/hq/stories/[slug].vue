<script setup lang="ts">
import type { Database } from '~/types/database.types'

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
    <div class="mx-auto w-full max-w-screen-xl px-4 md:px-0">
      <h2 class="text-4xl font-bold leading-relaxed">{{ story.title }}</h2>
      <div class="flex gap-2">
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
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
        dolor, modi accusamus neque veritatis iusto, sapiente quae qui, beatae
        expedita porro dignissimos cum rerum autem ipsam cumque vero dolorum!
        Necessitatibus.
      </p>
    </div>
  </div>
</template>
