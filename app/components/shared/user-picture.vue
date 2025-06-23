<script setup lang="ts">
import type { Database } from '~/types/database.types'

const props = defineProps<{
  data: { username?: string; profile_path?: string }
}>()

const supabase = useSupabaseClient<Database>()

const pictureUrl = computed(() => {
  if (props.data.profile_path) {
    return supabase.storage
      .from('profile')
      .getPublicUrl(props.data.profile_path).data.publicUrl
  }

  return `${avatarBaseUrl}?seed=${props.data?.username ?? 'defaut'}`
})
</script>

<template>
  <UTooltip :text="data.username">
    <UAvatar
      :src="pictureUrl"
      :alt="data.username"
      class="rounded-full border-2 border-neutral-300 bg-neutral-50"
    />
  </UTooltip>
</template>
