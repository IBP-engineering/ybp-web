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
const navlinks = [
  {
    label: 'Stories',
    to: '/stories',
  },
  {
    label: 'Reading Habits',
    to: '/reading-habits',
  },
  {
    label: 'About Us',
    to: '/#about-us',
  },
  {
    label: 'FAQ',
    to: '/#faq',
  },
]
const openNavModal = ref(false)

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    toast.add({
      title: 'Failed to sign out',
      description: error.message,
      color: 'red',
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
      class="absolute -left-48 top-0 z-[4] w-full md:-top-20 md:left-0"
      alt="blur bg"
    />
    <nav class="z-20 mb-4 mt-8 px-4 md:mb-10 md:px-0">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" title="To home page">
            <NuxtImg
              src="/assets/logo.jpg"
              width="55"
              height="55"
              class="rounded-full border"
              alt="YBP Logo"
            />
          </NuxtLink>
          <ul class="ml-4 hidden items-center space-x-4 md:flex">
            <li v-for="link in navlinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="px-4 py-3 text-gray-900 transition hover:underline focus:ring md:w-auto"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <LazyUDropdown
          v-if="userData"
          :items="dropdownItems"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton class="hidden md:flex" color="white" variant="ghost">
            <span class="hidden md:block">
              {{ userData?.display_name }}
            </span>
            <UAvatar
              :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${userData?.username}`"
              alt="Avatar"
            />
          </UButton>
        </LazyUDropdown>
        <UButton
          v-else
          class="hidden md:flex"
          size="lg"
          variant="outline"
          to="/login"
          >Join Now</UButton
        >
        <UButton
          icon="i-heroicons-bars-3"
          square
          variant="ghost"
          size="lg"
          class="flex md:hidden"
          color="gray"
          aria-label="Menu button"
          @click="openNavModal = true"
        />
        <LazyUSlideover v-model="openNavModal">
          <div class="p-4">
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="gray"
              size="lg"
              aria-label="Button to close mobile navigation modal"
              @click="openNavModal = false"
              >Close</UButton
            >
            <nav class="mb-8 mt-4 flex flex-col gap-1">
              <UButton
                v-for="link in navlinks"
                :key="link.to"
                size="lg"
                variant="link"
                color="gray"
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
                      color="white"
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
                      color="red"
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
            <UButton v-else size="xl" block variant="outline" to="/login"
              >Join Now</UButton
            >
          </div>
        </LazyUSlideover>
      </div>
    </nav>

    <main class="z-10 mb-24 h-full">
      <slot />
    </main>

    <footer
      class="container z-[5] mx-auto mt-auto rounded-lg border border-gray-300 bg-gray-100 px-8 py-12 md:mb-12"
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
              class="rounded-full border"
            />
            <div class="mt-4 flex items-center">
              <small class="text-gray-600">
                Part of <b>Indonesia Book Party</b>
              </small>
            </div>
            <p class="mt-8 text-gray-600">
              Designed in Sleman, Yogyakarta.<br />
              Built around the world. 🌎
            </p>
          </div>
        </div>
        <div class="col-span-2">
          <div
            class="grid grid-cols-2 justify-items-stretch gap-4 md:grid-cols-3 md:justify-items-end"
          >
            <div class="text-gray-600 md:col-span-2">
              <p class="mb-2 font-medium">PRODUCTS</p>
              <ul class="space-y-2">
                <li>
                  <NuxtLink to="/stories" class="hover:underline"
                    >Stories</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/goodies" class="hover:underline"
                    >Goodies (coming soon)</NuxtLink
                  >
                </li>
              </ul>
            </div>
            <div class="text-gray-600">
              <p class="mb-2 font-medium">ORGANIZATION</p>
              <ul class="space-y-2">
                <li>
                  <NuxtLink to="/#about-us" class="hover:underline"
                    >About Us</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/#faq" class="hover:underline">FAQ</NuxtLink>
                </li>
                <li><a href="#" class="hover:underline">Collaboration</a></li>
                <li><a href="#" class="hover:underline">Donation</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-20 flex flex-col items-center justify-between text-gray-600 md:flex-row"
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
          <p class="font-medium">© 2024 Yogyakarta Book Party</p>
        </div>
      </div>
    </footer>
  </div>
</template>
