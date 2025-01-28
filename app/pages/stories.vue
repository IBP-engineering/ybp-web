<script setup lang="ts">
defineOgImageComponent('default')
useSeoMeta({
  title: 'Kumpulan cerita',
  description:
    'Kumpulan cerita dari para kontributor dan anggota Yogyakarta Book Party',
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
    .eq('status', 'approved')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
})

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Stories',
    to: '/stories',
  },
]

const storiesFiltered = computed(() => {
  // @ts-expect-error move forward for now
  return mapStoryTag(stories.value)
})
</script>

<template>
  <div class="container mx-auto w-full px-3 md:px-0">
    <UBreadcrumb
      divider="/"
      :links="breadcrumbs"
      class="mb-4 flex justify-center"
    />
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">Stories</h1>
      <p class="text-gray-600">
        Kumpulan cerita dan tulisan yang menggugah dari para bookmates
      </p>
    </section>
    <div
      v-if="storiesFiltered?.length > 0"
      class="my-16 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <StoryCard
        v-for="story in storiesFiltered"
        :key="story.id"
        :story="story"
        :author="story.author"
      />
    </div>
    <p v-else class="mt-10 text-center">Belum ada cerita yang ditambahkan</p>
  </div>
</template>
