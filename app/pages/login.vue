<script setup lang="ts">
defineOgImageComponent('default')
definePageMeta({
  layout: 'auth',
})
useSeoMeta({
  title: 'Masuk',
  description:
    'Masuk sebagai anggota atau editor menggunakan email dan password',
})
</script>

<template>
  <div class="relative flex h-full w-full justify-center">
    <UButton
      class="absolute top-4 left-2"
      icon="ph:caret-left"
      to="/"
      variant="ghost"
      color="neutral"
      >Home</UButton
    >
    <div
      class="mx-auto mt-[16rem] flex w-full flex-col px-6 md:px-0 md:w-[24rem]"
    >
      <div>
        <NuxtImg
          src="/assets/logo.jpg"
          width="60"
          height="60"
          class="z-20 rounded-sm mx-auto md:mx-0 border"
          alt="YBP logo"
        />
      </div>
      <div class="z-20 mx-auto mt-6 flex w-full flex-col gap-4 rounded">
        <b class="text-center font-bold md:text-left"
          >Masuk ke Yogyakarta Book Party</b
        >
        <SharedLoginForm />
      </div>
    </div>
  </div>
</template>
