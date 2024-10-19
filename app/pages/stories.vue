<script setup lang="ts">
useHead({
  title: 'Stories',
})

const supabase = useSupabaseClient()

const { data: stories } = await useAsyncData('stories/all', async () => {
  const { data, error } = await supabase
    .from('stories')
    .select(
      `*,
      tags:story_tags!id(tag:tag_id(slug)),
      author:users(id, username, display_name)
      `,
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
})

const storiesFiltered = computed(() => {
  // @ts-ignore
  return mapStoryTag(stories.value)
})
</script>

<template>
  <div class="container mx-auto w-full px-3 md:px-0">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-2xl font-bold leading-relaxed md:text-4xl">
        <UIcon name="heroicons:book-open-solid" class="text-primary-500" />
        Stories
      </h1>
      <p class="text-gray-600">
        Kumpulan tulisan cerita yang sudah melalui proses skrining oleh editor
      </p>
      <div class="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StoryCard
          v-for="story in storiesFiltered"
          :key="story.id"
          :story="story"
          :author="story.author"
        />
      </div>
    </div>
  </div>
</template>
