<script setup lang="ts">
import type { BreadcrumbItem, TabsItem } from '@nuxt/ui'

defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})

useSeoMeta({
  title: 'Pengaturan pengguna',
  description: 'Ubah nama, profil, ataupun bio dari halaman ini',
})

const isLarge = useMediaQuery(
  '(min-width: 1024px)',
  { ssrWidth: 768 }, // Will enable SSR mode and render like if the screen was 768px wide
)
const breadcrumbs: BreadcrumbItem[] = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Settings',
  },
]
const tabs = ref<TabsItem[]>([
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    slot: 'profile' as const,
  },
  {
    label: 'Account',
    icon: 'i-lucide-lock',
    slot: 'account' as const,
  },
])
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-0">
    <UBreadcrumb divider="/" :items="breadcrumbs" class="mb-2" />
    <h1 class="text-3xl leading-relaxed font-bold md:text-4xl">Settings</h1>

    <div class="mt-4 lg:mt-8">
      <UTabs
        :unmount-on-hide="false"
        :orientation="isLarge ? 'vertical' : 'horizontal'"
        variant="link"
        class="w-full items-start gap-4 lg:gap-8"
        :items="tabs"
      >
        <template #profile>
          <div class="grid lg:grid-cols-2 w-full">
            <SettingsProfile />
          </div>
        </template>

        <template #account>
          <div class="grid lg:grid-cols-2 w-full">
            <SettingsAccount />
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
