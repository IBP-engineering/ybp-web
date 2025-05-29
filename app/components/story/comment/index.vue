<script setup lang="ts">
import * as v from 'valibot'
import type { Database } from '~/types/database.types'
import type { CommentWithAuthorReplies, Story } from '~/types/entities'

defineProps<{
  comments: CommentWithAuthorReplies[]
}>()

const commentText = ref('')
const loadingPostComment = ref(false)
const openLoginModal = ref(false)

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const slug = route.params.slug
const story = useNuxtData<Story>(`story/${slug}`)
const { data: user } = await useFetch('/api/session/current-user', {
  key: 'current-user',
})

const postComment = async () => {
  try {
    if (!user.value.username) {
      openLoginModal.value = true
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

    const { data } = await supabase
      .from('story_comments')
      .insert({
        comment_text: commentText.value,
        user: user.value?.id,
        story: story.data.value?.id,
      })
      .select('id')
      .single()

    $fetch('/api/notifications/stories', {
      method: 'post',
      body: {
        type: 'comment_on_story',
        contextData: {
          content: commentText.value,
          parentComment: data.id,
        },
        relatedType: 'story',
        relatedId: story.data.value.id,
        recipientId: story.data.value.user_id,
        senderId: user.value.id,
      },
    })

    commentText.value = ''
    await refreshNuxtData(`story/${slug}/comments`)

    // clean existing query from comment
    router.replace({
      query: {},
    })

    toast.add({
      title: 'OK',
      description: 'Komentar berhasil ditambahkan',
      color: 'success',
      icon: 'lucide:circle-check-big',
    })
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

provide(onSuccessLogin, () => {
  openLoginModal.value = false
  toast.add({
    title: 'Berhasil login',
    color: 'success',
  })
})
</script>

<template>
  <section class="flex flex-col gap-4 py-4 w-full md:w-3/4">
    <i v-if="comments.length === 0" class="text-sm"
      >-- Tampaknya belum ada komentar --</i
    >
    <div class="flex gap-2 items-center">
      <UTextarea
        v-model="commentText"
        placeholder="Tinggalkan komentar"
        class="w-3/4"
        variant="outline"
        autoresize
        :rows="1"
        :maxrows="6"
        :avatar="{
          src: `${avatarBaseUrl}?seed=${user?.username}`,
          class: `${user.id ? 'block' : 'hidden'}`,
        }"
        :loading="loadingPostComment"
        @keydown.meta.enter="postComment"
        @keydown.ctrl.enter="postComment"
      />
      <UTooltip text="Kirim komentar">
        <UButton
          v-if="commentText.length > 0"
          @click.="postComment"
          class="rounded-full"
          variant="soft"
          icon="lucide:send"
          :disabled="loadingPostComment"
        />
      </UTooltip>
    </div>

    <div v-if="Boolean(comments.length)" class="flex flex-col w-full gap-8">
      <StoryCommentItem
        v-for="comment in comments"
        :key="`${comment?.id}-${comment.replies.length}`"
        :comment="comment"
      />
    </div>

    <LazySharedLoginModal v-model:open="openLoginModal" />
  </section>
</template>
