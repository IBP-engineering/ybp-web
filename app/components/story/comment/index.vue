<script setup lang="ts">
import type { PostgrestError } from '@supabase/supabase-js'
import * as v from 'valibot'
import type { Database } from '~/types/database.types'
import type { CommentWithAuthorReplies, User } from '~/types/entities'

const commentText = ref('')
const loadingPostComment = ref(false)

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const toast = useToast()
const slug = route.params.slug
const story = useNuxtData(`story/${slug}`)
const user = useNuxtData<User>('current-user')

const { data: comments } = await useAsyncData(
  `story/${slug}/comments`,
  async () => {
    const { data, error } = (await supabase
      .from('story_comments')
      .select(
        `*,
      author:users(id, display_name, username, role_id)
      `,
      )
      .eq('story', story.data.value.id)
      .neq('status', 'deleted')) as {
      data: CommentWithAuthorReplies[]
      error: PostgrestError
    }

    if (error) {
      console.error(error)
      return null
    }

    const commentsById = new Map<string, CommentWithAuthorReplies>()
    const topLevelComments: CommentWithAuthorReplies[] = []

    data.forEach(comment => {
      commentsById.set(comment.id, comment)
      comment.replies = []

      if (!comment.thread) {
        topLevelComments.push(comment)
      }
    })

    data.forEach(comment => {
      const parentId = comment.thread

      if (parentId) {
        const parentComment = commentsById.get(parentId)

        if (parentComment) {
          parentComment.replies.push(comment)
        }
      }
    })

    return topLevelComments
  },
)

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
      user: user.data.value.id,
      story: story.data.value.id,
    })

    commentText.value = ''
    await refreshNuxtData(`story/${slug}/comments`)
    toast.add({
      title: 'OK',
      description: 'Komentar berhasil dikirim',
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
</script>

<template>
  <section class="flex flex-col gap-4 py-4 w-full md:w-3/4">
    <div v-if="user.data.value" class="flex gap-2 items-center">
      <UTextarea
        v-model="commentText"
        placeholder="Tinggalkan komentar"
        class="w-3/4"
        variant="outline"
        autoresize
        :rows="1"
        :maxrows="6"
        :avatar="{
          src: `${avatarBaseUrl}?seed=${user.data.value.username}`,
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

    <div class="flex flex-col w-full gap-8">
      <StoryCommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </section>
</template>
