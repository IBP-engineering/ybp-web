<script setup lang="ts">
const markImages = Array.from({ length: 6 }).map(
  (_, i) => `/marquee/${i + 1}.webp`,
)
</script>

<template>
  <div class="grayscale transition duration-300 hover:grayscale-0">
    <div
      class="flex justify-center gap-4 overflow-y-hidden overflow-x-scroll py-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:overflow-x-hidden [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="path in markImages"
        :key="path"
        class="h-[150px] w-[150px] flex-shrink-0 odd:-rotate-3 even:rotate-3 md:h-auto md:w-[300px]"
      >
        <img
          :src="path"
          alt="Momen di YBP"
          class="h-auto w-full rounded-lg object-cover"
        />
      </div>
    </div>
  </div>
</template>
