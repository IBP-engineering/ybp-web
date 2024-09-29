<script setup lang="ts">
import heroTugu from '~/assets/images/tugu-jogja.png'

import { ref } from 'vue'

useHead({
  title: 'Home',
})

const navLinks = ref([
  { text: 'Stories', to: '#' },
  { text: 'Activities', to: '#' },
  { text: 'Goodies', to: '#' },
  { text: 'About Us', to: '#' },
])

const activityCards = ref([
  { header: 'Malam Imajinasi', content: 'https://picsum.photos/400/400' },
  { header: 'Pekan Membaca', content: 'https://picsum.photos/500/500' },
  { header: 'JBP Berpuisi', content: 'https://picsum.photos/600/600' },
])
</script>

<template>
  <div class="bg-gray-50">
    <nav class="py-10">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <div>
            <img
              src="https://placehold.co/400x400.png"
              loading="lazy"
              alt="YBP Logo"
              class="h-12 rounded-full"
            />
          </div>
          <ul class="ml-12 flex space-x-8">
            <li v-for="link in navLinks" :key="link.text">
              <NuxtLink
                :to="link.to"
                class="hover:bg-primary-50 gap-2 px-4 py-3 text-gray-600 transition md:w-auto"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <button
            class="hover:bg-primary-50 rounded border border-gray-600 px-4 py-3 text-gray-600 hover:border-gray-600"
          >
            Join Now
          </button>
        </div>
      </div>
    </nav>

    <div class="py-20">
      <div class="container mx-auto text-center">
        <p class="mb-2 text-2xl text-gray-500">
          Baca buku, diskusi, dan main-main bareng
        </p>
        <h1 class="mb-2 text-9xl font-bold text-gray-700">Jogja</h1>
        <div class="mb-6 flex items-center justify-center">
          <h1 class="text-8xl font-bold text-gray-700">Book</h1>
          <img
            :src="heroTugu"
            alt="Image from Darmawan R. Dipo in Behance"
            class="ml-2 mr-1 h-56"
          />
          <h1 class="text-8xl font-bold text-gray-700">Party</h1>
        </div>
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
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="description flex flex-col justify-center">
          <h2 class="mb-5 text-2xl text-gray-500">Tentang Kami</h2>
          <p class="w-3/4 text-lg text-gray-500">
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
        <div class="flex items-center justify-end px-5">
          <img
            src="https://picsum.photos/600/300"
            alt="Tentang Kami"
            class="items-end rounded-lg object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <div
      class="bottom-0 left-0 right-0 mb-4 ml-4 mr-4 mt-24 rounded-lg bg-gray-100 p-4 text-white"
    >
      <div class="mx-auto max-w-7xl text-center text-gray-600">
        <p>© 2024 Jogja Book Party</p>
      </div>
    </div>
  </div>
</template>
