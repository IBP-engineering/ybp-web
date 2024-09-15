<template>
  <div class="flex w-full flex-auto flex-col bg-gray-100">
    <slot />
    <div class="layout-bg h-[16rem] w-full bg-cover md:bg-auto" />
  </div>
</template>

<style>
.layout-bg {
  background-image: url('/assets/login-ambience.svg');
}
</style>
