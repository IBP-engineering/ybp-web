<script setup lang="ts">
useHead({
  title: 'Home',
})

const activities = [
  {
    title: 'Book Party',
    desc: 'Bookparty adalah kegiatan membaca buku di tempat umum yang di agendakan setiap weekend oleh YBP. Kegiatan ini bertujuan untuk menampung teman-teman yang sedang bingung ingin membaca buku dimana dan dengan siapa.',
    icon: 'heroicons:book-open',
  },
  {
    title: 'Deklamasi Puisi',
    desc: 'Agenda yang diagendakan pada malam hari dengan acara membaca puisi. Entah puisi yang sudah pernah dituliskan atau puisi ciptaan sendiri. Agenda ini bertujuan untuk mengasah kreatifitas dan kepercayaan diri bookmates.',
    icon: 'heroicons:chat-bubble-left-ellipsis',
  },
  {
    title: 'Sports Club',
    desc: 'Selain mengisi otak dengan Bacaan yang bermanfaat, fisik juga harus dijaga. Agenda ini bertujuan untuk bookmates yang ingin berolahraga namun tidak ada teman.',
    icon: 'ph:soccer-ball',
  },
  {
    title: 'Malam Imajinasi',
    desc: 'Adalah event online yang dilakukan YBP untuk bookmates yang sedang overthingking dan insomnia. Dipandu oleh mentor psikologi yang berpengalaman, diharapkan agenda ini mampu mengurangi beban pikiran bookmates.',
    icon: 'ph:cloud-moon',
  },
  {
    title: 'YBP Collab',
    desc: 'Adalah salah satu cara YBP untuk membuka kerjasama dengan semua pihak dari berbagai kalangan di masyarakat. Bertujuan untuk memperluas lagi jaringan persahabatan antar komunitas.',
    icon: 'ph:handshake',
  },
  {
    title: 'YBP Fomo',
    desc: 'Adalah sebuah kegiatan bookparty yang dilakukan di tempat publik yang tidak biasanya, contohnya di KRL. Bertujuan untuk memperluas jaringan literasi di masyarakat.',
    icon: 'ph:rocket-launch',
  },
  {
    title: 'Reading Habits',
    desc: 'Challenge yang diselenggarakan bookparty untuk kegiatan baca buku rutin setiap harinya, dengan doorprize menarik untuk pemenang challenge nya.',
    icon: 'ph:cactus',
  },
]
const supabase = useSupabaseClient()

const { data: stories } = await useAsyncData('stories/favorites', async () => {
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
    .limit(3)

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

    <div class="px-4 py-32 md:px-0">
      <GalleryMarquee />
      <h2
        class="mt-4 text-center text-lg font-medium leading-8 text-gray-900 dark:text-white"
      >
        Lebih dari 300+ orang telah ikut berpartisipasi
      </h2>
    </div>

    <div
      class="container mx-auto space-y-16 px-4 py-24 md:space-y-24 md:px-0 md:py-32"
    >
      <h2
        id="activities"
        class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white"
      >
        Agenda Kami <br /><span class="text-primary-500">Yang Paling Seru</span>
      </h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="act in activities"
          :key="act.title"
          to="#"
          class="hover:ring-primary-500 group relative flex h-full flex-1 flex-col gap-x-8 gap-y-4 rounded-xl border border-gray-300 bg-white bg-gradient-to-b from-gray-50/50 to-gray-200/50 p-4 px-4 py-5 shadow ring-1 ring-gray-200 transition duration-150 hover:bg-gray-100/50 hover:ring-2 sm:p-6 last:md:col-span-2 last:lg:col-span-3"
        >
          <UIcon :name="act.icon" class="text-primary-500 h-12 w-12" />
          <b
            class="flex items-center gap-1.5 truncate text-base font-semibold text-gray-900 dark:text-white"
            >{{ act.title }}</b
          >
          <p class="text-[15px] text-gray-500 dark:text-gray-400">
            {{ act.desc }}
          </p>
        </NuxtLink>
      </div>
    </div>

    <div class="container mx-auto px-4 py-24 md:px-0 md:py-32">
      <h2 class="text-lg font-bold">🔥 Cerita Terbaru</h2>
      <div class="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            Hydra is a Y Combinator-backed data processing company with a
            globally remote team. We are passionate PostgreSQL and backend
            engineers from Microsoft Azure, Heroku, and Citus Data. We set out
            to build the best all-in-one database for app development. We
            believe DuckDB is a remarkable technology made revolutionary within
            Postgres.<br />
            <br />
            Hydra authored pg_duckdb, the official PostgreSQL extension for
            DuckDB, and employs the project's main contributors. We offer
            production support and services for the system.
          </p>
        </div>
        <div class="order-first lg:order-last">
          <img
            src="https://picsum.photos/1600/900"
            alt="Tentang Kami"
            class="w-full rounded-lg"
            width="500"
            height="600"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </div>
</template>
