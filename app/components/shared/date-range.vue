<script setup lang="ts">
import { sub, format, add } from 'date-fns'

const selected = defineModel('selected', {
  default: { start: sub(new Date(), { days: 7 }), end: new Date() },
})
const disabledDates = ref([{ start: add(new Date(), { days: 1 }), end: null }])
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid">
      {{ format(selected.start, 'd MMM, yyy') }} -
      {{ format(selected.end, 'd MMM, yyy') }}
    </UButton>

    <template #panel="{ close }">
      <div
        class="flex items-center divide-gray-200 sm:divide-x dark:divide-gray-800"
      >
        <SharedDatePicker
          :disabled-dates="disabledDates"
          v-model="selected"
          @close="close"
        />
      </div>
    </template>
  </UPopover>
</template>
