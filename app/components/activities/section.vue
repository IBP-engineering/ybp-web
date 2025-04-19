<script setup lang="ts">
const props = defineProps<{
  img: string
  id: string
  title: string
}>()

const isDEV = import.meta.env.DEV
const currentUrl = import.meta.server ? '' : window.location.origin
const width = 700
const height = 400
const src = isDEV
  ? props.img
  : `https://wsrv.nl/?url=${currentUrl.concat(props.img)}&w=${width}&h=${height}&output=webp`
</script>

<template>
  <div
    :id="id"
    class="mt-32 flex scroll-m-28 flex-col items-center justify-center"
  >
    <img
      :src="src"
      :width="width"
      :height="height"
      alt="Activity cover"
      class="mx-auto w-[700px] h-[400px] object-center object-cover rounded-xl border border-neutral-300 shadow-lg"
      loading="lazy"
      decoding="async"
    />

    <h2 class="mt-4 text-3xl leading-relaxed font-bold">{{ title }}</h2>

    <slot></slot>
  </div>
</template>
