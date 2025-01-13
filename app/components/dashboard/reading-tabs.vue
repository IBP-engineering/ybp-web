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
const openNewReadingRecord = ref(false)
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
    <section class="flex items-center justify-between">
      <h2 class="font-medium">Personal Reading Habits</h2>
      <UButton>Tambah baru</UButton>
    </section>

    <div class="my-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div
        class="flex flex-col rounded border border-fuchsia-300 bg-fuchsia-50 px-4 py-2 text-fuchsia-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:bowl-steam-duotone" class="h-5 w-5" />
          <small>GENRE TERBANYAK</small>
        </div>
        <p class="text-lg font-semibold">Fiksi</p>
      </div>
      <div
        class="flex flex-col rounded border border-teal-300 bg-teal-50 px-4 py-2 text-teal-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:lamp-pendant-duotone" class="h-5 w-5" />
          <small>TOTAL RECORD</small>
        </div>
        <p class="text-lg font-semibold">12</p>
      </div>
      <div
        class="flex flex-col rounded border border-orange-300 bg-orange-50 px-4 py-2 text-orange-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:clover-duotone" class="h-5 w-5" />
          <small>TOTAL POIN</small>
        </div>
        <p class="text-lg font-semibold">1800</p>
      </div>
      <div
        class="flex flex-col rounded border border-rose-300 bg-rose-50 px-4 py-2 text-rose-900"
      >
        <div class="mb-2 flex items-center gap-1">
          <UIcon name="ph:paragraph-duotone" class="h-5 w-5" />
          <small>TOTAL HALAMAN</small>
        </div>
        <p class="text-lg font-semibold">82</p>
      </div>
    </div>

    <UModal v-model="openNewReadingRecord">
      <template #header>
        <b>Record Baru</b>
      </template>
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
      </UForm>
      <template #footer>
        <div class="flex justify-end gap-4">
          <UButton color="gray" variant="soft" @click="openConfirmation = false"
            >Tutup</UButton
          >
          <UButton trailing-icon="ph:floppy-disk-fill">Simpan</UButton>
        </div>
      </template>

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

    <ReadingHabitTable />
  </div>
</template>
