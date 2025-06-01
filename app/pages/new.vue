<script setup lang="ts">
import type { Database } from '~/types/database.types'
import type { Tag } from '~/types/entities'

defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})

useSeoMeta({
  title: 'Tambah cerita baru',
  description:
    'Halaman untuk para anggota supaya bisa menambahkan cerita terbaru mereka',
})

const toast = useToast()
const supabase = useSupabaseClient<Database>()
const channel = supabase.channel('notifications')
const { data: tags } = await useAsyncData('tags', async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, title, slug, description')
    .eq('is_active', true)

  if (error) {
    console.error(error)
    return []
  }

  return data
})
const fileInput = useTemplateRef('coverImage')

const form = reactive<{
  title: string
  coverImage: File
  selectedTags: Partial<Tag>[]
}>({
  title: 'Tanpa judul',
  selectedTags: [],
  coverImage: null,
})
const createdSlug = ref('')
const { data: user } = await useFetch('/api/session/current-user', {
  key: 'current-user',
})
const previewImageUrl = ref<string | ArrayBuffer>('')
const content = ref('<p>Pada suatu masa...</p>')
const showTags = ref(false)
const isLoading = ref(false)
const modalAlert = reactive({ title: '', message: '', isSuccess: false })
const openModal = ref(false)
const tagsOrigin = ref<(Partial<Tag> & { alreadySelect: boolean })[]>(
  tags.value.map(tag => ({ ...tag, alreadySelect: false })),
)

const selectTag = (tag: Partial<Tag>) => {
  const existingTag = form.selectedTags.some(sel => sel.id === tag.id)
  if (existingTag || form.selectedTags.length >= 4) {
    return
  }

  form.selectedTags.push(tag)

  const modifyTags = tagsOrigin.value.map(tg => {
    if (tg.id === tag.id) {
      return { ...tg, alreadySelect: true }
    }
    return tg
  })

  if (form.selectedTags.length >= 4) {
    showTags.value = false
  }

  tagsOrigin.value = modifyTags
}

const removeTag = (tag: Partial<Tag>) => {
  const existingTag = form.selectedTags.some(sel => sel.id === tag.id)
  if (!existingTag) {
    return
  }

  const modifySelectedTags = form.selectedTags.filter(tg => tg.id !== tag.id)
  form.selectedTags = modifySelectedTags

  const modifyTags = tagsOrigin.value.map(tg => {
    if (tg.id === tag.id) {
      return { ...tg, alreadySelect: false }
    }
    return tg
  })

  if (form.selectedTags.length < 4) {
    showTags.value = true
  }

  tagsOrigin.value = modifyTags
}

const submitStory = async () => {
  isLoading.value = true
  try {
    const slug = toSlug(form.title)
    let coverPath = ''
    if (form.coverImage?.size) {
      const fileExtension = form.coverImage.name.split('.').pop()
      const fileName = slug.concat('.', fileExtension)
      console.log('filename', fileName)
      const { data } = await supabase.storage
        .from('story-cover')
        .upload(`${user.value.id}/${fileName}`, form.coverImage, {
          upsert: true,
        })
      console.log('image', data)
      coverPath = data?.path
    }

    const { data: createdStory } = await supabase
      .from('stories')
      .insert({
        slug,
        cover_path: coverPath,
        title: form.title,
        content: content.value,
        user_id: user.value?.id,
      })
      .select('id')
      .single()

    const batchStoryWithTags = form.selectedTags.map(tag => ({
      story_id: createdStory.id,
      tag_id: tag.id,
    }))

    // TODO: consider moving into server side/api to proceed.
    await Promise.all([
      supabase.from('story_tags').insert(batchStoryWithTags),
      supabase.from('story_status_histories').insert({
        story_id: createdStory.id,
        status: 'pending',
        reason: 'Adding new story',
        updated_by: user.value?.id,
      }),
    ])
    $fetch('/api/notifications/stories/mod', {
      method: 'post',
      body: {
        senderId: user.value?.id,
        contextData: {},
        relatedId: createdStory.id,
        mode: 'create',
      },
    })

    channel.send({
      type: 'broadcast',
      event: 'notifications-x-mod',
      payload: { sender: user.value.display_name },
    })

    openModal.value = true
    modalAlert.isSuccess = true
    modalAlert.title = 'Berhasil'
    modalAlert.message = `Terima kasihh! Cerita kamu dengan judul "${form.title}" akan segera kami proses, ya!`

    form.title = 'Tanpa judul'
    form.selectedTags = []
    showTags.value = false
    tagsOrigin.value = tagsOrigin.value.map(tag => ({
      ...tag,
      alreadySelect: false,
    }))
    createdSlug.value = slug
    isLoading.value = false
  } catch (error) {
    openModal.value = true
    modalAlert.title = 'Gagal'
    modalAlert.message =
      'Maydayy! Telah terjadi kesalahan. Mohon coba kembali setelah beberap saat'
    modalAlert.isSuccess = false
    createdSlug.value = ''

    isLoading.value = false
    console.error(error)
    return
  }
}

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'New story',
  },
]

const previewImage = (event: Event & { target: { files: File[] } }) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }

  const maxSizeInBytes = 5 * 1024 * 1024 // 5 MB in bytes
  // max 5 mb
  if (file.size >= maxSizeInBytes) {
    form.coverImage = null
    previewImageUrl.value = ''
    toast.add({
      title: 'Gagal menambahkan cover',
      description: 'Maksimal ukuran gambar yang diunggah adalah 5mb',
      color: 'error',
    })
    return
  }

  try {
    const reader = new FileReader()
    reader.onload = e => {
      previewImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
    form.coverImage = file
  } catch (error) {
    console.error(error)
  }
}

const showFileUploader = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const removeImageCover = () => {
  previewImageUrl.value = ''
  form.coverImage = null
}
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <div class="mx-auto max-w-screen-lg">
      <UBreadcrumb divider="/" :items="breadcrumbs" />
      <div class="mt-12 mb-4 flex flex-col gap-2 md:flex-row">
        <img
          v-if="previewImageUrl"
          :src="previewImageUrl.toString()"
          alt="Story cover"
          width="500"
          height="300"
        />
        <div class="flex items-start gap-4">
          <UButton
            variant="outline"
            icon="i-ph:image-square"
            @click="showFileUploader"
          >
            {{ Boolean(previewImageUrl) ? 'Ubah' : 'Unggah sampul' }}
          </UButton>
          <UButton
            v-if="Boolean(previewImageUrl)"
            variant="soft"
            color="error"
            @click="removeImageCover"
            >Hapus
          </UButton>
        </div>
      </div>
      <input
        ref="coverImage"
        type="file"
        class="hidden"
        accept=".png, .jpg, .jpeg"
        @change="previewImage"
      />
      <UInput
        v-model="form.title"
        placeholder="Judulnyaaa"
        variant="none"
        color="neutral"
        size="xl"
        required
        :ui="{ base: 'mb-2 w-full font-bold text-4xl' }"
        @focus="showTags = false"
      />
      <div class="mb-4 flex w-full items-center gap-2">
        <UButton
          v-for="tag in form.selectedTags"
          :key="tag.id"
          variant="ghost"
          @click="() => removeTag(tag)"
          >#{{ tag.slug }}</UButton
        >
        <UButton
          label="Label"
          icon="i-heroicons:plus-circle"
          variant="outline"
          color="neutral"
          @click="showTags = !showTags"
        />
      </div>
      <div
        v-if="showTags"
        class="-mt-2 mb-2 h-48 overflow-auto rounded-lg border bg-neutral-50 p-4"
      >
        <div class="border-b">
          <b>Daftar label</b>
          <small class="mb-1 block text-neutral-600"
            >Maksimal memilih 4 label</small
          >
        </div>
        <div v-for="tag in tagsOrigin" :key="tag.id">
          <button
            v-if="!tag.alreadySelect"
            class="flex w-full flex-col items-start p-2 text-start transition hover:bg-neutral-100"
            @click="() => selectTag(tag)"
          >
            <p>#{{ tag.slug }}</p>
            <small class="text-neutral-600">{{ tag.description }}</small>
          </button>
        </div>
      </div>
      <LazySharedEditor v-model:editor="content" />
      <div class="mt-4 flex items-center justify-end gap-4">
        <UButton
          :loading="isLoading"
          icon="i-heroicons:chevron-left"
          variant="ghost"
          to="/dashboard"
          >Kembali</UButton
        >
        <UButton :loading="isLoading" @click="submitStory">Simpan</UButton>
      </div>
    </div>

    <LazyUModal v-model:open="openModal" :title="modalAlert.title">
      <template #body>
        <p v-if="modalAlert.isSuccess" class="mt-2 block text-neutral-500">
          Untuk informasi lebih lanjut mengenai proses penerbitan Cerita kamu,
          bisa melalui halaman
          <NuxtLink class="text-blue-500 hover:underline" to="#">FAQ</NuxtLink>.
        </p>
      </template>

      <template #footer>
        <div class="flex w-full items-center justify-end gap-4">
          <UButton variant="ghost" @click="() => reloadNuxtApp()"
            >Tutup</UButton
          >
          <UButton
            icon="i-heroicons:chevron-right"
            :to="`/${user?.username}/${createdSlug}`"
            >Ke cerita</UButton
          >
        </div>
      </template>
    </LazyUModal>
  </div>
</template>
