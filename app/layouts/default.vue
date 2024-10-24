<script setup lang="ts">
import { currentUser } from '~/store/session'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const navlinks = [
  {
    label: 'Stories',
    to: '/stories',
  },
  {
    label: 'Activities',
    to: '#',
  },
  {
    label: 'Goodies',
    to: '/goodies',
  },
  {
    label: 'About Us',
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
    { label: `@${userData?.value?.username}`, to: '/dashboard' },
    { label: 'New story', to: '/new', icon: 'heroicons:plus' },
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: logout,
    },
  ],
]
</script>

<template>
  <div class="flex min-h-full w-full flex-auto flex-col bg-gray-50 font-sans">
    <nav class="mb-4 mt-8 px-4 md:mb-10 md:px-0">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/">
            <img
              src="~/assets/images/logo.jpg"
              width="80"
              class="h-full w-16 rounded-full border"
              alt="YBP Logo"
            />
          </NuxtLink>
          <ul class="ml-4 hidden items-center space-x-4 md:flex">
            <li v-for="link in navlinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="px-4 py-3 text-gray-600 transition hover:underline focus:ring md:w-auto"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <UDropdown
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
        </UDropdown>
        <UButton
          v-else
          class="hidden md:flex"
          size="xl"
          variant="outline"
          to="/login"
          >Join Now</UButton
        >
        <UButton
          icon="i-heroicons-bars-3"
          square
          variant="ghost"
          size="lg"
          class="sm:flex md:hidden"
          color="gray"
          @click="openNavModal = true"
        />
        <USlideover v-model="openNavModal">
          <div class="p-4">
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="gray"
              size="lg"
              @click="openNavModal = false"
              >Close</UButton
            >
            <nav class="mb-8 mt-4 flex flex-col gap-1">
              <UButton
                size="lg"
                variant="link"
                v-for="link in navlinks"
                color="gray"
                trailing-icon="heroicons:arrow-small-right-20-solid"
                :key="link.to"
                :to="link.to"
                >{{ link.label }}</UButton
              >
            </nav>
            <UDropdown
              v-if="userData"
              :items="dropdownItems"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton color="white" block variant="ghost">
                <span>
                  {{ userData?.display_name }}
                </span>
                <UAvatar
                  :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${userData?.username}`"
                  alt="Avatar"
                />
              </UButton>
            </UDropdown>
            <UButton v-else size="xl" block variant="outline" to="/login"
              >Join Now</UButton
            >
          </div>
        </USlideover>
      </div>
    </nav>

    <main class="mb-24 h-full">
      <slot />
    </main>

    <footer
      class="container mx-auto mt-auto rounded-lg border border-gray-300 bg-gray-100 px-8 py-12 md:mb-12"
    >
      <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div class="col-span-1 flex h-full flex-col justify-between">
          <div>
            <img
              src="~/assets/images/logo.jpg"
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
            <p class="mt-8 text-gray-500">
              Designed in Sleman, Yogyakarta.<br />
              Built around the world. 🌎
            </p>
          </div>
        </div>
        <div class="col-span-2">
          <div
            class="grid grid-cols-2 justify-items-stretch gap-4 lg:grid-cols-3 lg:justify-items-end"
          >
            <div class="text-gray-600">
              <p class="mb-2 font-medium">PRODUCTS</p>
              <ul class="space-y-2">
                <li><NuxtLink to="/goodies">Goodies</NuxtLink></li>
              </ul>
            </div>
            <div class="text-gray-600">
              <p class="mb-2 font-medium">ACTIVITIES</p>
              <ul class="space-y-2">
                <li><a href="#" class="">Pekan Membaca</a></li>
                <li><a href="#" class="">Malam Imajinasi</a></li>
                <li><a href="#" class="">YBP Berpuisi</a></li>
              </ul>
            </div>
            <div class="text-gray-600">
              <p class="mb-2 font-medium">ORGANIZATION</p>
              <ul class="space-y-2">
                <li><NuxtLink to="/#about-us">About Us</NuxtLink></li>
                <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
                <li><a href="#" class="">Collaboration</a></li>
                <li><a href="#" class="">Donation</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-20 flex items-center justify-between">
        <div class="flex">
          <NuxtLink title="to YBP Instagram" to="#" external>
            <UIcon name="i-ph:instagram-logo" class="h-6 w-6" />
          </NuxtLink>
        </div>
        <div class="flex">
          <p class="font-medium text-gray-600">© 2024 Yogyakarta Book Party</p>
        </div>
      </div>
    </footer>
  </div>
</template>
