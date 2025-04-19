<script setup lang="ts">
defineProps<{
  img: string
  id: string
  title: string
  useNativeImg?: boolean
}>()

const width = 700
const height = 400
</script>

<template>
  <div
    :id="id"
    class="mt-32 flex scroll-m-28 flex-col items-center justify-center"
  >
    <img
      v-if="useNativeImg"
      :src="img"
      :width="width"
      :height="height"
      alt="Activity cover"
      class="mx-auto w-[700px] h-[400px] object-center object-cover rounded-xl border border-neutral-300 shadow-lg"
      loading="lazy"
      decoding="async"
    />
    <NuxtImg
      v-else
      :src="img"
      :width="width"
      :height="height"
      alt="Activity cover"
      class="mx-auto w-[700px] h-[400px] object-center object-cover rounded-xl border border-neutral-300 shadow-lg"
      loading="lazy"
    />

    <h2 class="mt-4 text-3xl leading-relaxed font-bold">{{ title }}</h2>

    <slot></slot>
  </div>
</template>
