<script setup lang="ts">
const socials = [
  {
    link: 'https://whatsapp.com/haha',
    label: 'YBP Whatsapp group',
    title: 'YBP Whatsapp group',
    logo: 'ph:whatsapp-logo-fill',
    theme: 'border-green-300 bg-green-200 hover:bg-green-100 text-green-900',
  },
  {
    link: 'https://instagram.com/haha',
    label: '@yogbookparty',
    title: 'YBP Instagram page',
    logo: 'ph:instagram-logo-fill',
    theme:
      'border-fuchsia-300 bg-fuchsia-200 hover:bg-fuchsia-100 text-fuchsia-900',
  },
  {
    link: 'https://x.com/haha',
    label: '@yogbookparty',
    title: 'YBP X page',
    logo: 'ph:x-logo-fill',
    theme: 'border-cyan-300 bg-cyan-200 hover:bg-cyan-100 text-cyan-900',
  },
]
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center">
    <h3 class="text-xl font-bold leading-relaxed">Bergabung dan ikuti kami</h3>

    <div class="mt-4 flex w-full flex-wrap justify-center gap-4">
      <NuxtLink
        v-for="social in socials"
        :key="social.link"
        :to="social.link"
        class="flex w-fit items-center gap-2 rounded-lg border p-2 font-medium transition"
        :class="social.theme"
        target="_blank"
        :title="social.title"
        external
        ><UIcon :name="social.logo" class="h-8 w-8" />
        <span>{{ social.label }}</span></NuxtLink
      >
    </div>
  </div>
</template>
