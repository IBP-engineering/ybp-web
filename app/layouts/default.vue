<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'id',
  },
})
</script>

<template>
  <div
    class="relative flex min-h-full w-full flex-auto flex-col overflow-hidden font-sans"
  >
    <NuxtImg
      src="/assets/main-bg-blur.svg"
      width="300"
      height="300"
      class="absolute top-0 -left-48 z-[4] w-full md:-top-20 md:left-0"
      alt="blur bg"
    />
    <LayoutHeader />
    <main class="z-10 mt-[7rem] mb-24 h-full md:mt-[8rem]">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
