<script setup lang="ts">
import { sub } from 'date-fns'

defineOgImageComponent('default')
useHead({
  title: 'Reading habits leaderboard',
})

const selected = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <section class="text-center">
      <h1 class="text-4xl font-bold leading-relaxed">Klasemen sementara</h1>
      <p class="text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui provident
        corporis asperiores dignissimos sint impedit.
      </p>
    </section>

    <div class="mx-auto mt-8 flex w-full justify-center">
      <SharedDateRange v-model:selected="selected" />
    </div>
  </div>
</template>
