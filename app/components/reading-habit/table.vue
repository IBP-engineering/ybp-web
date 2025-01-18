<script setup lang="ts">
import type { BookGenre, ReadingHabit, User } from '~/types/entities'

const props = withDefaults(
  defineProps<{
    withName?: boolean
    viewOnly?: boolean
    data: Partial<
      Omit<ReadingHabit, 'genre' | 'created_by'> & {
        genre: Partial<BookGenre>
        created_by: Partial<User>
      }
    >[]
  }>(),
  { withName: true, viewOnly: false },
)

const calculatedData = computed(() => {
  return props.data.map((data, i) => {
    return {
      ...data,
      number: i + 1,
      name: data.created_by.display_name,
      genre: data.genre.label,
      point: data.page_count * data.genre.multiple,
      created_at: new Intl.DateTimeFormat('id', {
        dateStyle: 'long',
        timeStyle: 'long',
      }).format(new Date(data.created_at)),
    }
  })
})

const columns = [
  {
    key: 'number',
    label: 'No.',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'title',
    label: 'Judul',
  },
  {
    key: 'page_count',
    label: 'Jumlah Halaman',
  },
  {
    key: 'genre',
    label: 'Genre',
  },
  {
    key: 'summary',
    label: 'Kesimpulan',
    rowClass: 'max-w-64 truncate',
  },
  {
    key: 'point',
    label: 'Poin',
  },
  {
    key: 'actions',
  },
]

const expand = ref({
  openedRows: [],
  row: {},
})
const openModal = ref(false)
const idToUpdate = ref('')

const filteredColumns = computed(() => {
  if (props.withName) {
    return columns
  }

  return columns.filter(col => col.key !== 'name')
})

const handleOpenModal = (id: string) => {
  openModal.value = true
  idToUpdate.value = id
}
</script>

<template>
  <div class="rounded-lg border border-gray-300 bg-white py-2 shadow">
    <UTable
      v-model:expand="expand"
      :columns="filteredColumns"
      :rows="calculatedData"
    >
      <template #expand="{ row }">
        <div class="p-4">
          <p class="text-sm">{{ row.summary }}</p>
          <pre class="border border-gray-300 p-1 text-xs">
Ditambahkan pada {{ row.created_at }}</pre
          >
        </div>
      </template>
      <template v-if="!viewOnly" #actions-data="{ row }">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-pencil-square-20-solid"
          @click="() => handleOpenModal(row.id)"
        />
      </template>
    </UTable>

    <LazyDashboardReadingModalForm
      v-model:id="idToUpdate"
      v-model:open="openModal"
    />
  </div>
</template>
