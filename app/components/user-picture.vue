<script setup lang="ts">
withDefaults(
  defineProps<{
    seed?: string
  }>(),
  {
    seed: 'default',
  },
)
</script>

<template>
  <img
    :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`"
    alt="Profile picture"
    class="rounded-full border-2 border-gray-300 bg-gray-50"
    width="110"
    height="110"
    loading="lazy"
    decoding="async"
  />
</template>
