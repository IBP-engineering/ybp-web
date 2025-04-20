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
