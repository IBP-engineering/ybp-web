<script setup lang="ts">
defineProps<{
  title: string
}>()
const isOpen = defineModel<boolean>('open')

const url = useRequestURL()
const { copy, copied } = useClipboard()
</script>

<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <b>{{ title }}</b>
      </template>

      <div class="w-full p-4">
        <p
          class="mb-2 block w-full border bg-slate-100 p-1 text-center font-mono"
        >
          {{ url.href }}
        </p>
        <UButton
          variant="outline"
          trailing-icon="heroicons:clipboard"
          color="sky"
          @click="() => copy(url.href)"
          block
        >
          <span v-if="!copied">Salin link</span>
          <span v-else>Tersalin!</span>
        </UButton>
      </div>

      <template #footer>
        <div class="flex w-full justify-end">
          <UButton variant="soft" color="gray">Tutup</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
