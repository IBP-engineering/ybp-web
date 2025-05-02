<script lang="ts" setup>
import { format } from 'date-fns'
import id from 'date-fns/locale/id'

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
      author:users(id, bio, display_name, username, location, created_at),
      reactions:story_reactions!id(*)
      `,
    )
    .eq('slug', slug.toString())
    .single()

  if (error) {
    console.error(error)
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

    <div class="mt-4 flex z-10 w-full flex-col-reverse gap-4 lg:flex-row">
      <StoryReactions :story="story" />
      <div class="flex w-full flex-col">
        <div
          class="w-full overflow-hidden shadow md:rounded-lg md:border md:border-neutral-300 md:bg-neutral-50"
        >
          <img
            v-if="story.cover_path"
            :src="story.cover_path"
            width="700"
            height="400"
            alt="Story cover"
            class="w-full"
          />
          <div class="px-4 py-4 md:px-10">
            <UAlert
              v-if="story.status !== 'approved'"
              :color="story.status === 'pending' ? 'warning' : 'info'"
              title="Halo pembaca!"
              icon="heroicons:exclamation-triangle"
            >
              <template #description>
                <p v-if="story.status === 'pending'">
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
              <UserPicture :seed="authorUsername" width="35" height="35" />
              <div>
                <ULink
                  :to="`/${authorUsername}`"
                  class="text-sm font-semibold hover:underline"
                  title="To author page"
                  >{{ story.author.display_name }}</ULink
                >
                <small
                  :title="
                    format(new Date(story.created_at), 'PPPppp', { locale: id })
                  "
                  class="block text-xs text-neutral-600"
                  >Ditulis pada
                  {{
                    format(new Date(story.created_at), 'PPP', { locale: id })
                  }}</small
                >
              </div>
            </div>
            <h1
              class="text-2xl font-bold md:text-3xl lg:text-4xl lg:leading-tight"
            >
              {{ story.title }}
            </h1>
            <div class="mt-2">
              <StoryTag v-for="tag in story.tags" :key="tag" :tag="tag" />
            </div>

            <div class="prose mt-8" v-html="story.content" />
          </div>
        </div>

        <div class="block lg:hidden mt-4">
          <StoryAsideProfile
            class="border-transparent py-0 md:p-0 bg-white shadow-none"
            :author="story.author"
          />
        </div>
      </div>

      <StoryAside :author="story.author" />
    </div>

    <section class="mt-8 px-4">
      <h4 id="commentary" class="font-bold scroll-m-24">Komentar</h4>

      <StoryComment />
    </section>

    <SharedJoinBanner class="mt-8">
      Punya cerita menarik yang ingin dibagikan? Di sinilah tempatnya kamu bisa
      membagikan kisah, pengalaman, tips bermanfaat, atau ulasan buku favorit.
      Saatnya tulisan kamu menemukan pembaca! 📖
    </SharedJoinBanner>
  </div>
</template>
