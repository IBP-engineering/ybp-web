<script setup lang="ts">
import * as v from 'valibot'

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

const genres = [
  { value: 0, label: 'Fiksi' },
  { value: 1, label: 'Non-Fiksi' },
]

const openConfirmation = ref(false)
const state = reactive<Schema>({
  title: '',
  genre: 0,
  pageCount: 0,
  summary: '',
})

async function onSubmit() {
  // Do something with event.data
  openConfirmation.value = true
}

async function sendNewHabit() {
  openConfirmation.value = false
}
</script>

<template>
  <div>
    <h2 class="font-medium">Personal Reading Habits</h2>

    <div class="mt-4">
      <UForm
        :schema="v.safeParser(schema)"
        :state="state"
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <div class="grid grid-cols-2 gap-8">
          <UFormGroup required label="Judul Buku" name="title">
            <UInput v-model="state.title" />
          </UFormGroup>
          <UFormGroup required label="Jumlah Halaman" name="pageCount">
            <UInput v-model="state.pageCount" type="number" />
          </UFormGroup>
        </div>
        <UFormGroup required label="Jenis" name="genre">
          <URadioGroup v-model="state.genre" :options="genres" />
        </UFormGroup>
        <UFormGroup required label="Kesimpulan" name="summary">
          <UTextarea v-model="state.summary" autoresize />
        </UFormGroup>

        <div class="flex justify-end">
          <UButton type="submit" trailing-icon="ph:floppy-disk-fill"
            >Simpan</UButton
          >
        </div>
      </UForm>
    </div>

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
  </div>
</template>
