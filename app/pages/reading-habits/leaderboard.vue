<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { format, sub } from 'date-fns'
import type { Database } from '~/types/database.types'

defineOgImageComponent('default')
useSeoMeta({
  title: 'Reading Habits leaderboard',
  description:
    'Update Klasemen tantangan Reading Habits: Siapa yang di Puncak?',
})

type Column = {
  rank: number
  displayName: string
  point: number
  totalDay: number
  streakDates: string[]
}

const winnerColors = [
  'border-gold-300 bg-gold-500',
  'border-silver-300 bg-silver-500',
  'border-bronze-300 bg-bronze-500',
]

const breadcrumbs = [
  {
    label: 'Home',
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

const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient<Database>()
const defaultSelectedDate = {
  start: sub(new Date(), { days: 7 }),
  end: new Date(),
}
const selected = ref({
  start: route.query?.startDate
    ? new Date(route.query?.startDate as string)
    : defaultSelectedDate.start,
  end: route.query?.endDate
    ? new Date(route.query?.endDate as string)
    : defaultSelectedDate.end,
})

const getProfilePicture = (user: { username: string; profilePath: string }) => {
  const defaultPicture = `${avatarBaseUrl}?seed=${user.username}`

  if (user.profilePath) {
    return supabase.storage.from('profile').getPublicUrl(user.profilePath ?? '')
      .data.publicUrl
  }

  return defaultPicture
}

watch(selected, () => {
  if (selected.value) {
    router.replace({
      query: {
        startDate: format(selected.value.start, 'P'),
        endDate: format(selected.value.end, 'P'),
      },
    })
  }
})

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

const columns: TableColumn<Partial<Column>>[] = [
  {
    accessorKey: 'rank',
    header: 'Peringkat',
  },
  {
    accessorKey: 'displayName',
    header: 'Nama',
  },
  {
    accessorKey: 'point',
    header: 'Poin',
  },
  {
    accessorKey: 'totalDay',
    header: 'Hari',
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
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <UBreadcrumb
      :items="breadcrumbs"
      divider="/"
      class="mb-4 flex justify-center"
    />
    <section class="text-center">
      <h1 class="text-4xl leading-relaxed font-bold">
        <span class="text-primary-500">Klasemen </span>
        sementara
      </h1>
      <p class="text-neutral-600">
        Update Klasemen tantangan Reading Habits: Siapa yang di Puncak?
      </p>
    </section>

    <div class="mx-auto mt-16 flex w-full justify-center">
      <SharedDateRange v-model:selected="selected" />
    </div>

    <div v-if="winners?.data?.length > 0" class="mt-12 grid grid-cols-2 gap-4">
      <div
        v-for="(win, key) in compoundWinner.hallOfFame"
        :key="win.username"
        class="flex flex-col items-center text-center"
        :class="{ 'col-span-2': key === 0 }"
      >
        <img
          :src="getProfilePicture(win)"
          alt="profile"
          width="100"
          height="100"
          class="mb-2 rounded-full border"
        />
        <b>{{ win.displayName }}</b>
        <span
          class="inline-flex items-center rounded border px-1 py-0.5 text-neutral-50"
          :class="winnerColors[key]"
        >
          <UIcon v-if="key === 0" name="ph:crown-simple-fill" />
          <UIcon v-else-if="key === 1" name="ph:number-circle-two-fill" />
          <UIcon v-else name="ph:number-circle-three-fill"
        /></span>
        <p>{{ win.totalDay }} hari</p>
        <div v-show="false" class="mt-1 flex items-center gap-2">
          <UIcon name="ph:clover-fill" class="-ml-10 h-8 w-8 text-green-600" />
          <div>
            <p class="text-2xl font-medium">{{ win.point }}</p>
            <p class="text-sm text-neutral-600">poin</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="mt-20 text-center">
        Sepertinya belum ada klasemen di tanggal ini
      </p>
    </div>

    <UTable
      :column-visibility="{ point: false }"
      class="mt-16"
      loading-animation="swing"
      :loading="status === 'pending'"
      :columns="columns"
      :data="compoundWinner.tableWinners"
    >
      <template #rank-cell="{ row }">
        <span class="inline-flex items-center gap-1">
          <UIcon name="ph:crown-simple-fill" />
          {{ row.original.rank }}
        </span>
      </template>
      <template #totalDay-cell="{ row }">
        <UTooltip
          class="max-w-lg"
          :text="row.original.streakDates.toString()"
          :popper="{ placement: 'top', arrow: true }"
        >
          <span class="border-b border-dotted border-neutral-300">
            {{ row.original.totalDay }}
          </span>
        </UTooltip>
      </template>
    </UTable>
  </div>
</template>
