<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import { format } from '@formkit/tempo'

definePageMeta({
  layout: 'hq',
  middleware: 'need-auth',
})

useHead({
  title: 'Tags',
})

const schema = v.object({
  title: v.string(),
  description: v.string(),
  isActive: v.boolean(),
})

type Schema = v.InferOutput<typeof schema>

const isOpenDetail = ref(false)
const state = reactive<Schema>({
  title: '',
  description: '',
  isActive: true,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}

const openTagDetail = () => {
  isOpenDetail.value = true
}
</script>

<template>
  <div>
    <PageHeader title="Tags" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: 10</p>

      <div class="mt-8 grid grid-cols-4 gap-4">
        <button
          @click="openTagDetail"
          class="rounded border border-zinc-300 bg-zinc-50 p-2 text-left shadow transition hover:border-zinc-400 hover:bg-zinc-100"
        >
          <b>#title</b>
          <p
            class="overflow-hidden text-ellipsis whitespace-nowrap text-zinc-600"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus, minima!
          </p>
        </button>
      </div>
    </div>

    <USlideover v-model="isOpenDetail">
      <UCard
        class="flex flex-1 flex-col"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Edit tag #opini
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpenDetail = false"
            />
          </div>
        </template>

        <UForm
          :schema="v.safeParser(schema)"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup
            required
            label="Judul"
            description="Akan otomatis mengubah slug"
            name="title"
          >
            <UInput v-model="state.title" icon="heroicons:hashtag-20-solid" />
          </UFormGroup>

          <UFormGroup label="Deskripsi" required name="description">
            <UTextarea v-model="state.description" />
          </UFormGroup>

          <UFormGroup label="Aktif" required name="isActive">
            <UToggle v-model="state.isActive" />
          </UFormGroup>

          <div class="text-sm text-gray-600">
            <p>Dibuat oleh: Kami</p>
            <p>
              {{
                format(
                  new Date(),
                  {
                    date: 'full',
                    time: 'short',
                  },
                  'id',
                )
              }}
            </p>
          </div>

          <div class="flex justify-end gap-4">
            <UButton
              @click="isOpenDetail = false"
              variant="outline"
              color="gray"
              >Batal</UButton
            >
            <UButton type="submit">Update</UButton>
          </div>
        </UForm>
      </UCard>
    </USlideover>
  </div>
</template>
