<script setup lang="ts">
import { sub } from 'date-fns'

defineOgImageComponent('default')
useHead({
  title: 'Reading habits leaderboard',
})

const selected = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
const winners = [
  {
    rank: 4,
    name: 'John',
    profile: 'https://api.dicebear.com/9.x/glass/svg?seed=John',
    point: 12000,
    streakDay: 6,
  },
  {
    rank: 5,
    name: 'Hendra',
    profile: 'https://api.dicebear.com/9.x/glass/svg?seed=Hendra',
    point: 4000,
    streakDay: 5,
  },
  {
    rank: 6,
    name: 'Aisyah',
    profile: 'https://api.dicebear.com/9.x/glass/svg?seed=Aisyah',
    point: 2400,
    streakDay: 6,
  },
]

const columns = [
  {
    key: 'rank',
    label: 'Peringkat',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'point',
    label: 'Poin',
  },
  {
    key: 'streakDay',
    label: 'Hari',
  },
]

const winnerColors = [
  'border-gold-300 bg-gold-500',
  'border-silver-300 bg-silver-500',
  'border-bronze-300 bg-bronze-500',
]
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">Klasemen sementara</h1>
      <p class="text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui provident
        corporis asperiores dignissimos sint impedit.
      </p>
    </section>

    <div class="mx-auto mt-8 flex w-full justify-center">
      <SharedDateRange v-model:selected="selected" />
    </div>

    <div class="mt-20 grid grid-cols-2 gap-4">
      <div
        v-for="(win, key) in winners"
        :key="win.name"
        class="flex flex-col items-center text-center"
        :class="{ 'col-span-2': key === 0 }"
      >
        <img
          :src="win.profile"
          alt="profile"
          width="100"
          height="100"
          class="mb-2 rounded-full border"
        />
        <b>{{ win.name }}</b>
        <span
          class="inline-flex items-center rounded border px-1 py-0.5 text-gray-50"
          :class="winnerColors[key]"
        >
          <UIcon v-if="key === 0" name="ph:crown-simple-fill" />
          <UIcon v-else-if="key === 1" name="ph:number-circle-two-fill" />
          <UIcon v-else="key === 2" name="ph:number-circle-three-fill"
        /></span>
        <p>{{ win.streakDay }} hari</p>
        <div class="mt-1 flex items-center gap-2">
          <UIcon name="ph:clover-fill" class="-ml-10 h-8 w-8 text-green-600" />
          <div>
            <p class="text-2xl font-medium">{{ win.point }}</p>
            <p class="text-sm text-gray-600">poin</p>
          </div>
        </div>
      </div>
    </div>

    <UTable
      class="mt-16"
      :ui="{ tbody: '', divide: '' }"
      :rows="winners"
      :columns="columns"
    >
      <template #rank-data="{ row }">
        <span class="inline-flex items-center gap-1">
          <UIcon name="ph:crown-simple-fill" />
          {{ row.rank }}
        </span>
      </template>
    </UTable>
  </div>
</template>
