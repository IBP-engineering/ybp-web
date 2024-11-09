<script setup lang="ts">
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
    <div class="mx-auto mt-[10rem] flex w-full flex-col px-6 md:px-0">
      <div>
        <img
          src="~/assets/images/logo.jpg"
          decoding="async"
          loading="lazy"
          width="150"
          height="150"
          class="z-20 mx-auto rounded-full border"
          alt="YBP logo"
        />
      </div>
      <div
        class="z-20 mx-auto mt-6 w-full space-y-4 rounded border bg-white p-4 shadow md:w-[24rem]"
      >
        <b>Masuk dengan akunmu</b>

        <SharedLoginForm />
      </div>
    </div>
  </div>
</template>
