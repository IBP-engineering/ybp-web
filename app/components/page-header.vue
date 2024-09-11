<script setup lang="ts">
defineProps<{ title: string; buttonText: string }>()
defineEmits<{
  btnClick: [show: boolean]
}>()
</script>

<template>
  <div class="w-full bg-white border-b">
    <div
      class="max-w-screen-xl mx-auto w-full flex justify-between items-center py-12 px-4"
    >
      <h1 class="text-3xl">
        {{ title }}
      </h1>
      <UButton size="md" @click="$emit('btnClick', true)">
        {{ buttonText }}
      </UButton>
    </div>
  </div>
</template>
