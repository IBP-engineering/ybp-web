<script setup lang="ts">
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'hq',
  middleware: ['admin-only'],
})

useHead({
  title: 'Users',
})

const ITEMS_PER_PAGE = 12
const dummyArray = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => i)

const router = useRouter()
const route = useRoute()
const page = ref(+route.query.page || 1)

const supabase = useSupabaseClient<Database>()
const { data: users, status } = await useAsyncData(
  computed(() => `hq/users?page=${page.value}`),
  async () => {
    const startIndex = (page.value - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE - 1
    const { data, error, count } = await supabase
      .from('users')
      .select(
        'username, id, display_name, created_at, roles(name), stories!id(count)',
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex)

    if (error) {
      console.error(error)
      return { items: [], totalPages: 0, totalCount: 0 }
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    return { items: data, totalPages, totalCount }
  },
  {
    default: () => ({ items: [], totalPages: 0, totalCount: 0 }),
  },
)

watch(page, () => {
  router.push({
    query: {
      page: page.value,
    },
  })
})
</script>

<template>
  <div>
    <HqPageHeader title="Users" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: {{ users.totalCount }}</p>

      <div class="mt-2 block">
        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <template v-if="status === 'pending'">
            <li v-for="idx in dummyArray" :key="idx">
              <HqUserCardSkeleton />
            </li>
          </template>

          <template v-else>
            <li v-for="user in users.items" :key="user.id">
              <HqUserCard :user="user" />
            </li>
          </template>
        </ul>
      </div>

      <div class="flex justify-end mt-8 w-full">
        <UPagination
          v-model:page="page"
          :items-per-page="ITEMS_PER_PAGE"
          :total="users.totalCount"
        />
      </div>
    </div>
  </div>
</template>
