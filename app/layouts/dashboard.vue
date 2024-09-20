<script setup lang="ts">
const openNavModal = ref(false)

const links = [
  {
    label: 'Close',
    click: () => (openNavModal.value = false),
    icon: 'i-heroicons-x-mark',
  },
  {
    label: 'Stories',
    icon: 'i-heroicons-bookmark',
    to: '/hq',
    click: () => (openNavModal.value = false),
  },
  {
    label: 'Users',
    icon: 'i-heroicons-at-symbol',
    to: '/users',
    click: () => (openNavModal.value = false),
  },
]

const supabase = useSupabaseClient()
const toast = useToast()

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
    <span class="bg-primary-700 h-2 w-full p-1" aria-label="top border" />
    <header class="w-full bg-white pb-2">
      <div class="mx-auto w-full max-w-screen-xl px-4 pt-4">
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
            <b class="ml-2 text-lg">| YBP</b>
          </div>
          <div class="flex items-center gap-4">
            <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
              <UButton color="white" variant="ghost"
                >Editor 1
                <UAvatar
                  src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Willow"
                  alt="Avatar"
                />
              </UButton>
            </UDropdown>
          </div>
        </div>
        <div class="flex justify-end md:hidden">
          <UButton
            class="ml-auto mt-4 inline-flex"
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
          <div class="flex-1 p-4">
            <UVerticalNavigation :ui="{ size: 'text-lg' }" :links="links" />
          </div>
        </USlideover>
      </div>
    </header>
    <main class="mb-4">
      <slot />
    </main>
    <footer class="mt-auto w-full pb-1 pt-8">
      <div class="mx-auto text-center text-gray-600">
        <small>© Yogyakarta Book Party 2024</small>
      </div>
    </footer>
  </div>
</template>
