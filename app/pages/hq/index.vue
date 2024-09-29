<script setup lang="ts">
import type { Database } from '~/types/database.types'

useHead({
  title: 'Dashboard',
})
definePageMeta({
  layout: 'dashboard',
})

const supabase = useSupabaseClient<Database>()
const { data: stories } = await useAsyncData('hq/stories', async () => {
  const { data, error } = await supabase
    .from('story_statuses')
    .select(
      `id, is_published, is_rejected, is_pending, 
      story:stories(
        id, title, created_at, slug,
        author:user_id(id, display_name, username), 
        tags:story_tags!id(tag:tag_id(title)
        )
      )`,
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
})
</script>

<template>
  <div>
    <PageHeader title="Stories" />

    <div class="mx-auto mt-8 w-full max-w-screen-xl space-y-4 px-4">
      <StoryCard v-for="v in stories" :data="v" :key="v.id" />
    </div>
  </div>
</template>
