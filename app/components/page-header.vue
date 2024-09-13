<script setup lang="ts">
defineProps<{ title: string; buttonText?: string }>()
defineEmits<{
  btnClick: [show: boolean]
}>()
</script>

<template>
  <div class="w-full border-b bg-white">
    <div
      class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-12"
    >
      <h1 class="text-3xl">
        {{ title }}
      </h1>
      <UButton
        v-if="Boolean(buttonText)"
        size="md"
        @click="$emit('btnClick', true)"
      >
        {{ buttonText }}
      </UButton>
    </div>
  </div>
</template>
