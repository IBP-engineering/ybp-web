<script setup lang="ts">
import type { Database } from '~/types/database.types'

const toast = useToast()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const filterStatus = ref<'all' | 'rejected' | 'approved' | 'pending'>('all')
const isOpenStatus = ref(false)
const storyHistories = ref([])
const filterCount = reactive({
  all: 0,
  rejected: 0,
  approved: 0,
  pending: 0,
})

const { data: stories, refresh: refreshStories } = await useAsyncData(
  `stories/${user?.value?.sub}`,
  async () => {
    if (filterStatus.value === 'all') {
      const { data, error } = await supabase
        .from('stories')
        .select(
          `*,
      tags:story_tags!id(tag:tag_id(title)),
      author:users(username)
      `,
        )
        .eq('user_id', user.value.sub)
        .eq('is_active', true)
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
      tags:story_tags!id(tag:tag_id(title)),
      author:users(username)
      `,
      )
      .eq('user_id', user.value.sub)
      .eq('status', filterStatus.value)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    return data
  },
  { watch: [filterStatus] },
)

const deleteStory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('stories')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.value.sub)

    if (error) {
      toast.add({
        title: 'Terjadi kesalahan',
        description: 'Mohon ulangi kembali sesaat lagi',
        color: 'error',
      })
      await refreshStories()
      calculateStoryCount()
      return
    }

    toast.add({
      title: 'OK',
      description: 'Berhasil menghapus cerita',
      color: 'primary',
    })
    await refreshStories()
    calculateStoryCount()
  } catch (error) {
    console.error(error)
    await refreshStories()
    calculateStoryCount()
  }
}

const calculateStoryCount = () => {
  filterCount.pending =
    stories.value.filter(st => st.status === 'pending').length ?? 0
  filterCount.approved =
    stories.value.filter(st => st.status === 'approved').length ?? 0
  filterCount.rejected =
    stories.value.filter(st => st.status === 'rejected').length ?? 0
  filterCount.all = stories.value.length
}

const openStatus = async (id: string) => {
  try {
    const { data } = await supabase
      .from('story_status_histories')
      .select('*, updated_by(display_name)')
      .eq('story_id', id)
      .order('created_at', { ascending: false })

    storyHistories.value = data.map(his => ({
      ...his,
      updated_by: {
        ...(his.updated_by as unknown as { display_name: string }),
      },
    }))
    isOpenStatus.value = true
  } catch (error) {
    console.error(error)
  }
}

watch(
  filterStatus,
  () => {
    if (filterStatus.value === 'all') {
      calculateStoryCount()
    }
  },
  { immediate: true, once: true },
)
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl px-4 md:px-0">
    <div class="mt-8 flex w-full gap-8">
      <aside class="mt-8 hidden w-[300px] flex-col md:flex">
        <UButton
          :variant="filterStatus === 'all' ? 'subtle' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="neutral"
          @click="filterStatus = 'all'"
        >
          <span>All Story</span>
          <span>{{ filterCount.all }}</span>
        </UButton>
        <UButton
          :variant="filterStatus === 'pending' ? 'subtle' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="neutral"
          @click="filterStatus = 'pending'"
        >
          <span>Pending</span>
          <span>{{ filterCount.pending }}</span>
        </UButton>
        <UButton
          :variant="filterStatus === 'approved' ? 'subtle' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="neutral"
          @click="filterStatus = 'approved'"
        >
          <span>Approved</span>
          <span>{{ filterCount.approved }}</span>
        </UButton>
        <UButton
          :variant="filterStatus === 'rejected' ? 'subtle' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="neutral"
          @click="filterStatus = 'rejected'"
        >
          <span>Rejected</span>
          <span>{{ filterCount.rejected }}</span>
        </UButton>
      </aside>

      <div class="w-full">
        <div class="flex items-center justify-between">
          <h2 class="font-medium">Stories</h2>
          <UButton
            to="/new"
            trailing-icon="heroicons:arrow-small-right-20-solid"
            >New story</UButton
          >
        </div>
        <p v-if="stories.length === 0" class="mt-4">
          Belum ada Story yang ditambahkan
        </p>
        <div
          v-else
          class="mt-2 grid max-h-[650px] w-full grid-cols-1 overflow-auto rounded-t-lg rounded-b-lg border border-neutral-300 bg-neutral-50 md:max-h-[800px]"
        >
          <DashboardStoryCard
            v-for="story in stories"
            :key="story.id"
            :story="story"
            @delete="deleteStory"
            @status="openStatus"
          />
        </div>
      </div>
    </div>

    <UModal v-model:open="isOpenStatus" title="Status Cerita">
      <template #body>
        <StoryHistories :story-histories="storyHistories" />
      </template>
      <template #footer>
        <div class="flex w-full justify-end">
          <UButton color="neutral" variant="soft" @click="isOpenStatus = false"
            >Tutup</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>
