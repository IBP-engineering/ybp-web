<template>
  <div class="flex h-full w-full flex-auto flex-col bg-gray-100">
    <slot />
    <div
      class="layout-bg mt-auto min-h-[16rem] w-full bg-gray-100 bg-cover md:bg-auto"
    />
  </div>
</template>

<style>
.layout-bg {
  background-image: url('/assets/login-ambience.svg');
}
</style>
