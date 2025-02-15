<script setup lang="ts">
import { format } from 'date-fns'
import id from 'date-fns/locale/id'

defineOgImageComponent('default')
useSeoMeta({
  title: 'Reading Habits',
  description:
    'Ketika membaca menjadi sebuah kebiasaan. YBP punya cara untuk menjadikannya sebuah reward',
})

const router = useRouter()
const route = useRoute()
const page = ref(1)
const date = ref(
  route.query?.date
    ? format(new Date(route.query?.date as string), 'P')
    : format(new Date(), 'P'),
)

watch(date, () => {
  if (date.value) {
    // reset to page 1 whenever date is changed
    page.value = 1
    router.replace({
      query: {
        date: format(new Date(date.value), 'P'),
      },
    })
  }
})

const { data: habits, status } = await useFetch('/api/reading-habits', {
  query: {
    date,
    page,
  },
  watch: [date],
  key: `habits/${format(new Date(date.value), 'P')}/?page=${page.value}`,
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
      :links="breadcrumbs"
      divider="/"
      class="mb-4 flex justify-center"
    />
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">
        <span class="text-primary-500">Read</span>ing Habits
      </h1>
      <p class="text-gray-600">
        Ketika membaca menjadi sebuah kebiasaan. YBP punya cara untuk
        menjadikannya sebuah reward
      </p>
    </section>

    <div class="mt-16 flex items-center justify-between">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-heroicons-calendar-days-20-solid"
          :label="format(new Date(date), 'd MMM, yyy')"
        />

        <template #panel="{ close }">
          <SharedDatePicker v-model="date" @close="close" />
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
