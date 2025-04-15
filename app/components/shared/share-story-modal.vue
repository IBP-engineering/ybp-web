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
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard
        :ui="{
          body: 'divide-y divide-neutral-100 dark:divide-neutral-800',
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
              class="mb-2 block w-full border bg-slate-100 p-1 text-center font-mono break-words transition group-hover:text-neutral-500"
            >
              {{ url.href }}
            </p>
            <UButton
              :trailing-icon="
                copied
                  ? 'heroicons:clipboard-document-check'
                  : 'heroicons:clipboard-document'
              "
              color="neutral"
              size="sm"
              class="absolute top-1 right-1 hidden group-hover:flex"
              @click="() => copy(url.href)"
            >
              <span v-if="copied"> Tersalin! </span>
            </UButton>
          </div>
          <UButton
            v-if="isSupported"
            color="neutral"
            class="flex lg:hidden"
            block
            trailing-icon="heroicons:arrow-up-right-20-solid"
            @click="share()"
            >Bagikan</UButton
          >
        </div>

        <template #footer>
          <div class="flex w-full justify-end">
            <UButton variant="soft" color="neutral" @click="isOpen = false"
              >Tutup</UButton
            >
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
