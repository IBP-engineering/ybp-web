<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<style>
@import url(./styles/tailwind.css);

html,
body,
#__nuxt {
  height: 100%;
}

html {
  scroll-behavior: smooth;
}
</style>
