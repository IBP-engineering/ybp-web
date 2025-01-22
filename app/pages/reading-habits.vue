<script setup lang="ts">
import { format } from 'date-fns'

defineOgImageComponent('default')
useHead({
  title: 'Reading Habits',
})

const page = ref(1)
const date = ref(new Date())

watch(date, () => {
  if (date.value) {
    // reset to page 1 whenever date is changed
    page.value = 1
  }
})

const { data: habits, status } = await useFetch('/api/reading-habits', {
  query: {
    date,
    page,
  },
  watch: [date],
  key: `habits/${date.value.toDateString()}/?page=${page.value}`,
})
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">Reading Habits</h1>
      <p class="text-gray-600">
        Ketika membaca menjadi sebuah kebiasaan. YBP punya cara untuk
        menjadikannya sebuah reward.
      </p>
    </section>

    <div class="mt-12 flex items-center justify-between">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-heroicons-calendar-days-20-solid"
          :label="format(date, 'd MMM, yyy')"
        />

        <template #panel="{ close }">
          <SharedDatePicker v-model="date" @close="close" />
        </template>
      </UPopover>

      <UButton
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
