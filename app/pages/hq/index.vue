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
    <PageHeader title="Articles" />

    <div class="mx-auto mt-8 grid w-full max-w-screen-lg grid-cols-1 gap-8">
      <div v-for="v in samples" :key="v.title" class="flex gap-4">
        <div class="relative">
          <img
            src="https://picsum.photos/250/130"
            alt="Cover"
            width="250"
            height="130"
            class="rounded-sm"
          />
          <div
            v-if="v.status === 'verified'"
            class="border-primary-300 bg-primary-50 absolute -right-3 -top-2 h-7 w-7 rounded-full border"
          >
            <UIcon
              name="i-heroicons:check-badge-solid"
              class="text-primary-500 h-6 w-6"
            />
          </div>
        </div>
        <section>
          <NuxtLink
            class="hover:text-primary-600 text-2xl font-semibold leading-relaxed"
            to="/hq/articles/hehe"
          >
            {{ v.title }}
          </NuxtLink>
          <div class="text-gray-600">
            <span> oleh </span>
            <ULink
              to="/users/123"
              inactive-class="underline hover:text-primary-600"
              >{{ v.author }}</ULink
            >
          </div>
          <p class="text-gray-600">17 Agu 2024, 11:23</p>
          <NuxtLink
            class="mt-4 flex items-center text-gray-600 hover:underline"
            to="/articles/hehe"
          >
            Detail
            <UIcon name="i-heroicons:arrow-up-right-solid" />
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>
