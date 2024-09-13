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

    <div class="mx-auto mt-8 grid w-full max-w-screen-lg grid-cols-1 gap-8">
      <div
        v-for="v in [1, 2, 3]"
        :key="v.toString()"
        class="flex gap-4"
      >
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
            class="hover:text-primary-600 text-2xl font-semibold leading-relaxed"
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
