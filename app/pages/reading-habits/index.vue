<script setup lang="ts">
import { format } from 'date-fns'

defineOgImageComponent('default')
useSeoMeta({
  title: 'Reading Habits',
  description:
    'Ketika membaca menjadi sebuah kebiasaan. YBP punya cara untuk menjadikannya sebuah reward',
})

const router = useRouter()
const route = useRoute()
const page = ref(1)
const openDatePicker = ref(false)
const date = ref(
  route.query?.date
    ? format(new Date(route.query?.date as string), 'P')
    : format(new Date(), 'P'),
)
const formattedDateQuery = ref(date.value)

watch(
  [date, () => route.query],
  ([newDate, currentQuery]) => {
    if (!newDate) return

    // reset to page 1 whenever date is changed
    page.value = 1
    const formattedDate = format(new Date(newDate), 'P')
    formattedDateQuery.value = formattedDate

    router.replace({
      query: {
        ...currentQuery,
        date: formattedDate,
      },
    })
  },
  { immediate: true },
)

const { data: habits, status } = await useFetch('/api/reading-habits', {
  query: {
    date: formattedDateQuery,
    page,
  },
  watch: [formattedDateQuery],
  key: `habits/${format(new Date(formattedDateQuery.value), 'P')}/?page=${page.value}`,
})

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Reading habits',
    to: '/reading-habits',
  },
]
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
        <span class="text-primary-500">Read</span>ing Habits
      </h1>
      <p class="text-neutral-600">
        Ketika membaca menjadi sebuah kebiasaan. YBP punya cara untuk
        menjadikannya sebuah reward
      </p>
    </section>

    <div class="mt-16 flex items-center justify-between">
      <UPopover
        v-model:open="openDatePicker"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          icon="i-heroicons-calendar-days-20-solid"
          :label="format(new Date(date), 'd MMM, yyy')"
        />

        <template #content>
          <SharedDatePicker
            v-model="date"
            @close="() => (openDatePicker = false)"
          />
        </template>
      </UPopover>

      <UButton
        to="/reading-habits/leaderboard"
        variant="link"
        trailing-icon="heroicons:arrow-small-right-20-solid"
        >Lihat klasemen</UButton
      >
    </div>

    <div class="my-4">
      <ReadingHabitTable
        v-model:page="page"
        :total="habits?.pagination.total"
        :is-loading="status === 'pending'"
        :view-only="true"
        :data="habits?.data ?? []"
      />
    </div>

    <SharedJoinBanner>
      Pengen ikutan namamu bisa ada di daftar di atas? Yuk, ikutan bersama
      Bookmates lainnya di tantangan Reading Habits dari YBP. Siapa tahu kamu
      adalah pemenang selanjutnya. 👀👀
    </SharedJoinBanner>
  </div>
</template>
