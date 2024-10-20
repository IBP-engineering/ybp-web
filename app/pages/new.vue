<script setup lang="ts">
import type { Database } from '~/types/database.types'
import type { Tag, User } from '~/types/entities'

definePageMeta({
  middleware: 'need-auth',
})

useHead({
  title: 'New story',
})

const toast = useToast()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { data: tags } = await useAsyncData('tags', async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, title, slug, description')

  if (error) {
    console.error(error)
    return null
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
const { data: currentUser } = useNuxtData<User>('current-user')
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
    await Promise.all([
      supabase.from('story_tags').insert(batchStoryWithTags),
      supabase.from('story_status_histories').insert({
        story_id: createdStory.id,
        status: 'pending',
        reason: 'Adding new story',
        updated_by: user.value?.id,
      }),
    ])

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

const previewImage = (event: any) => {
  const file = event.target.files[0] as File
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
      color: 'red',
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
  <div class="mx-auto w-full max-w-screen-xl px-4 md:px-0">
    <div class="mx-auto mt-12 max-w-screen-lg">
      <div class="mb-4 flex flex-col gap-2 md:flex-row">
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
            @click="showFileUploader"
            icon="i-ph:image-square"
          >
            {{ Boolean(previewImageUrl) ? 'Ubah' : 'Unggah sampul' }}
          </UButton>
          <UButton
            v-if="Boolean(previewImageUrl)"
            @click="removeImageCover"
            variant="soft"
            color="red"
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
        placeholder="Judulnyaaa"
        variant="none"
        color="gray"
        padded
        input-class="mb-2 font-bold text-4xl"
        v-model="form.title"
        @focus="showTags = false"
        required
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
          color="gray"
          @click="showTags = !showTags"
        />
      </div>
      <div
        v-if="showTags"
        class="-mt-2 mb-2 h-48 overflow-auto rounded-lg border bg-gray-50 p-4"
      >
        <div class="border-b">
          <b>Daftar label</b>
          <small class="mb-1 block text-gray-600"
            >Maksimal memilih 4 label</small
          >
        </div>
        <div v-for="tag in tagsOrigin" :key="tag.id">
          <button
            v-if="!tag.alreadySelect"
            @click="() => selectTag(tag)"
            class="flex w-full flex-col items-start p-2 text-start transition hover:bg-gray-100"
          >
            <p>#{{ tag.slug }}</p>
            <small class="text-gray-600">{{ tag.description }}</small>
          </button>
        </div>
      </div>
      <LazyEditor v-model:editor="content" />
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

    <LazyUModal v-model="openModal">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <b>{{ modalAlert.title }}</b>
        </template>

        <p>{{ modalAlert.message }}</p>
        <p v-if="modalAlert.isSuccess" class="mt-2 block text-gray-500">
          Untuk informasi lebih lanjut mengenai proses penerbitan Cerita kamu,
          bisa melalui halaman
          <NuxtLink class="text-blue-500 hover:underline" to="#">FAQ</NuxtLink>.
        </p>

        <template #footer>
          <div class="flex items-center justify-end gap-4">
            <UButton variant="ghost" @click="() => reloadNuxtApp()"
              >Tutup</UButton
            >
            <UButton
              icon="i-heroicons:chevron-right"
              :to="`/${currentUser.username}/${createdSlug}`"
              >Ke cerita</UButton
            >
          </div>
        </template>
      </UCard>
    </LazyUModal>
  </div>
</template>
