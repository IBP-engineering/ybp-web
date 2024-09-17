<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Detail member',
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
    <PageHeader
      title="Detail member"
      mode="detail"
      back-button-text="Members"
      back-button-href="/hq/members"
    />
    <div class="mx-auto w-full max-w-screen-xl">
      <div class="flex w-full flex-col-reverse justify-between p-4 md:flex-row">
        <div>
          <RoleBadge />
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold md:text-4xl">Lughos Sari</h1>
            <span class="text-sm text-gray-600"> < hi@myemail.com > </span>
          </div>
          <p>@jamroji123</p>
          <p class="mb-3">Bergabung pada 17 Agu 2024, 11:23</p>
          <UButton
            block
            class="inline-flex md:hidden"
            variant="outline"
            color="gray"
            >Edit</UButton
          >
        </div>

        <div class="flex flex-col items-center gap-2">
          <img
            src="https://api.dicebear.com/9.x/shapes/svg?seed=paijo"
            alt="Profile picture"
            class="rounded-full border bg-gray-50"
            width="110"
            height="110"
          />
          <UButton class="hidden md:inline-flex" variant="outline" color="gray"
            >Edit</UButton
          >
        </div>
      </div>
      <div class="mt-4 space-y-4 px-4">
        <h2 class="text-lg">Daftar cerita</h2>
        <StoryCard v-for="v in samples" :story="v" :key="v.title" />
      </div>
    </div>
  </div>
</template>
