<script setup lang="ts">
defineSlots<{ default: any; title: any }>()
</script>

<template>
  <div
    class="mt-8 space-y-2 border-2 border-dotted border-gray-300 bg-gradient-to-t from-gray-100 to-gray-50 p-2"
  >
    <UIcon name="ph:flag-banner-duotone" />
    <span class="ml-1">
      <slot name="title">Haloo Bookmates!</slot>
    </span>
    <small class="block text-gray-600">
      <slot></slot>
    </small>
    <UButton
      size="sm"
      variant="outline"
      color="yellow"
      icon="ph:sparkle-duotone"
      to="/login"
      >Gabung sekarang</UButton
    >
  </div>
</template>
