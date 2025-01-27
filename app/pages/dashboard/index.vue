<script setup lang="ts">
defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})
useHead({
  title: 'Dashboard',
})

const route = useRoute()
const router = useRouter()

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

const breadcrumbs = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Dashboard',
  },
]

function onChange(index: number) {
  router.replace({ query: { tab: index } })
}
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <UBreadcrumb :links="breadcrumbs" />
    <h1 class="text-2xl font-bold leading-relaxed">Dashboard</h1>

    <div class="mt-4">
      <UTabs
        :items="tabs"
        :default-index="+route.query?.tab || 0"
        class="w-full"
        @change="onChange"
      >
        <template #default="{ item }">
          <UBadge
            v-if="item.key === 'readingHabits'"
            color="primary"
            size="xs"
            class="mr-1"
            >New</UBadge
          >
          <span class="truncate">{{ item.label }}</span>
        </template>
        <template #icon="{ item, selected }">
          <UIcon
            :name="item.icon"
            class="me-2 h-4 w-4 flex-shrink-0"
            :class="[selected && 'text-primary-500 dark:text-primary-400']"
          />
        </template>

        <template #item="{ item }">
          <div class="mt-8">
            <DashboardStoriesTab v-if="item.key === 'stories'" />
            <DashboardReadingTabs v-else />
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
