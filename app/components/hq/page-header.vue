<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    mode?: 'detail' | 'list'
    buttonText?: string
    backButtonText?: string
    backButtonHref?: string
  }>(),
  {
    backButtonText: 'Back',
    mode: 'list',
    backButtonHref: '/hq',
    buttonText: '',
  },
)
defineEmits<{
  btnClick: [show: boolean]
}>()

const openNavModal = ref(false)

//TODO: duplicate with dashboard layout
const items = [
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

const { data: user } = await useFetch('/api/session/current-user', {
  key: 'current-user',
})

if (user.value.roles.id === USER_ROLE.admin) {
  // only user with role admin
  items.push({
    label: 'Users',
    icon: 'heroicons:user-group',
    to: '/hq/users',
    click: () => (openNavModal.value = false),
  })
}
</script>

<template>
  <div class="w-full border-b bg-white">
    <nav
      v-if="mode === 'list'"
      class="mx-auto hidden max-w-screen-xl items-center gap-2 border-b py-2 md:flex"
    >
      <div v-for="link in items" :key="link.icon">
        <NuxtLink
          v-if="link.to"
          :to="link.to"
          class="text-primary-900 hover:bg-primary-50 flex w-full items-center gap-2 rounded-md px-4 py-3 font-medium transition md:w-auto"
          active-class="bg-primary-100"
        >
          {{ link.label }}
          <UIcon :name="link.icon" class="h-5 w-5" />
        </NuxtLink>
      </div>
    </nav>
    <div
      class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-6 md:py-8"
    >
      <div class="flex flex-col gap-4">
        <ULink
          v-if="mode === 'detail'"
          class="focue:ring ring-primary-500 inline-flex w-fit items-center gap-1 text-neutral-600 outline-none hover:bg-neutral-200"
          :to="backButtonHref"
          ><UIcon name="i-heroicons:chevron-left" /> {{ backButtonText }}</ULink
        >
        <h1 class="text-3xl">
          {{ title }}
        </h1>
      </div>
      <UButton
        v-if="Boolean(buttonText)"
        size="md"
        @click="$emit('btnClick', true)"
      >
        {{ buttonText }}
      </UButton>
    </div>
  </div>
</template>
