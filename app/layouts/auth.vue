<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'id',
  },
})
</script>

<template>
  <div class="flex h-full w-full flex-auto flex-col bg-neutral-100 font-sans">
    <slot />
    <div
      class="layout-bg mt-auto min-h-[16rem] w-full bg-neutral-100 bg-cover md:bg-auto"
    />
  </div>
</template>

<style>
.layout-bg {
  background-image: url('/assets/login-ambience.svg');
}
</style>
