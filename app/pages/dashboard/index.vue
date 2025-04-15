<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { isBefore } from 'date-fns'

defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})
useSeoMeta({
  title: 'Dashboard',
  description: 'Satu tempat dashboard untuk mengatur kebutuhan pengguna',
})

const route = useRoute()
const router = useRouter()

const showBanner = computed(() => {
  const expireDate = new Date('2025-03-30')
  if (isBefore(new Date(), expireDate)) {
    return true
  }

  return false
})

const tabs = [
  {
    slot: 'stories',
    label: 'Stories',
    icon: 'ph:book-open-duotone',
  },
  {
    slot: 'readingHabits',
    label: 'Reading Habits',
    icon: 'ph:clover-duotone',
  },
] satisfies TabsItem[]

const breadcrumbs = [
  {
    label: 'Home',
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
    <UBreadcrumb divider="/" :items="breadcrumbs" />
    <h1 class="text-2xl leading-relaxed font-bold">Dashboard</h1>

    <div class="mt-4">
      <UTabs
        :items="tabs"
        :default-index="+route.query?.tab || 0"
        class="w-full"
        @change="onChange"
      >
        <template #stories>
          <DashboardStoriesTab />
        </template>
        <template #readingHabits>
          <DashboardReadingTabs />
        </template>
      </UTabs>

      <UAlert
        class="mx-auto mt-8 max-w-screen-md"
        color="info"
        variant="soft"
        v-if="showBanner"
        :actions="[
          {
            variant: 'outline',
            color: 'info',
            label: 'Form feedback 0.2.0',
            icon: 'ph:music-note-fill',
            to: 'https://ybp-eng.notion.site/19ccff94653a80d1a7fed0807974626a',
            external: true,
          },
        ]"
        title="Halo, bookmates!"
        description="Bantu tim pengembang kami untuk berproses ke arah yang lebih baik dengan mengisi form feedback melalui tombol di bawah. Kami menghargai setiap masukan dan kritik darimu!"
      />
    </div>
  </div>
</template>
