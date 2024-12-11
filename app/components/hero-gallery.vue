<script setup lang="ts">
const markImages = Array.from({ length: 5 }).map(
  (_, i) => `/marquee/${i + 1}.webp`,
)
</script>

<template>
  <section
    class="w-full overflow-y-hidden overflow-x-scroll pb-4 pt-16 [-ms-overflow-style:none] [scrollbar-width:none] lg:py-20 [&::-webkit-scrollbar]:hidden"
  >
    <ul class="-mx-20 flex justify-center gap-3 lg:gap-6">
      <li
        v-for="path in markImages"
        :key="path"
        class="w-[220px] flex-shrink-0 py-3 odd:-rotate-3 even:rotate-3 lg:w-auto"
      >
        <NuxtImg
          :src="path"
          alt="Momen di YBP"
          width="380"
          height="270"
          loading="lazy"
          class="bg-primary-200 rounded-lg"
        />
      </li>
    </ul>
  </section>
</template>
