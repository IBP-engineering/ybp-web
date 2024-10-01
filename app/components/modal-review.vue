<script setup lang="ts">
import type { StoryStatus } from '~/types/entities'

const props = defineProps<{
  storyId: string
  status: StoryStatus
}>()

const isOpen = defineModel<boolean>()

const options: { value: StoryStatus; label: string }[] = [
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'rejected',
    label: 'Reject',
  },
  {
    value: 'approved',
    label: 'Approve',
  },
]

const selected = ref<StoryStatus>(props.status)
const reason = ref('')
const isLoading = ref(false)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const { data: storyHistories } = await useAsyncData(
  `hq/stories/${props.storyId}/history`,
  async () => {
    const { data, error } = await supabase
      .from('story_status_histories')
      .select('*')
      .eq('story_id', props.storyId)

    if (error) {
      console.error(error)
      return null
    }

    return data
  },
)

const saveStatus = async () => {
  isLoading.value = true
  console.log(selected.value, props.storyId)

  try {
    await supabase
      .from('stories')
      .update({ status: selected.value })
      .eq('id', props.storyId)
    await supabase.from('story_status_histories').insert({
      story_id: props.storyId,
      reason: reason.value,
      status: selected.value,
      updated_by: user.value.id,
    })
    isLoading.value = false
    isOpen.value = false
    await refreshNuxtData()
    toast.add({
      title: 'Berhasil',
      description: 'Status Cerita berhasil diubah',
      color: 'green',
    })
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header> Ubah status Cerita </template>

      <URadioGroup
        v-model="selected"
        legend="Pilih status"
        :options="options"
      />
      <UTextarea
        v-model="reason"
        class="mt-4"
        placeholder="Alasan (opsional)"
      />

      <template #footer>
        <div class="flex items-center justify-end gap-4">
          <UButton
            :loading="isLoading"
            color="gray"
            variant="soft"
            @click="isOpen = false"
            >Tutup</UButton
          >
          <UButton :loading="isLoading" @click="saveStatus">Simpan</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
