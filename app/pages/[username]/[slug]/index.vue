<script lang="ts" setup>
import type { PostgrestError } from '@supabase/supabase-js'
import { format } from 'date-fns'
import id from 'date-fns/locale/id'
import type { CommentWithAuthorReplies } from '~/types/entities'

defineOgImageComponent('default')

const supabase = useSupabaseClient()
const route = useRoute()
const slug = route.params.slug
const authorUsername = route.params.username.toString()

const { data: story } = await useAsyncData(`story/${slug}`, async () => {
  const { data, error } = await supabase
    .from('stories')
    .select(
      `*,
      tags:story_tags!id(tag:tag_id(slug)),
      author:users(id, bio, display_name, username, location, profile_path, created_at),
      reactions:story_reactions!id(*)
      `,
    )
    .eq('slug', slug.toString())
    .single()

  if (error) {
    console.error('error while fetching stories by id', error)
    return null
  }

  const coverWithPath = data.cover_path
    ? supabase.storage.from('story-cover').getPublicUrl(data.cover_path).data
        .publicUrl
    : null

  return {
    ...data,
    cover_path: coverWithPath,
    tags: data.tags.map(
      tag => (tag.tag as unknown as { slug: string }).slug as string,
    ),
  }
})

const { data: comments } = await useAsyncData(
  computed(() => `story/${slug}/comments`),
  async () => {
    const { data, error } = (await supabase
      .from('story_comments')
      .select(
        `*,
      author:users(id, display_name, username, profile_path, role_id),
      reactions:comment_reactions(id, user)
      `,
      )
      .eq('story', story.value.id)
      .neq('status', 'deleted')) as {
      data: CommentWithAuthorReplies[]
      error: PostgrestError
    }

    if (error) {
      console.error('error while fetching comments', error)
      return []
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

    return topLevelComments ?? []
  },
  { default: () => [] },
)

if (!story.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman tidak ditemukan',
  })
}

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: story.value?.author?.username ?? '',
    to: `/${story.value?.author?.username}`,
  },
  {
    label: story.value?.slug ?? '',
  },
]

useSeoMeta({
  title: story.value?.title,
  description: `Cerita berjudul ${story.value.title} dari penulis ${story.value.author.display_name}`,
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl md:px-4 xl:px-0">
    <div class="container mx-auto px-4 md:px-0">
      <UBreadcrumb divider="/" :items="breadcrumbs" />
    </div>

    <div
      v-if="story?.id"
      class="mt-4 flex z-10 w-full flex-col-reverse gap-4 lg:flex-row"
    >
      <StoryReactions :story="story" :comment-count="comments?.length ?? 0" />
      <div class="flex w-full flex-col">
        <div
          class="w-full overflow-hidden shadow md:rounded-lg md:border md:border-neutral-300 md:bg-neutral-50"
        >
          <img
            v-if="story?.cover_path"
            :src="story.cover_path"
            width="700"
            height="400"
            alt="Story cover"
            class="w-full"
          />
          <div class="px-4 py-4 md:px-10">
            <UAlert
              v-if="story?.status !== 'approved'"
              :color="story?.status === 'pending' ? 'warning' : 'info'"
              title="Halo pembaca!"
              icon="heroicons:exclamation-triangle"
            >
              <template #description>
                <p v-if="story?.status === 'pending'">
                  Cerita ini belum dipublikasikan dan masih dalam tahap
                  pengecekan oleh editor kami
                </p>
                <p v-else>
                  Cerita ini belum dipublikasikan dan masih ada yang perlu
                  diperbaiki oleh penulis
                </p>
              </template>
            </UAlert>

            <div class="my-4 flex items-center gap-4">
              <SharedUserPicture :data="story.author" width="35" height="35" />
              <div>
                <ULink
                  :to="`/${authorUsername}`"
                  class="text-sm font-semibold hover:underline"
                  title="To author page"
                  >{{ story?.author.display_name }}</ULink
                >
                <small
                  :title="
                    format(new Date(story?.created_at), 'PPPppp', {
                      locale: id,
                    })
                  "
                  class="block text-xs text-neutral-600"
                  >Ditulis pada
                  {{
                    format(new Date(story?.created_at), 'PPP', { locale: id })
                  }}</small
                >
              </div>
            </div>
            <h1
              class="text-2xl font-bold md:text-3xl lg:text-4xl lg:leading-tight"
            >
              {{ story?.title }}
            </h1>
            <div class="mt-2">
              <StoryTag v-for="tag in story?.tags" :key="tag" :tag="tag" />
            </div>

            <div class="prose mt-8" v-html="story?.content" />
          </div>
        </div>

        <div class="block lg:hidden mt-4">
          <StoryAsideProfile
            class="border-transparent py-0 md:p-0 bg-white shadow-none"
            :author="story?.author"
          />
        </div>
      </div>

      <StoryAside :author="story?.author" />
    </div>

    <section class="mt-8 px-4 md:px-0 lg:px-18">
      <div class="flex grow-0 gap-1 items-start">
        <h4 id="commentary" class="font-bold scroll-m-24">Komentar</h4>
        <UBadge size="sm" variant="soft" icon="heroicons:sparkles">BARU</UBadge>
      </div>

      <StoryComment :comments="comments ?? []" />
    </section>
  </div>
</template>
