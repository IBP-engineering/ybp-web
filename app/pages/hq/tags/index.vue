<script setup lang="ts">
definePageMeta({
  layout: 'hq',
  middleware: ['admin-only'],
})

useHead({
  title: 'Tags',
})
</script>

<template>
  <div>
    <PageHeader title="Tags" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: 10</p>
    </div>
  </div>
</template>
