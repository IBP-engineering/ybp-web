<script setup lang="ts">
const samples = [
  {
    key: '1',
    title: 'hei 1',
  },
  {
    key: '2',
    title: 'hei 2',
  },
]

const storyOptions = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons:pencil-square',
    },
    {
      label: 'Archive',
      icon: 'i-heroicons:folder-open',
    },
    {
      label: 'Delete',
      class: 'bg-red-100 hover:bg-red-200 text-red-900',
      iconClass: 'text-red-900',
      icon: 'i-heroicons:trash',
    },
  ],
]
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg">
    <h1 class="text-2xl font-bold leading-relaxed">Dashboard</h1>
    <p class="text-gray-600">Kamu bisa temukan cerita yang kamu kirim disini</p>

    <h2 class="mb-2 mt-4 font-bold">Stories</h2>
    <div
      class="grid w-full grid-cols-1 overflow-hidden rounded-lg border border-gray-300"
    >
      <div
        v-for="sam in samples"
        :key="sam.key"
        class="relative flex w-full items-center justify-between bg-gray-50 px-4 py-2 outline-none odd:border-b hover:bg-gray-100"
      >
        <NuxtLink to="/" class="outline-none focus:ring">
          <h3 class="text-primary-600 text-lg font-bold">{{ sam.title }}</h3>
          <small class="text-gray-600">Diterbitkan: 20 Oktober 2020</small>
        </NuxtLink>
        <div>
          <UDropdown
            :items="storyOptions"
            :popper="{ placement: 'bottom-start', arrow: true }"
          >
            <UButton
              color="gray"
              icon="i-heroicons:ellipsis-vertical-20-solid"
            />
          </UDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
