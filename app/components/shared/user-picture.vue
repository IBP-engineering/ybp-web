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
    :src="`${avatarBaseUrl}?seed=${seed}`"
    alt="Profile picture"
    class="rounded-full border-2 border-neutral-300 bg-neutral-50"
    width="110"
    height="110"
    loading="lazy"
    decoding="async"
  />
</template>
