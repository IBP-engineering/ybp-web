<script setup lang="ts">
import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
} from 'date-fns'
import id from 'date-fns/locale/id'
import type { Notification, User } from '~/types/entities'

const notificationType = ref<'all' | 'unread'>('all')

const { data: notification } = await useFetch('/api/notifications', {
  key: 'notifications',
})

const notificationData = computed(() => {
  const groupedData: Record<
    string,
    (Notification & { sender: Pick<User, 'username' | 'display_name'> })[]
  > = {}

  for (const data of notification.value.data) {
    if (!data || !data.created_at) {
      console.warn('Skipping data due to missing created_at ')
      return
    }

    const createdAt = new Date(data.created_at)

    if (isNaN(createdAt.getTime())) {
      console.warn('Skipping data due to invalid created_at date')
      return
    }

    let category: string

    if (isToday(createdAt)) {
      category = 'Hari ini'
    } else if (isYesterday(createdAt)) {
      category = 'Kemarin'
    } else {
      category = format(createdAt, 'dd MMM', { locale: id })
    }

    if (!groupedData[category]) {
      groupedData[category] = []
    }

    groupedData[category].push(data)
  }

  return groupedData
})
</script>

<template>
  <UModal
    title="Notifikasi"
    description="Tetap update dengan pemberitahuan terbaru"
    class="max-w-xl sm:max-h-[50dvh]"
    :ui="{ body: 'sm:p-0' }"
  >
    <template #body>
      <div class="bg-neutral-50 flex py-2 px-4 items-center justify-between">
        <div class="flex gap-2">
          <UButton
            size="sm"
            variant="ghost"
            :color="notificationType === 'all' ? 'primary' : 'neutral'"
            @click="notificationType = 'all'"
            >Semua</UButton
          >
          <UButton
            size="sm"
            variant="ghost"
            :color="notificationType === 'unread' ? 'primary' : 'neutral'"
            @click="notificationType = 'unread'"
            >Belum terbaca ({{ notification.count }})</UButton
          >
        </div>

        <UButton
          size="sm"
          icon="lucide:check-check"
          variant="ghost"
          color="primary"
          >Tandai semua sudah dibaca</UButton
        >
      </div>

      <div class="pt-4 space-y-4">
        <div
          v-for="[key, value] in Object.entries(notificationData)"
          :key="key"
          class="flex flex-col"
        >
          <small class="text-neutral-600 px-6 mb-1 font-medium">{{
            key
          }}</small>
          <div
            v-for="notif in value"
            :key="notif.id"
            class="hover:bg-neutral-50 transition px-6"
            :class="{ 'bg-primary-100 hover:bg-primary-200': !notif.read_at }"
          >
            <div
              class="grid items-center grid-cols-[50px_minmax(0,1fr)] py-3 border-b"
            >
              <UAvatar
                :alt="notif.sender.display_name"
                :src="`${avatarBaseUrl}?seed=${notif.sender.username}`"
                size="xl"
              />
              <div>
                <p class="truncate">
                  <b>{{ notif.sender.display_name }}</b>
                  <span> sendiri di dalam topi sambil berselimut jerami </span>
                </p>
                <time
                  :datetime="new Date(notif.created_at).toISOString()"
                  :title="new Date(notif.created_at).toLocaleString()"
                  class="text-neutral-500 text-sm"
                  >{{
                    isToday(new Date(notif.created_at))
                      ? formatDistanceToNowStrict(new Date(notif.created_at), {
                          locale: id,
                        })
                      : format(new Date(notif.created_at), 'HH:mm')
                  }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
