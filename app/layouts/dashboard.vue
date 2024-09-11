<script setup lang="ts">
const toast = useToast()
const openNavModal = ref(false)

const links = [
  {
    label: 'Close',
    click: () => (openNavModal.value = false),
    icon: 'i-heroicons-x-mark',
  },
  {
    label: 'Tickets',
    icon: 'i-heroicons-ticket',
    to: '/',
    click: () => (openNavModal.value = false),
  },
  {
    label: 'Headlines',
    icon: 'i-heroicons-bookmark',
    to: '/headlines',
    click: () => (openNavModal.value = false),
  },
  {
    label: 'Info & address',
    icon: 'i-heroicons-at-symbol',
    to: '/info',
    click: () => (openNavModal.value = false),
  },
  {
    label: 'About & contact',
    icon: 'i-heroicons-information-circle',
    to: '/dynamic',
    click: () => (openNavModal.value = false),
  },
]

async function logout() {
  // const { error } = await client.auth.signOut()
  //
  // if (error) {
  //   toast.add({
  //     title: 'Failed to sign out',
  //     description: error.message,
  //     color: 'red',
  //     icon: 'i-heroicons-x-mark-solid',
  //   })
  //   return
  // }

  await navigateTo('/login')
}

const items = [
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: logout,
    },
  ],
]
</script>

<template>
  <div class="flex min-h-full flex-col bg-gray-100">
    <span class="p-1 h-2 bg-primary-700 w-full" aria-label="top border" />
    <header class="bg-white w-full border-b pb-2">
      <div class="max-w-screen-xl w-full mx-auto px-4 pt-4">
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center">
            <img
              src="https://picsum.photos/200/200"
              alt="YBP logo"
              width="65"
              height="65"
              decoding="async"
              loading="lazy"
            />
            <b class="text-lg ml-2">| Admin</b>
          </div>
          <div class="flex items-center gap-4">
            <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
              <UAvatar
                src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Willow"
                alt="Avatar"
              />
            </UDropdown>
          </div>
        </div>
        <nav class="items-center gap-2 mt-6 hidden md:flex">
          <div v-for="link in links" :key="link.icon">
            <NuxtLink
              v-if="link.to"
              :to="link.to"
              class="font-medium flex w-full md:w-auto items-center gap-2 color-indigo-900 py-3 px-4 rounded-md hover:bg-indigo-50 transition"
              active-class="bg-indigo-100"
            >
              {{ link.label }}
              <UIcon :name="link.icon" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </nav>
        <div class="flex md:hidden justify-end">
          <UButton
            class="inline-flex ml-auto mt-4"
            icon="i-heroicons-chevron-left"
            square
            variant="ghost"
            size="lg"
            @click="openNavModal = true"
          >
            Navigation
          </UButton>
        </div>
        <USlideover v-model="openNavModal">
          <div class="p-4 flex-1">
            <UVerticalNavigation :ui="{ size: 'text-lg' }" :links="links" />
          </div>
        </USlideover>
      </div>
    </header>
    <main class="mb-4">
      <slot />
    </main>
    <footer class="mt-auto w-full pt-8 pb-1">
      <div class="mx-auto text-center text-gray-600">
        <small>© Yogyakarta Book Party 2024</small>
      </div>
    </footer>
  </div>
</template>
