<script setup lang="ts">
const markImages = Array.from({ length: 16 }).map(
  (_, i) => `/marquee/${i + 1}.webp`,
)
</script>

<template>
  <div class="grayscale transition duration-300 hover:grayscale-0">
    <Vue3Marquee :duration="40">
      <div v-for="path in markImages" :key="path" class="mx-1 w-[250px]">
        <img :src="path" alt="Momen di YBP" class="h-full w-full rounded-lg" />
      </div>
    </Vue3Marquee>
  </div>
</template>
