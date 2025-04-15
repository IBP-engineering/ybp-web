<script setup lang="ts">
import type { Database } from '~/types/database.types'
import type { Tag } from '~/types/entities'

defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})

const toast = useToast()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const route = useRoute()
const slug = route.params.slug
const { data: currentStory } = await useAsyncData(`story/${slug}`, async () => {
  const { data, error } = await supabase
    .from('stories')
    .select('*, tags:story_tags!id(tag:tag_id(*), id),author:users(username)')
    .eq('slug', slug.toString())
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
})

if (currentStory?.value.user_id !== user?.value.id) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: tags } = await useAsyncData('tags', async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, title, slug, description')
    .eq('is_active', true)

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
  title: currentStory?.value.title,
  selectedTags: [],
  coverImage: null,
})
const previewImageUrl = ref<string | ArrayBuffer>('')
const content = ref(currentStory.value.content)
const showTags = ref(false)
const isLoading = ref(false)
const modalAlert = reactive({ title: '', message: '', isSuccess: false })
const openModal = ref(false)
const isDeletingCover = ref(false)
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
    if (!user.value) {
      alert('Tolong login dulu yaa')
      return
    }

    let coverPath = currentStory.value.cover_path
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

    if (isDeletingCover.value) {
      await supabase.storage.from('story-cover').remove([coverPath])
      coverPath = null
    }

    await supabase
      .from('stories')
      .update({
        cover_path: coverPath,
        title: form.title,
        content: content.value,
        status: 'pending',
      })
      .eq('id', currentStory.value.id)

    const batchStoryWithTags = form.selectedTags.map(tag => ({
      story_id: currentStory.value.id,
      tag_id: tag.id,
    }))
    const batchTagsToDelete = currentStory.value.tags.map(t => t.id)

    await Promise.all([
      supabase.from('story_tags').delete().in('id', batchTagsToDelete),
      supabase.from('story_tags').insert(batchStoryWithTags),
      supabase.from('story_status_histories').insert({
        story_id: currentStory.value.id,
        status: 'pending',
        reason: 'Updating story',
        updated_by: user.value?.id,
      }),
    ])

    openModal.value = true
    modalAlert.isSuccess = true
    modalAlert.title = 'Berhasil'
    modalAlert.message = 'Terima kasihh! Cerita kamu sudah berhasil diupdate!'

    showTags.value = false
    tagsOrigin.value = tagsOrigin.value.map(tag => ({
      ...tag,
      alreadySelect: false,
    }))
    isLoading.value = false
  } catch (error) {
    openModal.value = true
    modalAlert.title = 'Gagal'
    modalAlert.message =
      'Maydayy! Telah terjadi kesalahan. Mohon coba kembali setelah beberap saat'
    modalAlert.isSuccess = false

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
    isDeletingCover.value = false
  } catch (error) {
    console.error(error)
  }
}

const showFileUploader = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: currentStory.value?.author?.username ?? '',
    to: `/${currentStory.value?.author?.username}`,
  },
  {
    label: currentStory.value?.slug ?? '',
    to: `/${currentStory.value?.author?.username}/${currentStory.value?.slug}`,
  },
  {
    label: 'Edit',
  },
]

const removeImageCover = () => {
  previewImageUrl.value = ''
  form.coverImage = null
  isDeletingCover.value = true
}

useSeoMeta({
  title: `Sedang mengubah cerita ${currentStory.value.title}`,
  description: `Mengubah cerita ${currentStory.value.title}`,
})

onMounted(() => {
  for (const fromTag of currentStory.value.tags) {
    selectTag(fromTag.tag as unknown as Tag)
  }

  if (currentStory.value.cover_path) {
    previewImageUrl.value = supabase.storage
      .from('story-cover')
      .getPublicUrl(currentStory.value.cover_path).data.publicUrl
  }
})
</script>

<template>
  <div class="container mx-auto max-w-screen-lg px-4 md:px-0">
    <UBreadcrumb divider="/" :items="breadcrumbs" />
    <div class="mx-auto mt-12">
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
        required
        size="xl"
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
          <UButton variant="ghost" color="neutral" @click="openModal = false"
            >Tutup</UButton
          >
          <UButton to="/dashboard">Dashboard</UButton>
        </div>
      </template>
    </LazyUModal>
  </div>
</template>
