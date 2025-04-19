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
    <NuxtImg
      :src="img"
      width="700"
      height="400"
      alt="Activity cover"
      class="mx-auto w-[700px] h-[400px] object-center object-cover rounded-xl border border-neutral-300 shadow-lg"
      :quality="100"
    />

    <h2 class="mt-4 text-3xl leading-relaxed font-bold">{{ title }}</h2>

    <slot></slot>
  </div>
</template>
