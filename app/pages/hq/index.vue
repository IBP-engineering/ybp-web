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
    .from('stories')
    .select(
      `*, 
      tags:story_tags!id(tag:tag_id(title)), 
      author:users(id, username, display_name), 
      status:story_statuses!id(*)
      `,
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
      <StoryCard v-for="v in stories" :story="v" :key="v.id" />
    </div>
  </div>
</template>
