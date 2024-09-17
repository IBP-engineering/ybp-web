<script setup lang="ts">
const props = defineProps<{
  story: any
}>()
</script>

<template>
  <div
    class="flex flex-col gap-0 rounded border border-gray-200 bg-white shadow transition hover:shadow-lg md:flex-row md:gap-4 md:pr-2"
  >
    <div class="relative">
      <img
        src="https://picsum.photos/250/130"
        alt="Cover"
        width="250"
        height="130"
        class="h-full w-full rounded-t md:rounded-l md:rounded-tr-none"
      />
      <div
        v-if="story.status === 'verified'"
        class="border-primary-300 bg-primary-50 absolute right-0 top-0 h-7 w-7 rounded-full border md:-right-3 md:-top-2"
      >
        <UIcon
          name="i-heroicons:check-badge-solid"
          class="text-primary-500 h-6 w-6"
        />
      </div>
    </div>
    <section class="px-2 py-2 md:px-0">
      <NuxtLink
        class="hover:text-primary-600 text-lg font-semibold leading-relaxed md:text-2xl"
        to="/hq/stories/hehe"
      >
        {{ story.title }}
      </NuxtLink>
      <div class="text-gray-600">
        <span> oleh </span>
        <ULink
          to="/users/123"
          inactive-class="underline hover:text-primary-600"
          >{{ story.author }}</ULink
        >
      </div>
      <p class="text-gray-600">17 Agu 2024, 11:23</p>
      <NuxtLink
        class="mt-4 flex items-center text-gray-600 hover:underline"
        to="/hq/stories/hehe"
      >
        Detail
        <UIcon name="i-heroicons:arrow-up-right-solid" />
      </NuxtLink>
    </section>
  </div>
</template>
