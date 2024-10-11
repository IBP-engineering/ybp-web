<script setup lang="ts">
import { format } from '@formkit/tempo'

const route = useRoute()
const supabase = useSupabaseClient()
const username = route.params.username

const { data: user } = await useAsyncData(`users/${username}`, async () => {
  const { data } = await supabase
    .from('users')
    .select('username, display_name, bio, created_at')
    .eq('username', username)
    .single()

  return data
})
</script>

<template>
  <div class="mx-auto w-full max-w-screen-lg">
    <div
      class="mt-10 flex w-full flex-col items-center rounded-lg border-4 border-gray-300 bg-white px-4 pb-4 text-center"
    >
      <UserPicture
        seed="kalwabed"
        class="-mt-8 border-4 border-gray-300"
        width="80"
        height="80"
      />
      <b class="mt-6 text-3xl">{{ user.display_name }}</b>
      <p class="mt-2 md:w-[75%]">
        {{ user.bio }}
      </p>

      <div class="mt-8 space-x-4 text-gray-500">
        <span class="inline-flex items-center gap-1"
          ><UIcon name="heroicons:map-pin-solid" class="h-6 w-6" />
          Indonesia</span
        >
        <span class="inline-flex items-center gap-1"
          ><UIcon name="heroicons:cake-solid" class="h-6 w-6" /> Bergabung pada
          {{ format(user.created_at, 'long', 'id') }}</span
        >
      </div>
    </div>
  </div>
</template>
