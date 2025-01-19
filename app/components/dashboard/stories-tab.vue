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
      tags:story_tags!id(tag:tag_id(title))
      `,
      )
      .eq('user_id', user.value.id)
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
      .eq('user_id', user.value.id)

    if (error) {
      toast.add({
        title: 'Terjadi kesalahan',
        description: 'Mohon ulangi kembali sesaat lagi',
        color: 'red',
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
  <div class="mx-auto w-full max-w-screen-lg px-4 md:px-0">
    <div class="flex items-start justify-between gap-8 md:items-center">
      <section>
        <h1 class="text-2xl font-bold leading-relaxed">Dashboard</h1>
        <p class="text-gray-600">
          Kamu bisa temukan cerita yang kamu kirim disini
        </p>
      </section>

      <UButton trailing-icon="heroicons:plus" to="/new">New story</UButton>
    </div>

    <div class="mt-8 flex w-full gap-8">
      <aside class="mt-8 hidden w-[300px] flex-col md:flex">
        <UButton
          :variant="filterStatus === 'all' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
          @click="filterStatus = 'all'"
        >
          <span>All Story</span>
          <span>{{ filterCount.all }}</span>
        </UButton>
        <UButton
          :variant="filterStatus === 'pending' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
          @click="filterStatus = 'pending'"
        >
          <span>Pending</span>
          <span>{{ filterCount.pending }}</span>
        </UButton>
        <UButton
          :variant="filterStatus === 'approved' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
          @click="filterStatus = 'approved'"
        >
          <span>Approved</span>
          <span>{{ filterCount.approved }}</span>
        </UButton>
        <UButton
          :variant="filterStatus === 'rejected' ? 'solid' : 'ghost'"
          class="flex justify-between"
          size="lg"
          color="gray"
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
          class="mt-2 grid max-h-[650px] w-full grid-cols-1 overflow-auto rounded-b-lg rounded-t-lg border border-gray-300 bg-gray-50 md:max-h-[800px]"
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

    <UModal v-model="isOpenStatus">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <b>Status cerita</b>
        </template>

        <StoryHistories :story-histories="storyHistories" />

        <template #footer>
          <div class="flex justify-end">
            <UButton color="gray" variant="soft" @click="isOpenStatus = false"
              >Tutup</UButton
            >
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
