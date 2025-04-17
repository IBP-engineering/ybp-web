<script setup lang="ts">
import { sub, format, add } from 'date-fns'

const selected = defineModel('selected', {
  default: { start: sub(new Date(), { days: 7 }), end: new Date() },
})

const disabledDates = ref([{ start: add(new Date(), { days: 1 }), end: null }])
const openPopover = ref(false)
</script>

<template>
  <UPopover v-model:open="openPopover" :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid">
      {{ format(selected.start, 'd MMM, yyy') }} -
      {{ format(selected.end, 'd MMM, yyy') }}
    </UButton>

    <template #content>
      <div
        class="flex items-center divide-neutral-200 sm:divide-x dark:divide-neutral-800"
      >
        <SharedDatePicker
          v-model="selected"
          @close="() => (openPopover = false)"
        />
      </div>
    </template>
  </UPopover>
</template>
