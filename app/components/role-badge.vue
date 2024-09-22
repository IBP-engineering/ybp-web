<script setup lang="ts">
withDefaults(defineProps<{ name?: string }>(), { name: 'none' })

const toneColor = {
  admin: 'border-teal-700 bg-teal-500',
  member: 'border-purple-700 bg-purple-500',
  editor: 'border-zinc-700 bg-zinc-500',
  none: 'border-red-700 bg-red-500',
}
</script>

<template>
  <p
    class="inline-flex w-fit items-center gap-1 rounded border px-1 text-xs font-medium text-white"
    :class="toneColor[name]"
    :title="`Role: ${name}`"
  >
    <UIcon name="i-heroicons:sparkles-20-solid" />
    {{ name.toUpperCase() }}
  </p>
</template>
