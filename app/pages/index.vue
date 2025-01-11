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

const storiesFiltered = computed(() => {
  // @ts-expect-error need to fix later
  return mapStoryTag(stories.value)
})
</script>

<template>
  <div>
    <div class="grid size-full place-items-center">
      <div
        class="relative mt-20 flex size-full items-center justify-center overflow-hidden xl:h-[400px]"
      >
        <div class="z-10 w-full">
          <section
            class="mx-auto px-4 text-center md:w-fit md:px-0 md:text-left"
          >
            <small class="block tracking-widest">KOMUNITAS</small>
            <h1
              class="text-5xl font-bold !leading-tight md:text-7xl lg:text-8xl"
            >
              Yogya<span
                class="via-primary-400 to-primary-300 bg-gradient-to-tr from-black bg-clip-text text-transparent"
                >karta</span
              >
            </h1>
            <span class="text-xl font-medium md:text-3xl">Book Party</span>
            <p class="mt-8 text-sm text-gray-600 md:mt-6 md:text-lg">
              #baca-buku #diskusi #main-bareng
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

    <LazyHeroGallery />

    <OurAgenda />

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
          color="gray"
          to="/stories"
          >Cerita lainnya</UButton
        >
      </div>
    </div>

    <div class="container mx-auto px-4 py-24 md:px-0 md:py-32">
      <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="flex flex-col justify-center lg:w-3/4">
          <h2 id="about-us" class="text-3xl font-semibold leading-relaxed">
            Tentang Kami
          </h2>
          <p class="tracking-wide text-gray-600">
            Kami hadir untuk memenuhi visi, yaitu menjadikan literasi, terutama
            membaca buku, menjadi kebiasaan baru di masyarakat, khususnya di
            Yogyakarta. Yogyakarta Book Party berdiri pada tahun 2023 hingga
            saat ini memiliki lebih dari 800+ anggota dengan 4 organisasi yang
            berjalan di dalamnya.<br />
            <br />
            Komunitas ini adalah salah satu dari 63 Komunitas Book Party di
            bawah naungan Indonesia Book Party (IBP).
          </p>
        </div>
        <div class="order-first lg:order-last">
          <img
            src="~/assets/images/about-us.jpeg"
            alt="Foto pengurus dan supporter dari YBP"
            class="bg-primary-100 w-full rounded-lg"
            width="1600"
            height="1200"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-24 md:px-0 md:py-32">
      <LazyMoreInfo />
    </div>
  </div>
</template>
