<script setup lang="ts">
const socials = [
  {
    link: '#',
    label: 'Grup Whatsapp',
    title: 'YBP Whatsapp group',
    logo: 'ph:whatsapp-logo-fill',
    theme: 'border-green-300 bg-green-200 hover:bg-green-100 text-green-900',
  },
  {
    link: 'https://www.instagram.com/yogbookparty',
    label: 'Ikuti di Instagram',
    title: 'YBP Instagram page',
    logo: 'ph:instagram-logo-fill',
    theme:
      'border-fuchsia-300 bg-fuchsia-200 hover:bg-fuchsia-100 text-fuchsia-900',
  },
  {
    link: 'https://x.com/yogyabookparty',
    label: 'Ikuti di X',
    title: 'YBP X page',
    logo: 'ph:x-logo-fill',
    theme: 'border-sky-300 bg-sky-200 hover:bg-sky-100 text-sky-900',
  },
  {
    link: 'https://open.spotify.com/show/7eKH6ulaGTnGB6ZMCy1pbS',
    label: 'YBP Malam Imajinasi',
    title: 'YBP Spotify page',
    logo: 'ph:spotify-logo-fill',
    theme:
      'border-emerald-300 bg-emerald-200 hover:bg-emerald-100 text-emerald-900',
  },
  {
    link: 'https://discord.com/invite/V4G7Byd9Z4',
    label: 'Server Indonesia Book Party',
    title: 'IBP Discord server',
    logo: 'ph:discord-logo-fill',
    theme:
      'border-indigo-300 bg-indigo-200 hover:bg-indigo-100 text-indigo-900',
  },
]
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center">
    <h3 class="text-xl leading-relaxed">Mari bergabung dan ikuti kami</h3>

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
