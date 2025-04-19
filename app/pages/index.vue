<script setup lang="ts">
defineOgImageComponent('default')
useHead({
  title: 'Home',
})

const supabase = useSupabaseClient()

const { data: stories } = await useLazyAsyncData(
  'stories/favorites',
  async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(slug)),
      author:users(username, display_name)
      `,
      )
      .eq('status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error(error)
      return []
    }

    return data
  },
)

const toReleasesPage = () => {
  window.open(
    'https://github.com/IBP-engineering/ybp-web/blob/main/releases.md',
    '_blank',
  )
}

const storiesFiltered = computed(() => {
  // @ts-expect-error need to fix later
  return mapStoryTag(stories.value)
})
</script>

<template>
  <div>
    <div class="grid relative size-full place-items-center">
      <div class="absolute -top-4">
        <SharedRainbowButton title="To releases page" @click="toReleasesPage">
          <span class="mr-2">v0.2.1 is out </span>
          <UIcon name="ph:arrow-circle-up-right" size="17"
        /></SharedRainbowButton>
      </div>
      <div
        class="relative mt-20 flex size-full items-center justify-center overflow-hidden xl:h-[400px]"
      >
        <div class="z-10 w-full">
          <section
            class="mx-auto px-4 text-center md:w-fit md:px-0 md:text-left"
          >
            <small class="block tracking-widest">KOMUNITAS BUKU</small>
            <h1
              class="text-5xl !leading-tight font-bold md:text-7xl lg:text-8xl"
            >
              Yogya<span
                class="via-primary-400 to-primary-300 bg-gradient-to-tr from-black bg-clip-text text-transparent"
                >karta</span
              >
            </h1>
            <span class="text-xl font-medium md:text-3xl">Book Party</span>
            <p class="mt-8 text-sm text-neutral-600 md:mt-6 md:text-lg">
              #baca #literasi #inklusif
            </p>
          </section>
        </div>
        <SharedDotPattern
          :class="
            cn(
              '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
            )
          "
        />
      </div>
    </div>

    <LazyHomeHeroGallery />

    <HomeOurActivities />

    <div class="container mx-auto px-4 py-24 md:px-0 md:py-32">
      <h2 class="text-lg font-bold">🔥 Cerita Terbaru</h2>
      <div
        v-if="storiesFiltered.length > 0"
        class="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <StoryCard
          v-for="story in storiesFiltered"
          :key="story.id"
          :story="story"
          :author="story.author"
        />
      </div>
      <div class="flex justify-end">
        <UButton
          variant="ghost"
          trailing-icon="heroicons:arrow-small-right-20-solid"
          color="neutral"
          to="/stories"
          >Cerita lainnya</UButton
        >
      </div>
    </div>

    <div class="container mx-auto px-4 py-24 md:px-0 md:py-28">
      <HomeAboutUs />
      <HomeFaqSection />
    </div>

    <div class="container mx-auto px-4 py-24 md:px-0">
      <LazyHomeMoreInfo />
    </div>
  </div>
</template>
