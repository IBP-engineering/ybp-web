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
      `*, tags:story_tags!id(tag:tag_id(title)), status:story_statuses!id(*)`,
    )
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
})
</script>

<template>
  <div>
    <PageHeader :title="story.title" back-button-text="Stories" mode="detail" />
    <p>params: {{ slug }}</p>
  </div>
</template>
