<script setup lang="ts">
useHead({
  title: 'Home',
})

const activities = [
  {
    title: 'Pekan Membaca',
    desc: 'The seed determines the initial value for the built-in PRNG.',
    icon: 'heroicons:book-open',
  },
  {
    title: 'YBP Berpuisi',
    desc: 'The seed determines the initial value for the built-in PRNG.',
    icon: 'heroicons:chat-bubble-left-ellipsis',
  },
  {
    title: 'Sports Club',
    desc: 'The seed determines the initial value for the built-in PRNG.',
    icon: 'ph:soccer-ball',
  },
  {
    title: 'Malam Imajinasi',
    desc: 'The seed determines the initial value for the built-in PRNG.',
    icon: 'ph:cloud-moon',
  },
  {
    title: 'YBP Collab',
    desc: 'The seed determines the initial value for the built-in PRNG.',
    icon: 'ph:handshake',
  },
  {
    title: 'YBP Fomo',
    desc: 'The seed determines the initial value for the built-in PRNG.',
    icon: 'ph:rocket-launch',
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
    <div class="mt-20">
      <div class="container mx-auto mb-20 text-center">
        <b class="mb-2 text-6xl font-bold text-gray-900 md:text-9xl"
          >Yogyakarta</b
        >
        <div class="mb-8 flex items-center justify-center">
          <b class="text-5xl font-bold text-gray-900 md:text-8xl">Book</b>
          <img
            src="~/assets/images/tugu-jogja.png"
            alt="Image from Darmawan R. Dipo in Behance"
            class="ml-2 mr-1 h-32 md:h-56"
          />
          <b class="text-5xl font-bold text-gray-900 md:text-8xl">Party</b>
        </div>
        <p class="text-gray-500 md:text-xl">
          Baca buku, diskusi, dan main-main bareng
        </p>
      </div>
    </div>
    <!-- <div class="container mx-auto rounded-xl bg-gray-100 px-12 py-10"> -->
    <!--   <div class="w-full overflow-hidden rounded"> -->
    <!--     <div class="flex items-center"> -->
    <!--       <div -->
    <!--         class="border-primary-300 bg-primary-500 mr-2 h-5 w-5 rounded-full border" -->
    <!--       /> -->
    <!--       <div class="text-2xl text-gray-500">Kegiatan yang Akan Datang</div> -->
    <!--     </div> -->
    <!--     <div class="mt-6 flex"> -->
    <!--       <div class="w-1/3"> -->
    <!--         <img -->
    <!--           src="https://picsum.photos/300/200" -->
    <!--           loading="lazy" -->
    <!--           alt="Banner Image" -->
    <!--           class="h-auto w-full rounded-xl" -->
    <!--         /> -->
    <!--       </div> -->
    <!--       <div class="ml-4 w-2/3 p-4"> -->
    <!--         <p class="text-2xl text-gray-500"> -->
    <!--           Membaca Bersama Jogja Book Party -->
    <!--         </p> -->
    <!--         <br /> -->
    <!--         <p class="text-lg text-gray-500"> -->
    <!--           Hari: 29 September 2024<br /> -->
    <!--           Waktu: 14.00 WIB - selesai<br /> -->
    <!--           Tempat: Taman Balairung UGM -->
    <!--         </p> -->
    <!--         <br /> -->
    <!--         <p class="text-lg text-gray-500"> -->
    <!--           Catatan:<br /> -->
    <!--           Seperti biasa, Yogya Book Party kembali hadir menyapa para -->
    <!--           bookmates nih! Minggu ini kita bakal seru-seruan di Taman -->
    <!--           Balairung UGM. Jangan sampai ketinggalan karena bakalan ada games -->
    <!--           dengan hadiah yang menarik!🥳✨ Mau tau apalagi keseruan -->
    <!--           bookparty? Stay Tuned terus ya Bookmates 🙌 -->
    <!--         </p> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </div> -->
    <div class="px-4 py-24 md:px-0 md:py-32">
      <LazyGalleryMarquee />
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
        class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white"
      >
        Agenda Kami <br /><span class="text-primary-500">Yang Paling Seru</span>
      </h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="act in activities"
          :key="act.title"
          to="#"
          class="hover:ring-primary-500 group relative flex h-full flex-1 flex-col gap-x-8 gap-y-4 rounded-xl border border-gray-300 bg-white bg-gradient-to-b from-gray-50/50 to-gray-200/50 p-4 px-4 py-5 shadow ring-1 ring-gray-200 transition duration-150 hover:bg-gray-100/50 hover:ring-2 sm:p-6"
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
