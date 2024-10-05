<script setup lang="ts">
definePageMeta({
  middleware: 'need-auth',
})

const storyOptions = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons:pencil-square',
    },
    {
      label: 'Archive',
      icon: 'i-heroicons:folder-open',
    },
    {
      label: 'Delete',
      class: 'bg-red-100 hover:bg-red-200 text-red-900',
      iconClass: 'text-red-900',
      icon: 'i-heroicons:trash',
    },
  ],
]
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: stories } = await useAsyncData(
  `stories/${user?.value?.id}`,
  async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(title))
      `,
      )
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    return data
  },
)
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg">
    <h1 class="text-2xl font-bold leading-relaxed">Dashboard</h1>
    <p class="text-gray-600">Kamu bisa temukan cerita yang kamu kirim disini</p>

    <h2 class="mt-4 font-bold">Stories</h2>
    <small class="text-gray-600">Total stories: {{ stories?.length }}</small>

    <div
      class="mt-2 grid max-h-[850px] w-full grid-cols-1 overflow-auto rounded-b-lg rounded-t-lg border border-gray-300"
    >
      <div
        v-for="story in stories"
        :key="story.id"
        class="relative flex w-full items-center justify-between bg-gray-50 px-4 py-2 outline-none odd:border-b hover:bg-gray-100"
      >
        <NuxtLink to="/" class="outline-none focus:ring">
          <h3 class="text-primary-600 text-lg font-bold">
            {{ story.title }}
          </h3>
          <small class="text-gray-600">Diterbitkan: 20 Oktober 2020</small>
        </NuxtLink>
        <div>
          <UDropdown
            :items="storyOptions"
            :popper="{ placement: 'bottom-start', arrow: true }"
          >
            <UButton
              color="gray"
              icon="i-heroicons:ellipsis-vertical-20-solid"
            />
          </UDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
