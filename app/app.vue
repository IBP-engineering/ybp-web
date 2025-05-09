<script setup lang="ts">
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
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<style>
@import url(./styles/tailwind.css);

html,
body,
#__nuxt {
  height: 100%;
}
</style>
