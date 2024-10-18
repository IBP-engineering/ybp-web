<script setup lang="ts">
defineProps<{
  tag: string
}>()
</script>

<template>
  <NuxtLink
    class="hover:bg-primary-100 hover:border-primary-300 hover:text-primary-900 rounded border border-transparent px-2 py-1 font-light transition"
    :to="`/t/${tag}`"
    >#{{ tag }}</NuxtLink
  >
</template>
