<script setup lang="ts">
import { sub } from 'date-fns'

defineOgImageComponent('default')
useSeoMeta({
  title: 'Reading Habits leaderboard',
  description:
    'Update Klasemen tantangan Reading Habits: Siapa yang di Puncak?',
})

const selected = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })

const query = computed(() => {
  return {
    startDate: selected.value.start.toISOString(),
    endDate: selected.value.end.toISOString(),
  }
})

const { data: winners, status } = await useFetch(
  '/api/reading-habits/leaderboard',
  {
    query,
    key: `/reading-habits/leaderboard/?start=${selected.value.start.getUTCDate()}&end=${selected.value.end.getUTCDate()}`,
  },
)

const columns = [
  {
    key: 'rank',
    label: 'Peringkat',
  },
  {
    key: 'displayName',
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

const compoundWinner = computed(() => {
  if (!winners.value?.data) return {}

  const hallOfFame = winners.value.data.slice(0, 3)
  const tableWinners = winners.value.data.slice(3).map((win, idx) => ({
    ...win,
    rank: idx + 4,
  }))

  return {
    hallOfFame,
    tableWinners,
  }
})

const winnerColors = [
  'border-gold-300 bg-gold-500',
  'border-silver-300 bg-silver-500',
  'border-bronze-300 bg-bronze-500',
]

const breadcrumbs = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Reading habits',
    to: '/reading-habits',
  },
  {
    label: 'Leaderboard',
  },
]
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <UBreadcrumb :links="breadcrumbs" class="mb-12" />
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">
        <span class="text-primary-500">Klasemen </span>
        sementara
      </h1>
      <p class="text-gray-600">
        Update Klasemen tantangan Reading Habits: Siapa yang di Puncak?
      </p>
    </section>

    <div class="mx-auto mt-16 flex w-full justify-center">
      <SharedDateRange v-model:selected="selected" />
    </div>

    <div v-if="winners?.data?.length > 0" class="mt-20 grid grid-cols-2 gap-4">
      <div
        v-for="(win, key) in compoundWinner.hallOfFame"
        :key="win.username"
        class="flex flex-col items-center text-center"
        :class="{ 'col-span-2': key === 0 }"
      >
        <img
          :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${win.username}`"
          alt="profile"
          width="100"
          height="100"
          class="mb-2 rounded-full border"
        />
        <b>{{ win.displayName }}</b>
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
    <div v-else>
      <p>Sepertinya belum ada klasemen di tanggal ini</p>
    </div>

    <UTable
      class="mt-16"
      :ui="{ tbody: '', divide: '' }"
      :rows="compoundWinner.tableWinners"
      :loading="status === 'pending'"
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
