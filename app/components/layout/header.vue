<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from 'vue-router'
import { currentUser } from '~/store/session'

const toast = useToast()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const openNavModal = ref(false)

const { data: userData } = await useAsyncData(
  'current-user',
  async () => {
    if (user.value) {
      const { data, error } = await supabase
        .from('users')
        .select('username, id, display_name, created_at, roles(id, name)')
        .eq('id', user.value.id)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error(error)
        currentUser.value = null
        return null
      }

      currentUser.value = data
      return data
    }

    return null
  },
  { watch: [user] },
)

const navitems = [
  {
    label: 'Stories',
    to: '/stories',
  },
  {
    label: 'Reading habits',
    to: '/reading-habits',
  },
  {
    label: 'About us',
    to: '/#about-us',
  },
]

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

function closeAfterNavigate(
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
) {
  navigateTo(to)
  openNavModal.value = false
}

const dropdownItems = [
  userData?.value?.roles?.id !== USER_ROLE.member
    ? { label: 'HQ', to: '/hq', icon: 'heroicons:bolt' }
    : { label: `Halo @${userData.value.username} 👋` },
  { label: 'Dashboard', to: '/dashboard', icon: 'heroicons:home' },
  { label: 'Notifications', slot: 'notification', icon: 'lucide:bell' },
  { label: 'New story', to: '/new', icon: 'lucide:notebook-pen' },
  { label: 'My reading habits', to: '/dashboard?tab=1', icon: 'ph:clover' },
  { label: 'Settings', to: '/settings', icon: 'lucide:settings' },
  {
    label: 'Logout',
    color: 'error',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: logout,
  },
] satisfies DropdownMenuItem[]
</script>

<template>
  <nav class="fixed z-20 mt-8 flex w-screen justify-center px-4 md:px-0">
    <div
      class="mx-auto flex w-full max-w-4xl items-center justify-between rounded-xl border border-neutral-100/40 bg-white/60 px-4 py-1 shadow-sm backdrop-blur"
    >
      <div class="flex w-full items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-1" title="To home page">
          <NuxtImg
            src="/assets/logo.jpg"
            width="41"
            height="41"
            class="rounded border border-neutral-300/50"
            alt="YBP Logo"
          />
          <div>
            <b>Yogyakarta</b>
            <p class="-mt-2">Book Party</p>
          </div>
        </NuxtLink>
        <ul class="mx-auto hidden items-center space-x-2 md:flex">
          <li v-for="link in navitems" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="hover:bg-primary-200 hover:border-primary-300 focus:hover:border-primary-400 focus:hover:text-primary-900 hover:text-primary-900 focus:hover:bg-primary-100 ring-primary-500 rounded-lg border-2 border-transparent px-4 py-1 text-neutral-900 transition duration-300 ease-out outline-none focus-visible:ring md:w-auto"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <LazyUDropdownMenu
        v-if="userData"
        :items="dropdownItems"
        :popper="{ strategy: 'absolute', placements: 'bottom', arrow: true }"
      >
        <UButton
          class="hidden shrink-0 md:flex"
          size="sm"
          color="neutral"
          variant="ghost"
        >
          <span class="hidden md:block">
            {{ userData?.display_name }}
          </span>
          <UAvatar
            :src="`${avatarBaseUrl}?seed=${userData?.username}`"
            alt="Avatar"
          />
        </UButton>

        <template #notification-trailing>
          <span class="text-primary-500">5</span>
        </template>
      </LazyUDropdownMenu>

      <UButton
        v-else
        class="hidden shrink-0 md:flex"
        size="sm"
        trailing-icon="heroicons:arrow-small-right-20-solid"
        to="/login"
      >
        Sign in
      </UButton>
      <LazyUSlideover v-model:open="openNavModal" title="Menu navigasi">
        <UButton
          icon="i-heroicons-bars-3"
          square
          variant="ghost"
          size="lg"
          class="flex md:hidden"
          color="neutral"
          aria-label="Menu button"
        />

        <template #body>
          <div>
            <nav class="mb-8 flex flex-col gap-1">
              <UButton
                v-for="link in navitems"
                :key="link.to"
                size="lg"
                variant="link"
                color="neutral"
                trailing-icon="heroicons:arrow-small-right-20-solid"
                @click="closeAfterNavigate(link.to)"
                >{{ link.label }}</UButton
              >
            </nav>
            <div v-if="userData" class="border-t-2 py-4">
              <div class="flex items-center gap-2 text-black">
                <p>
                  Halo! <b>{{ userData?.display_name }}</b>
                </p>

                <UAvatar
                  :src="`${avatarBaseUrl}?seed=${userData?.username}`"
                  size="xs"
                  alt="Avatar"
                />
              </div>
              <div class="mt-4 flex flex-col">
                <ul class="space-y-4">
                  <li v-for="item in dropdownItems" :key="item.label">
                    <UButton
                      v-if="item.to || item.label.toLowerCase() !== 'logout'"
                      color="neutral"
                      variant="outline"
                      block
                      :icon="item.icon"
                      @click="closeAfterNavigate(item.to)"
                    >
                      {{ item.label }}
                    </UButton>
                  </li>
                  <li>
                    <UButton
                      variant="ghost"
                      color="error"
                      block
                      icon="i-heroicons-arrow-right-on-rectangle"
                      @click="logout"
                    >
                      Logout
                    </UButton>
                  </li>
                </ul>
              </div>
            </div>
            <UButton
              v-else
              trailing-icon="heroicons:arrow-small-right-20-solid"
              size="xl"
              block
              to="/login"
              >Sign in</UButton
            >
          </div>
        </template>
      </LazyUSlideover>
    </div>
  </nav>
</template>
