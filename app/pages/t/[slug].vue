<script setup lang="ts">
const supabase = useSupabaseClient()
const route = useRoute()
const { slug } = route.params
// TODO: Fix ketika halaman di refresh di beberapa halaman yang punya async data lebih dari satu
const { data: tag } = await useAsyncData(`tags/${slug}`, async () => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
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
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    // @ts-ignore
    const mappedStories = mapStoryTag(data)

    return mappedStories.filter(story =>
      story.tags.some(tg => tg.slug === tag.value.slug),
    )
  },
)
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <div class="rounded-lg border border-gray-300 bg-white p-4 md:p-6">
      <h1 class="text-3xl font-semibold leading-loose tracking-wide">
        {{ tag.title }}
      </h1>
      <p class="font-thin">{{ tag.description }}</p>
    </div>

    <div
      v-if="stories?.length > 0"
      class="mx-auto mt-8 w-full max-w-screen-xl space-y-4 px-4"
    >
      <StoryCard
        v-for="story in stories"
        :story="story"
        :author="story.author"
        :key="story.id"
      />
    </div>
    <p v-else class="mt-8 text-center">Belum ada cerita yang ditambahkan</p>
  </div>
</template>
