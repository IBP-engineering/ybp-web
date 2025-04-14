<script setup lang="ts">
import { format } from 'date-fns'
import id from 'date-fns/locale/id'
import type { Story, User } from '~/types/entities'

const props = defineProps<{
  story: Story
}>()

const emit = defineEmits<{
  delete: [id: string]
  status: [id: string]
}>()

const { data: user } = useNuxtData<User>('current-user')

const storyUrl = `/${user.value.username}/${props.story.slug}`

const storyOptions = [
  [
    {
      label: 'Cek status',
      icon: 'heroicons:queue-list',
      click: () => {
        emit('status', props.story.id)
      },
    },
    {
      label: 'Ubah',
      icon: 'i-heroicons:pencil-square',
      click: () => navigateTo(storyUrl.concat('/edit')),
    },
    {
      label: 'Arsipkan',
      disabled: true,
      icon: 'i-heroicons:folder-open',
    },
    {
      label: 'Hapus',
      class: 'bg-red-100 hover:bg-red-200 text-red-900',
      iconClass: 'text-red-900',
      icon: 'i-heroicons:trash',
      click: () => {
        emit('delete', props.story.id)
      },
    },
  ],
]
</script>

<template>
  <div
    class="relative flex w-full items-center justify-between border-b bg-neutral-50 px-4 py-2 outline-none last:border-0 hover:bg-neutral-100"
  >
    <NuxtLink :to="storyUrl" class="group outline-none focus:ring">
      <h3
        class="text-primary-600 group-hover:text-primary-700 text-lg font-bold"
      >
        {{ story.title }}
      </h3>
      <small class="text-neutral-600"
        >Ditulis pada
        {{ format(new Date(story.created_at), 'PPP', { locale: id }) }}</small
      >
    </NuxtLink>
    <div>
      <UDropdownMenu
        :items="storyOptions"
        :popper="{ placement: 'bottom-start', arrow: true }"
      >
        <UButton
          color="neutral"
          icon="i-heroicons:ellipsis-vertical-20-solid"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
