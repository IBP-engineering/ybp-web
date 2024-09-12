<script setup lang="ts">
useHead({
  title: 'Dashboard',
})
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div>
    <PageHeader title="Articles" />

    <div class="mt-8 w-full max-w-screen-lg grid grid-cols-1 gap-8 mx-auto">
      <div v-for="_ in [1, 2, 3]" class="flex gap-4">
        <div>
          <img
            src="https://picsum.photos/250/130"
            alt="Cover"
            width="250"
            height="130"
            class="rounded-sm"
          />
        </div>
        <section>
          <h2 class="text-2xl font-semibold leading-relaxed">
            Ketika kekuasaan disalahgunakan
          </h2>
          <p class="text-gray-600">oleh Kalwabed Rizki</p>
          <p class="text-gray-600">17 Agu 2024, 11:23</p>
          <NuxtLink
            class="text-gray-600 hover:underline mt-4 block"
            to="/articles/hehe"
            >Detail -></NuxtLink
          >
        </section>
      </div>
    </div>
  </div>
</template>
