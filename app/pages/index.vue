<script setup lang="ts">
useHead({
  title: 'Home',
})

const activityCards = [
  { header: 'Malam Imajinasi', content: 'https://picsum.photos/400/400' },
  { header: 'Pekan Membaca', content: 'https://picsum.photos/500/500' },
  { header: 'JBP Berpuisi', content: 'https://picsum.photos/600/600' },
]
</script>

<template>
  <div>
    <div class="mt-20">
      <div class="container mx-auto mb-20 text-center">
        <b class="mb-2 text-6xl font-bold text-gray-700 lg:text-9xl">Jogja</b>
        <div class="mb-8 flex items-center justify-center">
          <b class="text-5xl font-bold text-gray-700 lg:text-8xl">Book</b>
          <img
            src="~/assets/images/tugu-jogja.png"
            alt="Image from Darmawan R. Dipo in Behance"
            class="ml-2 mr-1 h-32 md:h-56"
          />
          <b class="text-5xl font-bold text-gray-700 lg:text-8xl">Party</b>
        </div>
        <p class="text-gray-500 md:text-xl">
          Baca buku, diskusi, dan main bareng
        </p>
      </div>
    </div>
    <div class="container mx-auto rounded-xl bg-gray-100 px-12 py-10">
      <div class="w-full overflow-hidden rounded">
        <div class="flex items-center">
          <div
            class="border-primary-300 bg-primary-500 mr-2 h-5 w-5 rounded-full border"
          />
          <div class="text-2xl text-gray-500">Kegiatan yang Akan Datang</div>
        </div>
        <div class="mt-6 flex">
          <div class="w-1/3">
            <img
              src="https://picsum.photos/300/200"
              loading="lazy"
              alt="Banner Image"
              class="h-auto w-full rounded-xl"
            />
          </div>
          <div class="ml-4 w-2/3 p-4">
            <p class="text-2xl text-gray-500">
              Membaca Bersama Jogja Book Party
            </p>
            <br />
            <p class="text-lg text-gray-500">
              Hari: 29 September 2024<br />
              Waktu: 14.00 WIB - selesai<br />
              Tempat: Taman Balairung UGM
            </p>
            <br />
            <p class="text-lg text-gray-500">
              Catatan:<br />
              Seperti biasa, Yogya Book Party kembali hadir menyapa para
              bookmates nih! Minggu ini kita bakal seru-seruan di Taman
              Balairung UGM. Jangan sampai ketinggalan karena bakalan ada games
              dengan hadiah yang menarik!🥳✨ Mau tau apalagi keseruan
              bookparty? Stay Tuned terus ya Bookmates 🙌
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto mt-24 px-4">
      <h2 class="mb-14 text-center text-2xl text-gray-500">Agenda Kami</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="(card, index) in activityCards"
          :key="index"
          class="bg-gray-100"
        >
          <template #header>
            <div class="text-center text-gray-500">{{ card.header }}</div>
          </template>

          <img
            :src="card.content"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        </UCard>
      </div>
    </div>

    <!-- <div class="container mx-auto mt-24 px-4">
      <UButton
        icon="i-heroicons:chevron-right"
        size="lg"
        color="gray"
        variant="outline"
        label="Button"
        :trailing="true"
        class="mb-14 cursor-default"
      >
        🔥 Cerita Unggulan
      </UButton>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
    </div> -->

    <div class="container mx-auto mt-24 px-4">
      <div
        class="grid-cols-reverse grid w-full grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div class="flex flex-col justify-center md:w-3/4">
          <h2 class="text-3xl font-semibold leading-relaxed">Tentang Kami</h2>
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
        <div class="order-first md:order-last">
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
