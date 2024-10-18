<script setup lang="ts">
import { currentUser } from '~/store/session'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const navlinks = [
  {
    label: 'Activities',
    to: '/activities',
  },
  {
    label: 'Goodies',
    to: '/goodies',
  },
  {
    label: 'About Us',
    to: '/about',
  },
]
const openNavModal = ref(false)

await useAsyncData(
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
</script>

<template>
  <div class="flex min-h-full w-full flex-auto flex-col bg-gray-100">
    <nav class="mt-8 px-4 md:px-0">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/">
            <img
              src="~/assets/images/logo.png"
              width="90"
              class="h-full w-24"
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
        <UButton class="hidden md:flex" size="xl" variant="outline"
          >Join Now</UButton
        >
        <UButton
          icon="i-heroicons-bars-3"
          square
          variant="ghost"
          size="lg"
          class="flex md:hidden"
          color="gray"
          @click="openNavModal = true"
        />
      </div>
    </nav>
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
        <UButton size="xl" block variant="outline">Join Now</UButton>
      </div>
    </USlideover>
    <slot />
  </div>
</template>
