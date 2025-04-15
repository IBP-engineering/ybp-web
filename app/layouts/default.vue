<script setup lang="ts">
import { currentUser } from '~/store/session'

useHead({
  htmlAttrs: {
    lang: 'id',
  },
})

const { socials } = useAppConfig()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
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
const openNavModal = ref(false)

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

const dropdownItems = [
  [
    userData?.value?.roles?.id !== USER_ROLE.member
      ? { label: 'HQ', to: '/hq', icon: 'heroicons:bolt' }
      : { label: `Halo @${userData.value.username} 👋` },
    { label: 'Dashboard', to: '/dashboard', icon: 'heroicons:home' },
    { label: 'New story', to: '/new', icon: 'heroicons:plus' },
    { label: 'My reading habits', to: '/dashboard?tab=1', icon: 'ph:clover' },
    { label: 'Settings', to: '/settings', icon: 'heroicons:sparkles' },
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: logout,
    },
  ],
]
</script>

<template>
  <div
    class="relative flex min-h-full w-full flex-auto flex-col overflow-hidden font-sans"
  >
    <NuxtImg
      src="/assets/main-bg-blur.svg"
      width="300"
      height="300"
      class="absolute top-0 -left-48 z-[4] w-full md:-top-20 md:left-0"
      alt="blur bg"
    />
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
              <UChip :show="link.to === '/reading-habits'" size="lg" text="NEW">
                <NuxtLink
                  :to="link.to"
                  class="hover:bg-primary-200 hover:border-primary-300 focus:hover:border-primary-400 focus:hover:text-primary-900 hover:text-primary-900 focus:hover:bg-primary-100 rounded-lg border-2 border-transparent px-4 py-1 text-neutral-900 transition duration-300 ease-out outline-none focus-visible:ring md:w-auto"
                >
                  {{ link.label }}
                </NuxtLink>
              </UChip>
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
              :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${userData?.username}`"
              alt="Avatar"
            />
          </UButton>
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
        <LazyUSlideover>
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
                  :to="link.to"
                  >{{ link.label }}</UButton
                >
              </nav>
              <div v-if="userData" class="border-t-2 py-4">
                <div class="flex items-center gap-2 text-black">
                  <p>
                    Halo! <b>{{ userData?.display_name }}</b>
                  </p>

                  <UAvatar
                    :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${userData?.username}`"
                    size="xs"
                    alt="Avatar"
                  />
                </div>
                <div class="mt-4 flex flex-col">
                  <ul class="space-y-4">
                    <li v-for="item in dropdownItems[0]" :key="item.label">
                      <UButton
                        v-if="item.to || item.label.toLowerCase() !== 'logout'"
                        color="neutral"
                        variant="outline"
                        block
                        :icon="item.icon"
                        :to="item.to"
                        @click="openNavModal = false"
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

    <main class="z-10 mt-[7rem] mb-24 h-full md:mt-[8rem]">
      <WelcomingBanner />
      <slot />
    </main>

    <footer
      class="z-[5] container mx-auto mt-auto rounded-lg border border-neutral-300 bg-neutral-100 px-8 py-12 md:mb-12"
    >
      <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div class="col-span-1 flex h-full flex-col justify-between">
          <div>
            <NuxtImg
              src="/assets/logo.jpg"
              loading="lazy"
              decoding="async"
              alt="YBP Logo"
              height="70"
              width="70"
              class="rounded border"
            />
            <div class="mt-4 flex items-center">
              <small class="text-neutral-600">
                Part of <b>Indonesia Book Party</b>
              </small>
            </div>
            <p class="mt-8 text-neutral-600">
              Designed in Sleman, Yogyakarta.<br />
              Built around the world. 🌎
            </p>
          </div>
        </div>
        <div class="col-span-2">
          <div
            class="grid grid-cols-2 justify-items-stretch gap-4 md:grid-cols-3 md:justify-items-end"
          >
            <div class="text-neutral-600 md:col-span-2">
              <p class="mb-2 font-medium">PRODUCTS</p>
              <ul class="space-y-2">
                <li>
                  <NuxtLink to="/stories" class="hover:underline"
                    >Stories</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/reading-habits" class="hover:underline"
                    >Reading Habits</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/goodies" class="hover:underline"
                    >Goodies (coming soon)</NuxtLink
                  >
                </li>
              </ul>
            </div>
            <div class="text-neutral-600">
              <p class="mb-2 font-medium">ORGANIZATION</p>
              <ul class="space-y-2">
                <li>
                  <NuxtLink to="/#about-us" class="hover:underline"
                    >About us</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/#faq" class="hover:underline">FAQ</NuxtLink>
                </li>
                <li>
                  <a href="/#contacts" class="hover:underline">Collaboration</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-20 flex flex-col items-center justify-between text-neutral-600 md:flex-row"
      >
        <div class="flex gap-1">
          <NuxtLink
            v-for="social in socials"
            :key="social.id"
            :title="social.title"
            :to="social.link"
            target="_blank"
            external
          >
            <UIcon :name="social.logo" class="h-6 w-6" />
          </NuxtLink>
        </div>
        <div class="flex">
          <p class="font-medium">
            © {{ new Date().getFullYear() }} Yogyakarta Book Party
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
