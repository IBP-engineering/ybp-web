<script setup lang="ts">
import { formatDistanceToNowStrict } from 'date-fns'
import id from 'date-fns/locale/id'
import * as v from 'valibot'
import type { CommentWithAuthorReplies, Story, User } from '~/types/entities'

const props = defineProps<{
  comment: CommentWithAuthorReplies
}>()

const openComment = ref(false)
const commentText = ref('')
const openChild = ref(false)
const loadingPostComment = ref(false)
const route = useRoute()
const toast = useToast()
const supabase = useSupabaseClient()
const slug = route.params.slug
const story = useNuxtData<Story>(`story/${slug}`)
const user = useNuxtData<User>('current-user')

const author = props.comment.author
const isMainThread = props.comment.thread === null
const commentCount = props.comment.replies.length
const isModeratorOrAdmin = author.role_id !== 1

const isOriginalPoster = computed(() => {
  const isAuthor = story.data.value.user_id === author.id
  return isAuthor
})

const isLoggedIn = computed(() => {
  return Boolean(user.data.value)
})

const isUserAlreadyReact = computed(() => {
  return props.comment.reactions.some(
    react => react.user === user.data.value.id,
  )
})

const postComment = async () => {
  try {
    if (!user.data.value) {
      toast.add({
        title: 'Pufft',
        description:
          'User tidak ditemukan. Pastikan anda sudah melakukan login',
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    if (!story.data.value) {
      toast.add({
        title: 'Pufft',
        description:
          'Story tidak ditemukan. Silahkan restart tab untuk memproses',
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    const validator = v.safeParse(commentValidator, commentText.value)
    if (!validator.success) {
      toast.add({
        title: 'Pufft',
        description: validator.issues[0].message,
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    loadingPostComment.value = true

    await supabase.from('story_comments').insert({
      comment_text: commentText.value,
      thread: props.comment.id,
      user: user.data.value.id,
      story: story.data.value.id,
    })

    commentText.value = ''
    await refreshNuxtData(`story/${slug}/comments`)
  } catch (error) {
    toast.add({
      title: 'Upss',
      description: 'Sepertinya terjadi kesalahan',
      color: 'error',
      icon: 'i-heroicons-x-mark-solid',
    })
    throw createError(error)
  } finally {
    loadingPostComment.value = false
  }
}

const giveReaction = async () => {
  try {
    await supabase.from('comment_reactions').insert({
      comment: props.comment.id,
      user: user.data.value.id,
    })
    await refreshNuxtData(`story/${slug}/comments`)
  } catch (error) {
    toast.add({
      title: 'Upss',
      description: 'Sepertinya terjadi kesalahan',
      color: 'error',
      icon: 'i-heroicons-x-mark-solid',
    })
    throw createError(error)
  }
}
</script>

<template>
  <div class="relative min-h-full flex flex-col">
    <div class="flex gap-2 -ml-1">
      <UserPicture
        class="border-4 border-white w-10 h-10"
        :seed="author.username"
      />

      <div class="flex gap-2 items-start">
        <div class="flex items-center gap-2">
          <ULink
            :to="`/${author.username}`"
            class="font-bold hover:underline text-primary-950"
            >{{ author.display_name }}</ULink
          >
          <UTooltip
            :text="
              isOriginalPoster
                ? 'Original poster'
                : author.role_id === 2
                  ? 'Moderator'
                  : 'Grand master'
            "
          >
            <UBadge
              v-if="isOriginalPoster || isModeratorOrAdmin"
              :color="isOriginalPoster ? 'neutral' : 'info'"
              class="px-1 py-[0.2px]"
            >
              {{
                isOriginalPoster ? 'OP' : author.role_id === 2 ? 'MOD' : 'GM'
              }}
            </UBadge>
          </UTooltip>
        </div>
        <time
          :datetime="new Date(comment.created_at).toISOString()"
          :title="new Date(comment.created_at).toISOString()"
          >{{
            formatDistanceToNowStrict(new Date(comment.created_at), {
              locale: id,
              roundingMethod: 'round',
            })
          }}</time
        >
      </div>
    </div>

    <p class="pl-11 -mt-3 text-neutral-600 text-balance">
      {{ comment.comment_text }}
    </p>

    <div class="mt-2 pl-11 flex gap-2">
      <UTooltip text="Sukai komentar">
        <UButton
          :color="isUserAlreadyReact ? 'error' : 'neutral'"
          :variant="isUserAlreadyReact ? 'soft' : 'ghost'"
          :icon="isUserAlreadyReact ? 'ph:heart-fill' : 'ph:heart'"
          @click="giveReaction"
        >
          {{ comment.reactions?.length || null }}
        </UButton>
      </UTooltip>

      <UTooltip text="Balas komentar">
        <UButton
          v-if="isMainThread"
          color="neutral"
          variant="ghost"
          icon="ph:chat-centered"
          @click="openComment = !openComment"
        >
          {{ commentCount || null }}
        </UButton>
      </UTooltip>

      <UTooltip text="Opsi">
        <UButton
          v-if="isMainThread"
          color="neutral"
          variant="ghost"
          icon="lucide:ellipsis-vertical"
          disabled
        />
      </UTooltip>
    </div>

    <span
      v-if="commentCount > 0"
      aria-hidden="true"
      class="absolute left-4 top-10 bg-neutral-300 w-[.8px] h-[calc(100%-62px)]"
      :class="{
        'h-[calc(100%-120px)]': openChild,
        'h-[calc(100%-140px)]': openComment && openChild,
        'h-[calc(100%-110px)]': openComment && !openChild,
      }"
    ></span>

    <div v-if="!openChild && commentCount > 0" class="mt-4 flex items-center">
      <UAvatarGroup :max="2" size="3xs">
        <UAvatar
          v-for="comReply in comment.replies"
          :key="comReply.id"
          :src="`${avatarBaseUrl}?seed=${comReply.author.username}`"
          :alt="comReply.author.display_name"
        />
      </UAvatarGroup>

      <UButton
        variant="ghost"
        size="sm"
        color="neutral"
        class="ml-1"
        @click="openChild = true"
      >
        Tampilkan balasan
      </UButton>
    </div>

    <div v-if="commentCount > 0 && openChild" class="flex flex-col gap-4 mt-4">
      <!-- TODO: consider using slot instead of this method -->
      <StoryCommentItem
        v-for="commentReply in comment.replies"
        :key="commentReply.id"
        :comment="commentReply"
      />
    </div>

    <div
      v-if="isLoggedIn && isMainThread && openComment"
      class="flex gap-2 pl-11 items-center mt-2"
    >
      <UTextarea
        v-model="commentText"
        :placeholder="`Balas ke ${author.display_name}`"
        class="w-3/4"
        variant="outline"
        autoresize
        autofocus
        :rows="1"
        :maxrows="6"
        :avatar="{
          src: `${avatarBaseUrl}?seed=${user.data.value.username}`,
        }"
        :loading="loadingPostComment"
        @keydown.meta.enter="postComment"
        @keydown.ctrl.enter="postComment"
      />

      <UTooltip v-if="commentText.length > 0" text="Kirim komentar">
        <UButton
          class="rounded-full"
          variant="soft"
          @click.="postComment"
          :disabled="loadingPostComment"
          icon="lucide:send"
        />
      </UTooltip>
    </div>
  </div>
</template>
