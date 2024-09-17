<script setup lang="ts">
useHead({
  title: 'Dashboard',
})
definePageMeta({
  layout: 'dashboard',
})

const samples = [
  {
    title: 'Ketika kekuasaan disalahgunakan',
    author: 'Kalwabed Rizki',
    status: 'verified',
  },
  {
    title: 'Tidur beralaskan jerami',
    author: 'Kalwabed Rizki',
    status: 'rejected',
  },
  {
    title: 'Kepanasan disengat hawa panas matahari ',
    author: 'Kalwabed Rizki',
    status: 'pending',
  },
]
</script>

<template>
  <div>
    <PageHeader title="Stories" />

    <div class="mx-auto mt-8 w-full max-w-screen-lg space-y-8 px-4 lg:px-0">
      <StoryCard v-for="v in samples" :story="v" :key="v.title" />
    </div>
  </div>
</template>
