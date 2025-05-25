<script setup lang="ts">
import type { Form, RadioGroupItem } from '@nuxt/ui'
import * as v from 'valibot'

const openRecordModal = defineModel('open', { type: Boolean })
const providedId = defineModel('id', { type: String })

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
const { data: user } = await useFetch('/api/session/current-user', {
  key: 'current-user',
})
const { data: existingHabit, status } = await useLazyAsyncData(
  `habits/${providedId.value}`,
  async () => {
    if (!providedId.value) return null

    const { data, error } = await supabase
      .from('reading_habits')
      .select('id,title,page_count,summary,genre,update_count')
      .eq('id', providedId.value)
      .single()

    if (error) {
      console.error(error)
      return null
    }

    return data
  },
  {
    watch: [providedId],
    immediate: false,
    server: false,
  },
)
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
  genre: genres?.value?.[0]?.value,
  pageCount: 0,
  summary: '',
})

async function onSubmit() {
  openConfirmation.value = true
}

async function sendNewHabit() {
  openConfirmation.value = false
  form.value.clear()

  try {
    const res = await $fetch<{ data: unknown; error?: string }>(
      '/api/reading-habits',
      {
        method: 'post',
        body: {
          ...state,
        },
      },
    )

    if (res.error) {
      toast.add({
        title: 'Terjadi kesalahan',
        description: res.error,
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      console.error(res.error)
      return
    }

    openRecordModal.value = false
    toast.add({
      title: 'OK',
      description: 'Berhasil menambahkan record baru',
      color: 'success',
      icon: 'ph:check-fat',
    })
    resetValue()
    await refreshData()
  } catch (error) {
    toast.add({
      title: 'Terjadi kesalahan',
      description: error.message,
      color: 'error',
      icon: 'i-heroicons-x-mark-solid',
    })
    console.error(error)
  }
}

const updateHabit = async () => {
  openConfirmation.value = false
  form.value.clear()
  try {
    await $fetch('/api/reading-habits', {
      method: 'PUT',
      body: {
        ...state,
        id: providedId.value,
      },
    })

    openRecordModal.value = false
    toast.add({
      title: 'OK',
      description: 'Berhasil mengubah record',
      color: 'success',
      icon: 'ph:check-fat',
    })
    resetValue()
    await refreshData()
  } catch (error) {
    toast.add({
      title: 'Terjadi kesalahan',
      description: error.message,
      color: 'success',
      icon: 'i-heroicons-x-mark-solid',
    })
    console.error(error)
  }
}

const confirmDialog = async () => {
  if (providedId.value) {
    return await updateHabit()
  }

  await sendNewHabit()
}

const resetValue = () => {
  providedId.value = null
  form.value.clear()
  state.title = ''
  state.genre = genres.value[0].value
  state.summary = ''
  state.pageCount = 0
}

// @ts-expect-error nothing
const genreItems: RadioGroupItem[] = computed(() => {
  return genres.value.map(gen => ({
    label: gen.label,
    value: gen.value,
  }))
})

const refreshData = async () => {
  await refreshNuxtData(`habits/user/${user.value.id}`)
}

watch([providedId, existingHabit], () => {
  if (providedId.value && existingHabit.value) {
    state.title = existingHabit.value.title
    state.genre = existingHabit.value.genre
    state.summary = existingHabit.value.summary
    state.pageCount = existingHabit.value.page_count
  }
})
</script>

<template>
  <UModal
    v-model:open="openRecordModal"
    :title="providedId ? 'Update Habit' : 'Tambah baru'"
    @close="resetValue"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="flex flex-col gap-4"
        @submit.prevent="onSubmit"
      >
        <div class="flex flex-col gap-4">
          <p
            class="rounded-sm border-b border-neutral-300 bg-neutral-50 text-center text-sm text-neutral-500"
          >
            {{
              new Intl.DateTimeFormat('id', { dateStyle: 'long' }).format(
                new Date(),
              )
            }}
          </p>
          <UFormField required label="Judul buku" name="title">
            <UInput
              v-model="state.title"
              class="w-full"
              :loading="status === 'pending'"
            />
          </UFormField>
          <UFormField
            required
            label="Jumlah halaman"
            help="Jumlah halaman buku yang dibaca"
            name="pageCount"
          >
            <UInput
              v-model="state.pageCount"
              :loading="status === 'pending'"
              class="w-full"
              type="number"
            />
          </UFormField>
          <UFormField required label="Jenis" name="genre">
            <URadioGroup
              v-model="state.genre"
              :disabled="status === 'pending'"
              :items="genreItems"
              orientation="horizontal"
            />
          </UFormField>
          <UFormField
            required
            eager-validation
            label="Kesimpulan"
            name="summary"
          >
            <UTextarea
              v-model="state.summary"
              :disabled="status === 'pending'"
              class="w-full"
              autoresize
            />
          </UFormField>
        </div>
        <div class="flex justify-end gap-4">
          <UButton
            color="neutral"
            variant="soft"
            @click="openRecordModal = false"
            >Batal</UButton
          >
          <UButton type="submit" :loading="status === 'pending'"
            >Simpan</UButton
          >
        </div>
      </UForm>

      <UModal
        v-model:open="openConfirmation"
        :title="providedId ? 'Update Habit' : 'Tambah baru'"
      >
        <template #body>
          <p>
            Masukan Habit yang sudah ditambahkan hanya bisa diubah maksimal 1
            kali, dan riwayat yang sudah ditambahkan tidak dapat dihapus.
          </p>
          <p>Apakah Anda sudah yakin ingin menambahkannya?</p>
        </template>

        <template #footer>
          <div class="flex w-full justify-end gap-4">
            <UButton
              color="neutral"
              variant="soft"
              @click="openConfirmation = false"
              >Batal</UButton
            >
            <UButton @click="confirmDialog">OK</UButton>
          </div>
        </template>
      </UModal>
    </template>
  </UModal>
</template>
