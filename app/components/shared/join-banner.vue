<script setup lang="ts">
defineSlots<{ default: string; title: string }>()

const route = useRoute()
const currentPath = computed(() => route.fullPath)
</script>

<template>
  <div
    class="space-y-2 border-2 border-dotted border-neutral-300 bg-gradient-to-t from-neutral-100 to-neutral-50 p-2"
  >
    <UIcon name="ph:flag-banner-duotone" />
    <span class="ml-1">
      <slot name="title">Haloo Bookmates!</slot>
    </span>
    <small class="block text-neutral-600">
      <slot></slot>
    </small>
    <UButton
      size="sm"
      variant="soft"
      color="warning"
      icon="ph:sparkle-duotone"
      :to="{
        path: '/login',
        query: {
          redirect: currentPath,
        },
      }"
      >Gabung sekarang</UButton
    >
  </div>
</template>
