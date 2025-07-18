<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Database } from '~/types/database.types'

const openNotification = ref(false)

function switchOpenNotification() {
  openNotification.value = !openNotification.value
}

const toast = useToast()
const supabase = useSupabaseClient<Database>()
const channel = supabase.channel('notifications')

provide(notificationKey, { openNotification, switchOpenNotification })

const { data: notification, refresh } = await useFetch('/api/notifications', {
  key: 'notifications/all',
})
const { data: userData } = await useFetch('/api/session/current-user', {
  key: 'current-user',
})

const navItems = [
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

const dropdownItems = [
  userData?.value?.roles?.id !== USER_ROLE.member
    ? { label: 'HQ', to: '/hq', icon: 'heroicons:bolt' }
    : { label: `Halo @${userData.value.username} 👋` },
  { label: 'Dashboard', to: '/dashboard', icon: 'heroicons:home' },
  {
    label: 'Notifications',
    slot: 'notification',
    icon: 'lucide:bell',
    onSelect() {
      openNotification.value = true
    },
  },
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

watch(openNotification, () => {
  refresh()
})

onMounted(() => {
  if (userData.value?.id) {
    channel
      .on(
        'broadcast',
        { event: `notifications-${userData.value.id}` },
        ({ payload }) => {
          toast.add({
            title: 'Notifikasi',
            description: `Ada notifikasi baru dari ${payload.sender}`,
            color: 'info',
            icon: 'ph:bell-ringing-duotone',
          })
          refresh()
        },
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          console.info('subscribe to notification')
        }
      })

    if (userData.value.roles.name !== 'member') {
      // if user is mod/admin
      channel.on(
        'broadcast',
        { event: 'notifications-x-mod' },
        ({ payload }) => {
          toast.add({
            title: 'Notifikasi moderator',
            description: `Ada notifikasi baru dari ${payload.sender}`,
            color: 'info',
            icon: 'ph:bell-ringing-duotone',
          })
          refresh()
        },
      )
    }
  }
})

onUnmounted(() => {
  supabase.removeChannel(channel)
})
</script>

<template>
  <nav class="fixed z-20 mt-8 flex w-screen justify-center px-4 md:px-0">
    <div
      class="mx-auto flex w-full max-w-5xl items-center justify-between rounded-xl border border-neutral-100/40 bg-white/60 px-4 py-1 shadow-sm backdrop-blur"
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
          <li v-for="link in navItems" :key="link.to">
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
        v-if="userData.username"
        :items="dropdownItems"
        :popper="{ strategy: 'absolute', placements: 'bottom', arrow: true }"
      >
        <UChip :show="notification?.unreadCount > 0">
          <UButton
            class="hidden shrink-0 md:flex"
            size="sm"
            color="neutral"
            variant="ghost"
          >
            <span class="hidden md:block">
              {{ userData?.display_name }}
            </span>
            <SharedUserPicture :data="userData" />
          </UButton>
        </UChip>

        <template #notification-trailing>
          <span class="text-primary-600 px-1 rounded-full bg-primary-100">{{
            notification?.unreadCount
          }}</span>
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

      <LazyLayoutHeaderMobileNavigation
        :dropdown-items="dropdownItems"
        :nav-items="navItems"
        @logout="logout"
      />
    </div>

    <LazyLayoutHeaderNotificationPanel v-model:open="openNotification" />
  </nav>
</template>
