<script setup lang="ts">
import type { StoryStatus } from '~/types/entities'

defineProps<{
  status: StoryStatus
}>()
</script>

<template>
  <div title="Story status">
    <UBadge v-if="status === 'pending'" color="info" variant="subtle">
      <UIcon name="i-heroicons:clock-solid" class="h-4 w-4" />
      <span class="ml-1"> Pending </span>
    </UBadge>
    <UBadge v-if="status === 'approved'" color="success" variant="subtle">
      <UIcon name="i-heroicons:check-badge-solid" class="h-4 w-4" />
      <span class="ml-1"> Approved </span>
    </UBadge>
    <UBadge v-if="status === 'rejected'" color="error" variant="subtle">
      <UIcon name="i-heroicons:x-mark-solid" class="h-4 w-4" />
      <span class="ml-1"> Rejected </span>
    </UBadge>
  </div>
</template>
