<script setup lang="ts">
defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})
useHead({
  title: 'Dashboard',
})

const tabs = [
  {
    key: 'stories',
    label: 'Stories',
    icon: 'ph:book-open-duotone',
  },
  {
    key: 'readingHabits',
    label: 'Reading Habits',
    icon: 'ph:clover-duotone',
  },
]
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg px-4 md:px-0">
    <div class="flex items-start justify-between gap-8 md:items-center">
      <h1 class="text-2xl font-bold leading-relaxed">Dashboard</h1>

      <UButton trailing-icon="heroicons:plus" to="/new">New story</UButton>
    </div>

    <div class="mt-4">
      <UTabs :items="tabs" class="w-full">
        <template #icon="{ item, selected }">
          <UIcon
            :name="item.icon"
            class="me-2 h-4 w-4 flex-shrink-0"
            :class="[selected && 'text-primary-500 dark:text-primary-400']"
          />
        </template>

        <template #item="{ item }">
          <DashboardStoriesTab v-if="item.key === 'stories'" />
          <p v-else>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            illo, maxime saepe quia libero veniam inventore numquam vitae, sint,
            doloremque sed? Aliquam corrupti labore doloremque eveniet nulla non
            ducimus ipsa!
          </p>
        </template>
      </UTabs>
    </div>
  </div>
</template>
