<script setup lang="ts">
import type { User } from '~/types/entities'

const page = ref(1)
const openRecordModal = ref(false)

const { data: currentUser } = useNuxtData<User>('current-user')
const { data, status } = await useAsyncData(
  `habits/user/${currentUser.value.id}`,
  () => {
    return Promise.all([
      $fetch(`/api/reading-habits/${currentUser.value.id}/statistic`),
      $fetch(`/api/reading-habits/${currentUser?.value?.id}`, {
        query: {
          page: page.value,
        },
      }),
    ])
  },
  {
    watch: [page],
  },
)
</script>

<template>
  <div>
    <section class="flex items-center justify-between">
      <h2 class="font-medium">Personal Reading Habits</h2>
      <UButton @click="openRecordModal = true" trailing-icon="ph:plus"
        >Record baru</UButton
      >
    </section>

    <div class="my-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div
        class="flex flex-col rounded border border-fuchsia-300 bg-fuchsia-50 px-4 py-2 text-fuchsia-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:bowl-steam-duotone" class="h-5 w-5" />
          <small>GENRE TERBANYAK</small>
        </div>
        <p class="text-lg font-semibold">{{ data[0].mostGenre }}</p>
      </div>
      <div
        class="flex flex-col rounded border border-teal-300 bg-teal-50 px-4 py-2 text-teal-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:lamp-pendant-duotone" class="h-5 w-5" />
          <small>TOTAL RECORD</small>
        </div>
        <p class="text-lg font-semibold">
          {{ data[0].totalRecord }}
        </p>
      </div>
      <div
        class="flex flex-col rounded border border-orange-300 bg-orange-50 px-4 py-2 text-orange-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:clover-duotone" class="h-5 w-5" />
          <small>TOTAL POIN</small>
        </div>
        <p class="text-lg font-semibold">{{ data[0].totalPoint }}</p>
      </div>
      <div
        class="flex flex-col rounded border border-rose-300 bg-rose-50 px-4 py-2 text-rose-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:paragraph-duotone" class="h-5 w-5" />
          <small>TOTAL HALAMAN</small>
        </div>
        <p class="text-lg font-semibold">{{ data[0].pageCountTotal }}</p>
      </div>
    </div>

    <LazyDashboardReadingModalForm v-model:open="openRecordModal" />
    <ReadingHabitTable
      v-model:page="page"
      :total="data[1]?.pagination.total"
      :data="data[1].data"
      :with-name="false"
      :is-loading="status === 'pending'"
    />
  </div>
</template>
