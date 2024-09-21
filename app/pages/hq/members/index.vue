<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Members',
})

const supabase = useSupabaseClient()
const { data: members } = await useAsyncData('members', async () => {
  const { data, error } = await supabase
    .from('users')
    .select('username, id, display_name, created_at')
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
    <PageHeader title="Members" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: {{ members.length }}</p>

      <div class="mt-2 block">
        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="member in members" :key="member.id">
            <NuxtLink
              :to="`/hq/members/${member.username}`"
              class="hover:border-primary-400 flex w-full items-center justify-between border-2 bg-white p-2 transition focus:outline-none focus:ring"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${member.username}`"
                  alt="Profile picture"
                  class="rounded-full border bg-gray-50"
                  width="50"
                  height="50"
                />
                <div>
                  <RoleBadge />
                  <br />
                  <b class="mr-1">{{ member.display_name }}</b>
                  <small class="text-gray-600">@{{ member.username }}</small>
                  <p class="text-gray-600">2 stories</p>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
