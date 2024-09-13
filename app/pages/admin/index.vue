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
      <div v-for="v in [1, 2, 3]" :key="v.toString()" class="flex gap-4">
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
          <NuxtLink
            class="text-2xl font-semibold hover:text-primary-600 leading-relaxed"
            to="/articles/hehe"
          >
            Ketika kekuasaan disalahgunakan
          </NuxtLink>
          <div class="text-gray-600">
            <span> oleh </span>
            <ULink
              to="/users/123"
              inactive-class="underline hover:text-primary-600"
              >Kalwabed Rizki</ULink
            >
          </div>
          <p class="text-gray-600">17 Agu 2024, 11:23</p>
          <NuxtLink
            class="text-gray-600 hover:underline mt-4 flex items-center"
            to="/articles/hehe"
            >Detail <UIcon name="i-heroicons:arrow-up-right-solid"
          /></NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>
