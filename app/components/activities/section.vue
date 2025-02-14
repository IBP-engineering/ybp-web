<script setup lang="ts">
defineProps<{
  img: string
  id: string
  title: string
}>()
</script>

<template>
  <div
    :id="id"
    class="mt-32 flex scroll-m-28 flex-col items-center justify-center"
  >
    <img
      :src="img"
      width="700"
      height="300"
      alt="yaudah"
      class="mx-auto rounded-xl border"
    />

    <h2 class="mt-4 text-3xl font-bold leading-relaxed">{{ title }}</h2>

    <slot></slot>
  </div>
</template>
