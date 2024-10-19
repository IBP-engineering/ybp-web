<script setup lang="ts">
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'hq',
  middleware: ['admin-only'],
})

useHead({
  title: 'Users',
})

const supabase = useSupabaseClient<Database>()
const { data: users } = await useAsyncData('hq/users', async () => {
  const { data, error } = await supabase
    .from('users')
    .select(
      'username, id, display_name, created_at, roles(name), stories!id(count)',
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
})
</script>

<template>
  <div>
    <PageHeader title="Users" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: {{ users.length }}</p>

      <div class="mt-2 block">
        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="user in users" :key="user.id">
            <NuxtLink
              :to="`/hq/users/${user.username}`"
              class="hover:border-primary-400 flex w-full items-center justify-between border-2 bg-white p-2 transition focus:outline-none focus:ring"
            >
              <div class="flex items-center gap-2">
                <UserPicture :seed="user.username" width="50" height="50" />
                <div>
                  <RoleBadge :name="user.roles.name" />
                  <br />
                  <b class="mr-1">{{ user.display_name }}</b>
                  <small class="text-gray-600">@{{ user.username }}</small>
                  <p class="text-gray-600">
                    {{ user.stories[0].count }}
                    {{ user.stories[0].count > 1 ? 'stories' : 'story' }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
