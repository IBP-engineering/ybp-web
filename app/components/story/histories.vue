<script setup lang="ts">
import { format } from 'date-fns'
import id from 'date-fns/locale/id'
import type { StoryStatusHistory } from '~/types/entities'

defineProps<{
  storyHistories: (Partial<Omit<StoryStatusHistory, 'updated_by'>> & {
    updated_by: { display_name: string }
  })[]
}>()

const historyColor = {
  approved: 'border-green-300 bg-green-100 text-green-900',
  rejected: 'border-red-300 bg-red-100 text-red-900',
  pending: 'border-blue-300 bg-blue-100 text-blue-900',
}
</script>

<template>
  <div class="max-h-[350px] overflow-auto pr-2">
    <div
      v-if="storyHistories.length > 0"
      class="space-y-0 overflow-hidden rounded"
    >
      <div
        v-for="history in storyHistories"
        :key="history.id"
        class="border-t border-l px-2 py-1"
        :class="historyColor[history.status]"
      >
        <StoryBadgeStatus :status="history.status" />
        <p v-if="history.reason">Alasan: {{ history.reason }}</p>
        <small class="block"
          >Diupdate oleh: {{ history.updated_by.display_name }}</small
        >
        <small class="block">
          {{
            format(new Date(history.created_at), 'dd MMM yyyy, HH:mm', {
              locale: id,
            })
          }}
        </small>
      </div>
    </div>
    <p v-else class="flex items-center gap-2 text-neutral-600">
      <UIcon name="heroicons:archive-box-x-mark" class="h-10 w-10" /> History
      cerita tidak ditemukan
    </p>
  </div>
</template>
