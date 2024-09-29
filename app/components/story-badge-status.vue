<script setup lang="ts">
import { format } from '@formkit/tempo'
import type { StoryStatus } from '~/types/entities'

const props = defineProps<{
  status: StoryStatus
}>()

let actualStatus: 'publish' | 'reject' | 'pending' = props.status.is_published
  ? 'publish'
  : props.status.is_rejected
    ? 'reject'
    : 'pending'
</script>

<template>
  <div>
    <UTooltip
      title="Status"
      :text="`Terakhir update: ${format(status.updated_at, 'DD/MM/YYYY, HH:mm')}`"
    >
      <UBadge v-if="actualStatus === 'pending'" color="blue" variant="subtle">
        <UIcon name="i-heroicons:clock-solid" class="h-4 w-4" />
        <span class="ml-1"> Pending </span>
      </UBadge>
      <UBadge v-if="actualStatus === 'publish'" color="green" variant="subtle">
        <UIcon name="i-heroicons:check-badge-solid" class="h-4 w-4" />
        <span class="ml-1"> Published </span>
      </UBadge>
      <UBadge v-if="actualStatus === 'reject'" color="red" variant="subtle">
        <UIcon name="i-heroicons:x-mark-solid" class="h-4 w-4" />
        <span class="ml-1"> Rejected </span>
      </UBadge>
    </UTooltip>
  </div>
</template>
