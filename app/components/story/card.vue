<script setup lang="ts">
import { format } from 'date-fns'
import id from 'date-fns/locale/id'
import type { Story, User } from '~/types/entities'

defineProps<{
  story: Partial<Story & { tags: { slug: string }[] }>
  author: Partial<User>
}>()
</script>

<template>
  <div
    class="rounded border border-gray-300 bg-gray-50 p-4 hover:border-gray-400"
  >
    <NuxtLink
      :to="`/${author.username}`"
      title="To author page"
      class="group flex items-center gap-x-2"
    >
      <div>
        <UserPicture :seed="author.username" width="35" height="35" />
      </div>
      <div>
        <span class="group-hover:text-primary-600 outline-none focus:ring">{{
          author.display_name
        }}</span>
        <small class="block text-gray-600">{{
          format(new Date(story.created_at), 'PP', { locale: id })
        }}</small>
      </div>
    </NuxtLink>
    <div class="ml-10 mt-1">
      <NuxtLink
        :to="`/${author.username}/${story.slug}`"
        class="hover:text-primary-600 text-xl font-bold tracking-wide transition"
        :title="story.title"
      >
        {{ story.title }}
      </NuxtLink>
      <div v-if="story.tags.length > 0" class="mt-2 space-x-1">
        <StoryTag v-for="tag in story.tags" :key="tag.slug" :tag="tag.slug" />
      </div>
    </div>
  </div>
</template>
