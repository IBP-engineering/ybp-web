<script setup lang="ts">
defineOgImageComponent('default')
useSeoMeta({
  title: 'Kumpulan tulisan & cerita dari para anggota',
  description:
    'Kumpulan cerita dari para kontributor dan anggota Yogyakarta Book Party',
})

const supabase = useSupabaseClient()
const ITEMS_PER_PAGE = 6
const page = ref(1)

const { data: stories } = await useAsyncData(
  'stories/all',
  async () => {
    const startIndex = (page.value - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE - 1

    const { data, error, count } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(slug)),
      author:users(id, username, display_name)
      `,
        { count: 'exact' },
      )
      .eq('status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex)

    if (error) {
      console.error(error)
      return { items: [], totalpages: 0, totalCount: 0 }
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    return { items: data, totalPages, totalCount }
  },
  {
    watch: [page],
    default: () => ({ items: [], totalpages: 0, totalCount: 0 }),
  },
)

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
  return mapStoryTag(stories.value.items)
})
</script>

<template>
  <div class="container mx-auto w-full px-4 xl:px-0">
    <UBreadcrumb
      divider="/"
      :items="breadcrumbs"
      class="mb-4 flex justify-center"
    />
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">Stories</h1>
      <p class="text-neutral-600">
        Kumpulan cerita dan tulisan yang menggugah dari para bookmates
      </p>
    </section>
    <div
      v-if="storiesFiltered?.length > 0"
      class="my-8 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <StoryCard
        v-for="story in storiesFiltered"
        :key="story.id"
        :story="story"
        :author="story.author"
      />
    </div>
    <p v-else class="mt-10 text-center">Belum ada cerita yang ditambahkan</p>

    <div class="flex justify-end lg:justify-center w-full">
      <UPagination
        v-model:page="page"
        :items-per-page="ITEMS_PER_PAGE"
        :total="stories.totalCount"
      />
    </div>
  </div>
</template>
