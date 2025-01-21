<script setup lang="ts">
import { format } from 'date-fns'

defineOgImageComponent('default')
useHead({
  title: 'Reading Habits',
})

const page = ref(1)
const date = ref(new Date())

const { data: habits, status } = await useFetch('/api/reading-habits', {
  query: {
    date,
    page,
  },
  watch: [date],
  key: `habits/${date.value.toDateString()}/?page=${page.value}`,
})

const total = ref(habits?.value?.pagination.total ?? 0)
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">Reading Habits</h1>
      <p class="text-gray-600">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi
        ipsam, harum saepe quas in et?
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

    <div class="mt-8">
      <ReadingHabitTable
        v-model:page="page"
        :total="total"
        :is-loading="status === 'pending'"
        :view-only="true"
        :data="habits?.data ?? []"
      />
    </div>
  </div>
</template>
