<script setup lang="ts">
import { format, formatDistanceToNowStrict, isToday } from 'date-fns'
import id from 'date-fns/locale/id'
import type { Notification, User } from '~/types/entities'

const props = defineProps<{
  notification: Notification & {
    sender: Pick<User, 'username' | 'display_name'>
  }
}>()

const message = computed(() => {
  switch (props.notification.type) {
    case 'comment_on_story':
      return ` mengomentari artikel Anda: "niceee!"`
    case 'like_on_story':
      return ` menyukai artikel Anda: "Judul"`
    case 'reply_comment':
      return ' membalas komentar Anda di artikel "adalah real"'
    case 'like_on_comment':
      return ' menyukai komentar Anda di artikel "cinta padang bulan"'
    case 'update_story':
      return ` status artikel Anda: "${props.notification.context_data?.title ?? ''}" telah diperbarui menjadi [Status Baru]`
    case 'system_message':
      return ' pembaruan fitur baru tersedia!'
    case 'add_story':
      return ` menambahkan Story baru: "${props.notification.context_data?.title ?? ''}"`
    default:
      return 'Yaudah'
  }
})
</script>

<template>
  <div
    class="hover:bg-neutral-50 transition px-6"
    :class="{ 'bg-primary-100 hover:bg-primary-200': !notification.read_at }"
  >
    <div class="grid items-start grid-cols-[50px_minmax(0,1fr)] py-3 border-b">
      <UAvatar
        :alt="notification.sender.display_name"
        :src="`${avatarBaseUrl}?seed=${notification.sender.username}`"
        size="xl"
      />
      <div>
        <p>
          <b>{{ notification.sender.display_name }}</b>
          <span>{{ message }}</span>
        </p>
        <time
          :datetime="new Date(notification.created_at).toISOString()"
          :title="new Date(notification.created_at).toLocaleString()"
          class="text-neutral-500 text-sm"
          >{{
            isToday(new Date(notification.created_at))
              ? formatDistanceToNowStrict(new Date(notification.created_at), {
                  locale: id,
                })
              : format(new Date(notification.created_at), 'HH:mm')
          }}
        </time>
      </div>
    </div>
  </div>
</template>
