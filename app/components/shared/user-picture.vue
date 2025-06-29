<script setup lang="ts">
import type { Database } from '~/types/database.types'

const props = withDefaults(
  defineProps<{
    data?: { username?: string; profile_path?: string }
    useAvatar?: boolean
  }>(),
  { data: null, useAvatar: true },
)

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
      v-if="useAvatar"
      v-bind="$attrs"
      :src="pictureUrl"
      :alt="data.username"
      class="rounded-full border-2 border-neutral-300 bg-neutral-50"
    />
    <img
      v-else
      v-bind="$attrs"
      loading="lazy"
      decoding="async"
      :src="pictureUrl"
    />
  </UTooltip>
</template>
