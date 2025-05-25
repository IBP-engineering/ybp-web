<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { BookGenre, ReadingHabit, User } from '~/types/entities'

const UButton = resolveComponent('UButton')

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

type Column = {
  number: number
  id: string
  name: string
  title: string
  page_count: number
  genre: string
  summary: string
  created_at: string
  point: number
  update_count: number
}

const columns: TableColumn<Partial<Column>>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : '',
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: 'number',
    header: 'No.',
  },
  {
    accessorKey: 'name',
    header: 'Nama',
  },
  {
    accessorKey: 'title',
    header: 'Judul',
  },
  {
    accessorKey: 'page_count',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Jumlah Halaman',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'genre',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Genre',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'summary',
    header: 'Kesimpulan',
    cell: ({ row }) =>
      h(
        'p',
        {
          class: 'max-w-64 truncate',
        },
        row.original.summary,
      ),
  },
  {
    accessorKey: 'point',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Poin',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const viewOnly = props.viewOnly

      if (viewOnly) {
        return
      }

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        size: 'xs',
        icon: 'i-heroicons-pencil-square-20-solid',
        disabled: row.original.update_count > 0,
        onClick: () => handleOpenModal(row.original.id),
      })
    },
  },
]

const page = defineModel('page', { type: Number })
const pageCount = defineModel('pageCount', { type: Number, default: 10 })
const searchQuery = ref('')
const expanded = ref()
const sorting = ref([
  {
    id: 'number',
    desc: false,
  },
  {
    id: 'page_count',
    desc: false,
  },
  {
    id: 'genre',
    desc: false,
  },
  {
    id: 'point',
    desc: false,
  },
])
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

const mappedData = computed(() => {
  return mapTableData(props.data)
})

const getPageNumber = (index: number) => {
  const globalIndexOffset = (page.value - 1) * pageCount.value // Correct offset calculation
  return globalIndexOffset + index + 1
}

const columnVisibility = computed(() => {
  if (props.withName) {
    return { point: false }
  }

  return { name: false, point: false }
})

const handleOpenModal = (id: string) => {
  openModal.value = true
  idToUpdate.value = id
}
</script>

<template>
  <div class="rounded-lg border border-neutral-300 bg-white py-2 shadow">
    <div
      class="flex border-b border-neutral-200 px-3 py-3.5 dark:border-neutral-700"
    >
      <UInput v-model="searchQuery" placeholder="Cari sesuatu..." />
    </div>
    <UTable
      v-model:expanded="expanded"
      v-model:column-visibility="columnVisibility"
      v-model:sorting="sorting"
      v-model:global-filter="searchQuery"
      :loading="isLoading"
      :columns="columns"
      :data="mappedData"
      :ui="{
        tr: 'data-[expanded=true]:bg-(--ui-bg-elevated)/50',
        td: 'py-2.5 px-4',
      }"
    >
      <template #expanded="{ row }">
        <div class="whitespace-normal">
          <p class="text-sm">{{ row.original.summary }}</p>
          <pre class="border border-neutral-300 p-1 text-xs">
Ditambahkan pada {{ row.original.created_at }}</pre
          >
        </div>
      </template>
    </UTable>
    <div
      class="flex justify-end border-t border-neutral-200 px-3 py-3.5 dark:border-neutral-700"
    >
      <UPagination v-model:page="page" :page-count="pageCount" :total="total" />
    </div>

    <LazyDashboardReadingModalForm
      v-model:id="idToUpdate"
      v-model:open="openModal"
    />
  </div>
</template>
