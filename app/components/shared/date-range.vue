<script setup lang="ts">
import { format, sub } from 'date-fns'

const selected = defineModel<{ start: Date; end: Date }>('selected', {
  default: { start: sub(new Date(), { days: 7 }), end: new Date() },
})

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
