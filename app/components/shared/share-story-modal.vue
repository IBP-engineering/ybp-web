<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

const props = defineProps<{
  title: string
  author: string
}>()
const isOpen = defineModel<boolean>('open')

const url = useRequestURL()
const { copy, copied } = useClipboard()
const qrCode = useQRCode(url.href)
const { share, isSupported } = useShare({
  url: url.href,
  title: props.title,
  text: url.href,
})
</script>

<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <div class="w-full p-4">
        <div class="text-center">
          <b class="block text-2xl">{{ title }}</b>
          <p>
            oleh
            <span class="border-primary-400 text-primary-900 border-b-4">
              {{ author }}
            </span>
          </p>
        </div>
        <img :src="qrCode" class="mx-auto h-64 w-64" />
        <p
          class="mb-2 block w-full border bg-slate-100 p-1 text-center font-mono"
        >
          {{ url.href }}
        </p>
        <div class="flex items-center justify-end gap-4">
          <UButton
            variant="soft"
            :trailing-icon="
              copied
                ? 'heroicons:clipboard-document-check'
                : 'heroicons:clipboard-document'
            "
            color="gray"
            @click="() => copy(url.href)"
          />
          <UButton
            v-if="isSupported"
            color="gray"
            @click="share"
            trailing-icon="heroicons:arrow-up-right-20-solid"
            >Bagikan</UButton
          >
        </div>
      </div>

      <template #footer>
        <div class="flex w-full justify-end">
          <UButton variant="soft" color="gray" @click="isOpen = false"
            >Tutup</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
