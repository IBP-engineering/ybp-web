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
        <div class="group relative w-full">
          <p
            class="mb-2 block w-full border bg-slate-100 p-1 text-center font-mono transition group-hover:text-gray-500"
          >
            {{ url.href }}
          </p>
          <UButton
            :trailing-icon="
              copied
                ? 'heroicons:clipboard-document-check'
                : 'heroicons:clipboard-document'
            "
            color="gray"
            size="sm"
            class="absolute right-1 top-1 hidden group-hover:flex"
            @click="() => copy(url.href)"
          >
            <span v-if="copied"> Tersalin! </span>
          </UButton>
        </div>
        <UButton
          v-if="isSupported"
          color="gray"
          class="flex lg:hidden"
          @click="share"
          block
          trailing-icon="heroicons:arrow-up-right-20-solid"
          >Bagikan</UButton
        >
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
