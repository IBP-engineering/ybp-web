<script setup lang="ts">
defineSlots<{ default: string; title: string }>()
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
      to="/login"
      >Gabung sekarang</UButton
    >
  </div>
</template>
