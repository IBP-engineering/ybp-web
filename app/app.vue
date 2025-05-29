<script setup lang="ts">
import { id } from '@nuxt/ui/locale'

useHead({
  script: [
    {
      src: 'https://liwan.kalwabed.com/script.js',
      type: 'module',
      id: 'ybp-web-script',
      'data-entity': 'ybp-web',
    },
  ],
})
</script>

<template>
  <UApp :locale="id">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
@import url(./styles/tailwind.css);

html,
body,
#__nuxt {
  height: 100%;
}
</style>
