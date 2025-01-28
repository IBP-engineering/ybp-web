<script setup lang="ts">
defineOgImageComponent('default')
const supabase = useSupabaseClient()
const route = useRoute()
const { slug } = route.params
const { data: tag } = await useAsyncData(`tags/${slug}`, async () => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug.toString())
    .single()

  return data
})

if (!tag.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman yang dituju tidak ditemukan',
  })
}

const { data: stories } = await useAsyncData(
  `tags/${slug}/stories`,
  async () => {
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
  },
)

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Tags',
  },
  {
    label: tag.value?.slug ?? '',
  },
]

const storiesFiltered = computed(() => {
  // @ts-expect-error give proper types later
  const mappedStories = mapStoryTag(stories.value)

  return mappedStories.filter(story =>
    story.tags.some(tg => tg.slug === tag.value.slug),
  )
})

useSeoMeta({
  title: `Cerita berdasarkan tag ${tag.value.title}`,
  description: tag.value.description,
})
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <UBreadcrumb divider="/" :links="breadcrumbs" class="mb-4" />
    <div class="rounded-lg border border-gray-300 bg-white p-4 md:p-6">
      <h1 class="text-3xl font-semibold leading-loose tracking-wide">
        {{ tag.title }}
      </h1>
      <p class="font-thin">{{ tag.description }}</p>
    </div>

    <div
      v-if="storiesFiltered?.length > 0"
      class="mx-auto mt-8 w-full max-w-screen-xl space-y-4 px-4"
    >
      <StoryCard
        v-for="story in storiesFiltered"
        :key="story.id"
        :story="story"
        :author="story.author"
      />
    </div>
    <p v-else class="mt-8 text-center">Belum ada cerita yang ditambahkan</p>
  </div>
</template>
