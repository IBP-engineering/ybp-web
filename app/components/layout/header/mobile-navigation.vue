<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from 'vue-router'

defineProps<{
  navItems: { label: string; to: string }[]
  dropdownItems: DropdownMenuItem[]
}>()

defineEmits<{
  (e: 'logout')
}>()

const openNavModal = ref(false)
const { data: user } = await useFetch('/api/session/current-user', {
  key: 'current-user',
})

function closeAfterNavigate(
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
) {
  navigateTo(to)
  openNavModal.value = false
}
</script>

<template>
  <USlideover v-model:open="openNavModal" title="Menu navigasi">
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
            v-for="link in navItems"
            :key="link.to"
            size="lg"
            variant="link"
            color="neutral"
            trailing-icon="heroicons:arrow-small-right-20-solid"
            @click="closeAfterNavigate(link.to)"
            >{{ link.label }}</UButton
          >
        </nav>
        <div v-if="user.username" class="border-t-2 py-4">
          <div class="flex items-center gap-2 text-black">
            <p>
              Halo! <b>{{ user?.display_name }}</b>
            </p>

            <UAvatar
              :src="`${avatarBaseUrl}?seed=${user?.username}`"
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
                  @click="$emit('logout')"
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
  </USlideover>
</template>
