<script setup lang="ts">
import { currentUser } from '~/store/session'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

await useAsyncData(
  'current-user',
  async () => {
    if (user.value) {
      const { data, error } = await supabase
        .from('users')
        .select('username, id, display_name, created_at, roles(id, name)')
        .eq('id', user.value.id)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error(error)
        currentUser.value = null
        return null
      }

      currentUser.value = data
      return data
    }

    return null
  },
  { watch: [user] },
)
</script>

<template>
  <div class="flex min-h-full flex-auto flex-col bg-gray-100">
    <slot />
  </div>
</template>
