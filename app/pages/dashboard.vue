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
const filterStatus = ref<'all' | 'rejected' | 'approved' | 'pending'>('all')
const filterCount = reactive({
  all: 0,
  rejected: 0,
  approved: 0,
  pending: 0,
})

const { data: stories } = await useAsyncData(
  `stories/${user?.value?.id}`,
  async () => {
    if (filterStatus.value === 'all') {
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
    }

    const { data, error } = await supabase
      .from('stories')
      .select(
        `*,
      tags:story_tags!id(tag:tag_id(title))
      `,
      )
      .eq('user_id', user.value.id)
      .eq('status', filterStatus.value)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    return data
  },
  { watch: [filterStatus] },
)

watch(
  filterStatus,
  () => {
    if (filterStatus.value === 'all') {
      filterCount.pending =
        stories.value.filter(st => st.status === 'pending').length ?? 0
      filterCount.approved =
        stories.value.filter(st => st.status === 'approved').length ?? 0
      filterCount.rejected =
        stories.value.filter(st => st.status === 'rejected').length ?? 0
      filterCount.all = stories.value.length
    }
  },
  { immediate: true, once: true },
)
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg">
    <h1 class="text-2xl font-bold leading-relaxed">Dashboard</h1>
    <p class="text-gray-600">Kamu bisa temukan cerita yang kamu kirim disini</p>

    <div class="mt-8 flex w-full gap-8">
      <aside class="mt-8 flex w-[300px] flex-col">
        <UButton
          @click="filterStatus = 'all'"
          :variant="filterStatus === 'all' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
        >
          <span>Stories</span>
          <span>{{ filterCount.all }}</span>
        </UButton>
        <UButton
          @click="filterStatus = 'pending'"
          :variant="filterStatus === 'pending' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
        >
          <span>Pending</span>
          <span>{{ filterCount.pending }}</span>
        </UButton>
        <UButton
          @click="filterStatus = 'approved'"
          :variant="filterStatus === 'approved' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
        >
          <span>Approved</span>
          <span>{{ filterCount.approved }}</span>
        </UButton>
        <UButton
          @click="filterStatus = 'rejected'"
          :variant="filterStatus === 'rejected' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
        >
          <span>Rejected</span>
          <span>{{ filterCount.rejected }}</span>
        </UButton>
      </aside>

      <div class="w-full">
        <h2 class="font-bold">Stories</h2>
        <div
          class="mt-2 grid max-h-[800px] w-full grid-cols-1 overflow-auto rounded-b-lg rounded-t-lg border border-gray-300 bg-gray-50"
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
    </div>
  </div>
</template>
