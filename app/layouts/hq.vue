<script setup lang="ts">
import type { Database } from '~/types/database.types'

useHead({
  htmlAttrs: {
    lang: 'id',
  },
})

const openNavModal = ref(false)

const supabase = useSupabaseClient<Database>()
const userSession = useSupabaseUser()

const toast = useToast()
const { data: user } = await useAsyncData('current-user', async () => {
  const { data, error } = await supabase
    .from('users')
    .select('username, id, display_name, created_at, roles(id, name)')
    .eq('id', userSession.value.id)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
})

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    toast.add({
      title: 'Failed to sign out',
      description: error.message,
      color: 'error',
      icon: 'i-heroicons-x-mark-solid',
    })
    return
  }

  reloadNuxtApp()
}

const links = [
  {
    label: 'Close',
    click: () => (openNavModal.value = false),
    icon: 'i-heroicons-x-mark',
  },
  {
    label: 'Stories',
    icon: 'heroicons:bookmark-square',
    to: '/hq',
    click: () => (openNavModal.value = false),
  },
  {
    label: 'Tags',
    icon: 'heroicons:tag',
    to: '/hq/tags',
    click: () => (openNavModal.value = false),
  },
]

if (user.value.roles.id === USER_ROLE.admin) {
  // only user with role admin
  links.push({
    label: 'Users',
    icon: 'heroicons:user-group',
    to: '/hq/users',
    click: () => (openNavModal.value = false),
  })
}

const items = [
  [
    { label: `@${user.value.username}` },
    { label: 'Dashboard', to: '/dashboard', icon: 'heroicons:home' },
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: logout,
    },
  ],
]
</script>

<template>
  <div class="flex min-h-full flex-col bg-neutral-100 font-sans">
    <span class="bg-primary-700 h-2 w-full p-1" aria-label="top border" />
    <header class="w-full bg-white pb-2">
      <div class="mx-auto w-full max-w-screen-xl px-4 pt-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/hq" class="inline-flex items-center">
            <img
              src="~/assets/images/logo.jpg"
              alt="YBP logo"
              width="55"
              height="55"
              decoding="async"
              loading="lazy"
              class="rounded-full border"
            />
            <b class="ml-2 text-lg">| {{ user.roles.name.toUpperCase() }}</b>
          </NuxtLink>
          <div class="flex items-center gap-4">
            <UDropdownMenu
              :items="items"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton color="neutral" variant="ghost">
                <span class="hidden md:block">
                  Welcome, {{ user?.display_name }}
                </span>
                <UAvatar
                  :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${user?.username}`"
                  alt="Avatar"
                />
              </UButton>
            </UDropdownMenu>
          </div>
        </div>
        <div class="flex justify-end md:hidden">
          <UButton
            class="mt-4 ml-auto inline-flex"
            icon="i-heroicons-chevron-left"
            square
            variant="ghost"
            size="lg"
            @click="openNavModal = true"
          >
            Navigation
          </UButton>
        </div>
        <USlideover v-model:open="openNavModal">
          <template #content>
            <div class="flex-1 p-4">
              <UNavigationMenu
                orientation="vertical"
                :ui="{ childLink: 'text-lg' }"
                :items="items"
              />
            </div>
          </template>
        </USlideover>
      </div>
    </header>
    <main class="mb-4">
      <slot />
    </main>
    <footer class="mt-auto w-full pt-8 pb-1">
      <div class="mx-auto text-center text-neutral-600">
        <small>© Yogyakarta Book Party {{ new Date().getFullYear() }}</small>
      </div>
    </footer>
  </div>
</template>
