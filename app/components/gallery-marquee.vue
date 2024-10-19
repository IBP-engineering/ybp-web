<script setup lang="ts">
import '@selemondev/vue3-marquee/dist/style.css'
import { Marquee as Mq } from '@selemondev/vue3-marquee'

const markImages = Array.from({ length: 16 }).map(
  (_, i) => `/marquee/${i + 1}.webp`,
)
</script>

<template>
  <Mq fade class="grayscale transition duration-300 hover:grayscale-0">
    <div v-for="path in markImages" :key="path" class="w-[250px]">
      <img :src="path" alt="Momen di YBP" class="h-full w-full rounded-lg" />
    </div>
  </Mq>
</template>
