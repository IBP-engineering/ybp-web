<script setup lang="ts">
import type { Database } from '~/types/database.types'

useHead({
  title: 'Headquarter',
})
definePageMeta({
  layout: 'hq',
})

const supabase = useSupabaseClient<Database>()
const { data: stories } = await useAsyncData('hq/stories', async () => {
  const { data, error } = await supabase
    .from('stories')
    .select(
      `*,
      tags:story_tags!id(tag:tag_id(title)),
      author:users(id, username, display_name)
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
      <HqStoryCard v-for="story in stories" :story="story" :key="story.id" />
    </div>
  </div>
</template>
