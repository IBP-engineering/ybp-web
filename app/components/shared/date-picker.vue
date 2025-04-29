<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import type {
  DatePickerDate,
  DatePickerRangeObject,
  // @ts-expect-error not found module
} from 'v-calendar/dist/types/src/use/datePicker'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<
      DatePickerDate | DatePickerRangeObject | null
    >,
    default: null,
  },
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:model-value', value)
    emit('close')
  },
})

const attrs = {
  transparent: true,
  borderless: true,
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}

function onDayClick(_: unknown, event: MouseEvent): void {
  const target = event.target as HTMLElement
  target.blur()
}
</script>

<template>
  <VCalendarDatePicker
    v-if="
      date &&
      (date as DatePickerRangeObject)?.start &&
      (date as DatePickerRangeObject)?.end
    "
    v-model.range="date"
    :columns="2"
    v-bind="{ ...attrs, ...$attrs }"
    @dayclick="onDayClick"
  />
  <VCalendarDatePicker
    v-else
    v-model="date"
    v-bind="{ ...attrs, ...$attrs }"
    @dayclick="onDayClick"
  />
</template>

<style>
:root {
  --vc-neutral-50: var(--color-neutral-50);
  --vc-neutral-100: var(--color-neutral-100);
  --vc-neutral-200: var(--color-neutral-200);
  --vc-neutral-300: var(--color-neutral-300);
  --vc-neutral-400: var(--color-neutral-400);
  --vc-neutral-500: var(--color-neutral-500);
  --vc-neutral-600: var(--color-neutral-600);
  --vc-neutral-700: var(--color-neutral-700);
  --vc-neutral-800: var(--color-neutral-800);
  --vc-neutral-900: var(--color-neutral-900);
}

.vc-primary {
  --vc-accent-50: var(--ui-color-primary-50);
  --vc-accent-100: var(--ui-color-primary-100);
  --vc-accent-200: var(--ui-color-primary-200);
  --vc-accent-300: var(--ui-color-primary-300);
  --vc-accent-400: var(--ui-color-primary-400);
  --vc-accent-500: var(--ui-color-primary-500);
  --vc-accent-600: var(--ui-color-primary-600);
  --vc-accent-700: var(--ui-color-primary-700);
  --vc-accent-800: var(--ui-color-primary-800);
  --vc-accent-900: var(--ui-color-primary-900);
}
</style>
