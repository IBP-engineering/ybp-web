<script setup lang="ts">
import type { BookGenre, ReadingHabit, User } from '~/types/entities'

const props = withDefaults(
  defineProps<{
    withName?: boolean
    viewOnly?: boolean
    isLoading?: boolean
    total: number
    data: Partial<
      Omit<ReadingHabit, 'genre' | 'created_by'> & {
        genre: Partial<BookGenre>
        created_by: Partial<User>
      }
    >[]
  }>(),
  { withName: true, isLoading: false, viewOnly: false },
)
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
    sortable: true,
  },
  {
    key: 'genre',
    label: 'Genre',
    sortable: true,
  },
  {
    key: 'summary',
    label: 'Kesimpulan',
    rowClass: 'max-w-64 truncate',
  },
  {
    key: 'point',
    label: 'Poin',
    sortable: true,
  },
  {
    key: 'actions',
  },
]

const page = defineModel('page', { type: Number })
const pageCount = defineModel('pageCount', { type: Number, default: 10 })
const searchQuery = ref('')
const expand = ref({
  openedRows: [],
  row: {},
})
const openModal = ref(false)
const idToUpdate = ref('')

const mapTableData = (data: typeof props.data) => {
  if (data?.length === 0) {
    return []
  }

  return data.map((data, i) => {
    return {
      ...data,
      number: getPageNumber(i),
      name: data.created_by.display_name,
      genre: data.genre.label,
      point: data.page_count * data.genre.multiple,
      created_at: new Intl.DateTimeFormat('id', {
        dateStyle: 'long',
        timeStyle: 'long',
      }).format(new Date(data.created_at)),
    }
  })
}

const calculatedData = computed(() => {
  if (!searchQuery.value) {
    return mapTableData(props.data)
  }

  const searchedData = props.data?.filter(book => {
    return Object.values(book).some(value => {
      return String(value)
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    })
  })

  return mapTableData(searchedData)
})

const getPageNumber = (index: number) => {
  const globalIndexOffset = (page.value - 1) * pageCount.value // Correct offset calculation
  return globalIndexOffset + index + 1
}

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
  <div class="rounded-lg border border-neutral-300 bg-white py-2 shadow">
    <div class="flex border-b border-neutral-200 px-3 py-3.5 dark:border-neutral-700">
      <UInput v-model="searchQuery" placeholder="Cari sesuatu..." />
    </div>
    <UTable
      v-model:expand="expand"
      :loading="isLoading"
      :columns="filteredColumns"
      :rows="calculatedData"
    >
      <template #expand="{ row }">
        <div class="p-4">
          <p class="text-sm">{{ row.summary }}</p>
          <pre class="border border-neutral-300 p-1 text-xs">
Ditambahkan pada {{ row.created_at }}</pre
          >
        </div>
      </template>
      <template v-if="!viewOnly" #actions-data="{ row }">
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-heroicons-pencil-square-20-solid"
          :disabled="row.update_count > 0"
          @click="() => handleOpenModal(row.id)"
        />
      </template>
    </UTable>
    <div
      class="flex justify-end border-t border-neutral-200 px-3 py-3.5 dark:border-neutral-700"
    >
      <UPagination v-model="page" :page-count="pageCount" :total="total" />
    </div>

    <LazyDashboardReadingModalForm
      v-model:id="idToUpdate"
      v-model:open="openModal"
    />
  </div>
</template>
