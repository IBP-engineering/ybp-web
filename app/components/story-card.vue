<script setup lang="ts">
import { format } from '@formkit/tempo'
import type { Story, Tag, User } from '~/types/entities'

const props = defineProps<{
  data: {
    is_published: boolean
    story: Story & { tags: Tag[]; author: User }
  }
}>()

const imageUrl = ref('')
const supabase = useSupabaseClient()

if (props.data.story.cover_path) {
  const { data: coverResult } = supabase.storage
    .from('story-cover')
    .getPublicUrl(props.data.story.cover_path)

  imageUrl.value = coverResult?.publicUrl
}
</script>

<template>
  <div
    class="flex flex-col gap-0 rounded border border-gray-200 bg-white shadow transition hover:shadow-lg md:flex-row md:gap-4 md:pr-2"
  >
    <div class="relative">
      <img
        v-if="Boolean(imageUrl)"
        :src="imageUrl"
        alt="Cover"
        width="250"
        height="130"
        class="h-full w-full rounded-t md:w-[250px] md:rounded-l md:rounded-tr-none"
      />
      <div
        v-if="data.is_published"
        class="border-primary-300 bg-primary-50 absolute right-0 top-0 h-7 w-7 rounded-full border md:-right-3 md:-top-2"
      >
        <UIcon
          name="i-heroicons:check-badge-solid"
          class="text-primary-500 h-6 w-6"
        />
      </div>
    </div>
    <section class="px-2 py-2 md:px-0">
      <NuxtLink
        class="hover:text-primary-600 text-lg font-semibold leading-relaxed md:text-2xl"
        :to="`/hq/stories/${data.story.slug}`"
      >
        {{ data.story.title }}
      </NuxtLink>
      <div class="text-gray-600">
        <span> oleh </span>
        <ULink
          :to="`/hq/members/${data.story.author.username}`"
          inactive-class="underline hover:text-primary-600"
          >{{ data.story.author.display_name }}</ULink
        >
      </div>
      <p class="text-gray-600">
        {{ format(data.story.created_at, 'DD MMM YYYY, HH:mm') }}
      </p>
      <NuxtLink
        class="mt-4 flex items-center text-gray-600 hover:underline"
        :to="`/hq/stories/${data.story.slug}`"
      >
        Detail
        <UIcon name="i-heroicons:arrow-up-right-solid" />
      </NuxtLink>
    </section>
  </div>
</template>
