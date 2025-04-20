<script setup lang="ts">
import type { Database } from '~/types/database.types'
import type { StoryStatus } from '~/types/entities'

const props = defineProps<{
  storyId: string
  status: StoryStatus
}>()

const isOpen = defineModel<boolean>()

const items: { value: StoryStatus; label: string }[] = [
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
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const toast = useToast()
const { data: storyHistories } = await useAsyncData(
  `hq/stories/${props.storyId}/history`,
  async () => {
    const { data, error } = await supabase
      .from('story_status_histories')
      .select('*, updated_by(display_name)')
      .eq('story_id', props.storyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return null
    }

    return data.map(his => ({
      ...his,
      updated_by: {
        ...(his.updated_by as unknown as { display_name: string }),
      },
    }))
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
      color: 'success',
    })
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard>
        <template #header> Ubah status Cerita </template>

        <URadioGroup v-model="selected" legend="Pilih status" :items="items" />
        <UTextarea
          v-model="reason"
          class="mt-4 w-full"
          placeholder="Alasan (opsional)"
        />

        <div class="mt-4 border-t py-2">
          <b>Riwayat</b>
          <StoryHistories class="mt-4" :story-histories="storyHistories" />
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-4">
            <UButton
              :loading="isLoading"
              color="neutral"
              variant="soft"
              @click="isOpen = false"
              >Tutup</UButton
            >
            <UButton :loading="isLoading" @click="saveStatus">Simpan</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
