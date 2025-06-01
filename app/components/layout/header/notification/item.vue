<script setup lang="ts">
import { format, formatDistanceToNowStrict, isToday } from 'date-fns'
import id from 'date-fns/locale/id'
import type { Notification, User } from '~/types/entities'

const props = defineProps<{
  notification: Notification & {
    sender: Pick<User, 'username' | 'display_name'>
  }
}>()

const supabase = useSupabaseClient()

const { switchOpenNotification } = inject(notificationKey)

const notificationUrl = computed(() => {
  const { notification } = props
  const isStory = notification.related_entity_type === 'story'
  const isComment = notification.related_entity_type === 'comment'

  if (isStory) {
    const toStory = `/${notification.sender.username}/${notification.context_data?.slug}`
    if (notification.type === 'comment_on_story') {
      return toStory.concat(`?pc=${notification.context_data.parentComment}`)
    }

    return toStory
  } else if (isComment) {
    const { user_id, slug, parentComment, childrenComment } =
      notification.context_data
    return `/${user_id.username}/${slug}?pc=${parentComment}&cc=${childrenComment}`
  }

  return ''
})

const message = computed(() => {
  let status = ''

  switch (props.notification.context_data?.status) {
    case 'approved':
      status = 'Disetujui'
      break
    case 'pending':
      status = 'Diproses'
      break
    default:
      status = 'Ditolak'
      break
  }

  switch (props.notification.type) {
    case 'comment_on_story':
      return `💬 mengomentari salah satu Story Anda: "${props.notification.context_data?.content ?? ''}"`
    case 'like_on_story':
      return `❤️ menyukai Story Anda: "${props.notification.context_data?.title ?? ''}"`
    case 'reply_comment':
      return `↪️ membalas komentar Anda "${props.notification.context_data?.content ?? ''}"`
    case 'like_on_comment':
      return `❤️ menyukai komentar Anda "${props.notification.context_data?.content ?? ''}"`
    case 'update_story':
      return `✍️ Story "${props.notification.context_data?.title ?? ''}" telah diperbarui`
    case 'update_story_status':
      return `🔼 status Story Anda: "${props.notification.context_data?.title ?? ''}" telah diperbarui menjadi ${status}`
    case 'system_message':
      return '🔔 pembaruan fitur baru tersedia!'
    case 'add_story':
      return `➕ menambahkan Story baru: "${props.notification.context_data?.title ?? ''}"`
    default:
      return 'Whoopsie'
  }
})

const onClickUrl = async () => {
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', props.notification.id)

  switchOpenNotification()
  // refreshNuxtData()
  // navigateTo(notificationUrl.value)
  // NOTE: best practice to not using reload, but since if we dont do it
  // in case comment that needs to scroll to position, is only possible if we
  // reload the page.
  console.log('notificationUrl', notificationUrl.value)
  reloadNuxtApp({ path: notificationUrl.value })
}
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
        <div>
          <NuxtLink
            :to="`/${notification.sender.username}`"
            class="font-bold hover:underline"
            @click="onClickUrl"
            >{{ notification.sender.display_name }}</NuxtLink
          >
          <button
            class="ml-1 text-left hover:underline focus:ring"
            @click="onClickUrl"
          >
            {{ message }}
          </button>
        </div>
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
