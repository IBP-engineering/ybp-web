<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const slug = route.params.slug
</script>

<template>
  <div>
    <PageHeader title="Hehe" back-button-text="Articles" mode="detail" />
    <p>params: {{ slug }}</p>
  </div>
</template>
