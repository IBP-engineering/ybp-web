<script setup lang="ts">
import type { BookGenre, ReadingHabit, User } from '~/types/entities'

const props = withDefaults(
  defineProps<{
    withName?: boolean
    data: Partial<
      Omit<ReadingHabit, 'genre' | 'created_by'> & {
        genre: Partial<BookGenre>
        created_by: Partial<User>
      }
    >[]
  }>(),
  { withName: true },
)

const calculatedData = computed(() => {
  return props.data.map((data, i) => {
    return {
      ...data,
      number: i + 1,
      name: 'albed',
      genre: data.genre.label,
      point: data.page_count * data.genre.multiple,
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
]

const expand = ref({
  openedRows: [],
  row: {},
})

const filteredColumns = computed(() => {
  if (props.withName) {
    return columns
  }

  return columns.filter(col => col.key !== 'name')
})
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
          <pre>{{ row.summary }}</pre>
        </div>
      </template>
    </UTable>
  </div>
</template>
