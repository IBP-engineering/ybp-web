<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import { format } from 'date-fns'
import id from 'date-fns/locale/id'

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
  slug: v.string(),
})

type Schema = v.InferOutput<typeof schema>

const toast = useToast()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const isOpenDetail = ref(false)
const selectedTagId = ref(null)
const isLoading = ref(false)
const state = reactive<Schema>({
  title: '',
  description: '',
  isActive: true,
  slug: '',
})

const { data: tags, refresh } = await useAsyncData('hq/tags', async () => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .order('created_at', { ascending: true })

  return data ?? []
})

const { data: tag, status: tagDetailStatus } = await useLazyAsyncData(
  'hq/tags/detail',
  async () => {
    if (selectedTagId.value) {
      const { data } = await supabase
        .from('tags')
        .select('*, createdBy:users(username, display_name)')
        .eq('id', selectedTagId.value)
        .single()

      state.title = data.title
      state.description = data.description
      state.isActive = data.is_active
      state.slug = data.slug

      return {
        ...data,
        createdBy: data.createdBy as unknown as {
          username: string
          display_name: string
        },
      }
    }

    return null
  },
  { watch: [selectedTagId], immediate: false },
)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data
  const isUpdating = Boolean(selectedTagId.value)

  try {
    isLoading.value = true
    if (isUpdating) {
      await supabase
        .from('tags')
        .update({
          title: data.title,
          description: data.description,
          is_active: data.isActive,
          slug: toSlug(data.slug, false),
        })
        .eq('id', selectedTagId.value)
      toast.add({
        title: 'Berhasil mengubah tag',
        color: 'green',
      })
    } else {
      await supabase.from('tags').insert({
        title: data.title,
        description: data.description,
        is_active: data.isActive,
        slug: toSlug(data.slug, false),
        created_by: user.value.id,
      })
      toast.add({
        title: 'Berhasil menambahkan tag',
        color: 'green',
      })
    }

    closeTagDetail()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    refresh()
  }
}

const openTagDetail = (id?: string) => {
  if (id) {
    selectedTagId.value = id
  }
  isOpenDetail.value = true
}

const closeTagDetail = () => {
  selectedTagId.value = null
  isOpenDetail.value = false
  state.title = ''
  state.description = ''
  state.isActive = true
  state.slug = ''
}
</script>

<template>
  <div>
    <PageHeader title="Tags" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <div class="flex items-center justify-between">
        <UButton
          trailing-icon="heroicons:plus-20-solid"
          @click="() => openTagDetail()"
          >Tambah</UButton
        >
        <small>Total: {{ tags.length ?? 0 }}</small>
      </div>

      <div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <button
          v-for="tag in tags"
          :key="tag.id"
          class="rounded border border-zinc-300 bg-zinc-50 p-2 text-left shadow transition hover:border-zinc-400 hover:bg-zinc-100"
          @click="() => openTagDetail(tag.id)"
        >
          <UBadge
            v-if="!tag.is_active"
            class="mr-1"
            color="red"
            variant="soft"
            label="Tidak aktif"
          />
          <b>#{{ tag.slug }}</b>
          <p
            class="overflow-hidden text-ellipsis whitespace-nowrap text-zinc-600"
          >
            {{ tag.description }}
          </p>
        </button>
      </div>
    </div>

    <USlideover v-model="isOpenDetail" @close="closeTagDetail">
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
              <template v-if="selectedTagId">
                Edit tag #{{ tag?.slug }}
              </template>
              <template v-else>Tambah tag baru</template>
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="closeTagDetail"
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
            <UInput
              v-model="state.title"
              :loading="tagDetailStatus === 'pending'"
              @input="e => (state.slug = e.target.value)"
            />
          </UFormGroup>

          <div>
            <b class="block text-sm text-gray-700">Slug</b>
            <p>#{{ toSlug(state.slug, false) }}</p>
          </div>

          <UFormGroup label="Deskripsi" required name="description">
            <UTextarea
              v-model="state.description"
              :loading="tagDetailStatus === 'pending'"
            />
          </UFormGroup>

          <UFormGroup label="Aktif" required name="isActive">
            <UToggle
              v-model="state.isActive"
              :loading="tagDetailStatus === 'pending'"
            />
          </UFormGroup>

          <div v-if="tag" class="text-sm text-gray-600">
            <p>
              Dibuat oleh: {{ tag.createdBy.display_name }}(@{{
                tag.createdBy.username
              }})
            </p>
            <p>
              {{
                format(new Date(tag?.created_at.toString()), 'PPPppp', {
                  locale: id,
                })
              }}
            </p>
          </div>

          <div class="flex justify-end gap-4">
            <UButton variant="outline" color="gray" @click="closeTagDetail"
              >Batal</UButton
            >
            <UButton
              :loading="isLoading || tagDetailStatus === 'pending'"
              type="submit"
            >
              {{ Boolean(selectedTagId) ? 'Update' : 'Tambah' }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </USlideover>
  </div>
</template>
