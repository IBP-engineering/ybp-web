<template>
  <div class="flex flex-col w-full flex-auto h-full bg-gray-100">
    <slot />
    <div class="layout-bg w-full h-[16rem] bg-cover md:bg-auto" />
  </div>
</template>

<style>
.layout-bg {
  background-image: url('/assets/login-ambience.svg');
}
</style>
