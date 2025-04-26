<script setup lang="ts">
import type { Database } from '~/types/database.types'

useHead({
  title: 'Headquarter',
})
definePageMeta({
  layout: 'hq',
})

const ITEMS_PER_PAGE = 5
const page = ref(1)

const supabase = useSupabaseClient<Database>()
const { data: stories } = await useAsyncData(
  'hq/stories',
  async () => {
    const startIndex = (page.value - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE - 1

    const { data, count, error } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(title)),
      author:users(id, username, display_name)
`,
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex)

    if (error) {
      console.error(error)
      return { items: [], totalPages: 0, totalCount: 0 }
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    return { items: data, totalPages, totalCount }
  },
  {
    watch: [page],
    default: () => ({ items: [], totalPages: 0, totalCount: 0 }),
  },
)
</script>

<template>
  <div>
    <PageHeader title="Stories" />

    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: {{ stories.totalCount }}</p>

      <div class="mx-auto mt-2 w-full max-w-screen-xl px-4 xl:px-0 space-y-4">
        <HqStoryCard
          v-for="story in stories.items"
          :key="story.id"
          :story="story"
        />
      </div>
      <div class="flex justify-end mt-8 px-4 xl:px-12 w-full">
        <UPagination
          v-model:page="page"
          :items-per-page="5"
          :total="stories.totalCount"
        />
      </div>
    </div>
  </div>
</template>
