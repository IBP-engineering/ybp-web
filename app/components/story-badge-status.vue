<script setup lang="ts">
import type { StoryStatus } from '~/types/entities'

defineProps<{
  status: StoryStatus
}>()
</script>

<template>
  <div title="Story status">
    <UBadge v-if="status === 'pending'" color="blue" variant="subtle">
      <UIcon name="i-heroicons:clock-solid" class="h-4 w-4" />
      <span class="ml-1"> Pending </span>
    </UBadge>
    <UBadge v-if="status === 'published'" color="green" variant="subtle">
      <UIcon name="i-heroicons:check-badge-solid" class="h-4 w-4" />
      <span class="ml-1"> Published </span>
    </UBadge>
    <UBadge v-if="status === 'rejected'" color="red" variant="subtle">
      <UIcon name="i-heroicons:x-mark-solid" class="h-4 w-4" />
      <span class="ml-1"> Rejected </span>
    </UBadge>
  </div>
</template>
