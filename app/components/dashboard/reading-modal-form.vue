<script setup lang="ts">
import * as v from 'valibot'
import type { Form } from '#ui/types'
import type { User } from '~/types/entities'

const openRecordModal = defineModel('open', { type: Boolean })

const schema = v.object({
  title: v.pipe(v.string(), v.trim(), v.nonEmpty('Judul tidak boleh kosong')),
  genre: v.number(),
  pageCount: v.number(),
  summary: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Kesimpulan tidak boleh kosong'),
  ),
})

type Schema = v.InferOutput<typeof schema>

const supabase = useSupabaseClient()
const toast = useToast()
const { data: currentUser } = useNuxtData<User>('current-user')
const { data: genres } = await useLazyAsyncData('genres', async () => {
  const { data, error } = await supabase.from('book_genres').select('id, label')

  if (error) {
    console.error(error)
    return []
  }

  return data.map(gen => ({ value: gen.id, label: gen.label }))
})

const form = ref<Form<Schema>>()
const openConfirmation = ref(false)
const state = reactive<Schema>({
  title: '',
  genre: 1,
  pageCount: 0,
  summary: '',
})

async function onSubmit() {
  const isErrors = form.value.getErrors().length > 0

  if (isErrors) return
  openConfirmation.value = true
}

async function sendNewHabit() {
  openConfirmation.value = false

  try {
    const res = await $fetch<{ data: unknown; error?: string }>(
      '/api/reading-habits',
      {
        method: 'post',
        body: {
          ...state,
          user: currentUser.value.id,
        },
      },
    )

    if (res.error) {
      toast.add({
        title: 'Terjadi kesalahan',
        description: res.error,
        color: 'red',
        icon: 'i-heroicons-x-mark-solid',
      })
      console.error(res.error)
      return
    }

    openRecordModal.value = false
    toast.add({
      title: 'OK',
      description: 'Berhasil menambahkan record baru',
      color: 'green',
      icon: 'ph:check-fat',
    })
  } catch (error) {
    toast.add({
      title: 'Terjadi kesalahan',
      description: error.message,
      color: 'red',
      icon: 'i-heroicons-x-mark-solid',
    })
    console.error(error)
    return
  } finally {
    await refreshNuxtData([
      `habits/${currentUser.value.id}`,
      `habits/${currentUser.value.id}/statistic`,
    ])
  }
}
</script>

<template>
  <UModal v-model="openRecordModal">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <b>Record Baru</b>
      </template>
      <UForm
        ref="form"
        :schema="v.safeParser(schema)"
        :state="state"
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <UFormGroup required label="Judul Buku" name="title">
          <UInput v-model="state.title" />
        </UFormGroup>
        <UFormGroup
          required
          label="Jumlah Halaman"
          help="Jumlah halaman buku yang dibaca"
          name="pageCount"
        >
          <UInput v-model="state.pageCount" type="number" />
        </UFormGroup>
        <UFormGroup required label="Jenis" name="genre">
          <URadioGroup v-model="state.genre" :options="genres" />
        </UFormGroup>
        <UFormGroup required label="Kesimpulan" name="summary">
          <UTextarea v-model="state.summary" autoresize />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-end gap-4">
          <UButton color="gray" variant="soft" @click="openRecordModal = false"
            >Tutup</UButton
          >
          <UButton
            type="submit"
            @click="onSubmit"
            trailing-icon="ph:floppy-disk-fill"
            >Simpan</UButton
          >
        </div>
      </template>
    </UCard>

    <UModal v-model="openConfirmation">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <b>Tambah baru</b>
        </template>

        <p>
          Masukan Habit yang sudah ditambahkan hanya bisa diubah maksimal 1
          kali, dan riwayat yang sudah ditambahkan tidak dapat dihapus.
        </p>
        <p>Apakah Anda sudah yakin ingin menambahkannya?</p>

        <template #footer>
          <div class="flex justify-end gap-4">
            <UButton
              color="gray"
              variant="soft"
              @click="openConfirmation = false"
              >Tutup</UButton
            >
            <UButton @click="sendNewHabit">OK tambahkan</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UModal>
</template>
