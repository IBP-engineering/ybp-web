<script setup lang="ts">
const supabase = useSupabaseClient()
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

const content = ref('<p>Pada suatu masa...</p>')
const title = ref('Tanpa judul')
const showTags = ref(false)
const isLoading = ref(false)
const modalAlert = reactive({ title: '', message: '', isSuccess: false })
const openModal = ref(false)
const tagsOrigin = ref(
  tags.value.map(tag => ({ ...tag, alreadySelect: false })),
)
const selectedTags = ref([])

const selectTag = tag => {
  const existingTag = selectedTags.value.some(sel => sel.id === tag.id)
  if (existingTag || selectedTags.value.length >= 4) {
    return
  }

  selectedTags.value.push(tag)

  const modifyTags = tagsOrigin.value.map(tg => {
    if (tg.id === tag.id) {
      return { ...tg, alreadySelect: true }
    }
    return tg
  })

  if (selectedTags.value.length >= 4) {
    showTags.value = false
  }

  tagsOrigin.value = modifyTags
}

const removeTag = tag => {
  const existingTag = selectedTags.value.some(sel => sel.id === tag.id)
  if (!existingTag) {
    return
  }

  const modifySelectedTags = selectedTags.value.filter(tg => tg.id !== tag.id)
  selectedTags.value = modifySelectedTags

  const modifyTags = tagsOrigin.value.map(tg => {
    if (tg.id === tag.id) {
      return { ...tg, alreadySelect: false }
    }
    return tg
  })

  if (selectedTags.value.length < 4) {
    showTags.value = true
  }

  tagsOrigin.value = modifyTags
}

const submitStory = async () => {
  isLoading.value = true
  try {
    const slug = toSlug(title.value)
    const { data: createdStory } = await supabase
      .from('stories')
      // @ts-ignore
      .insert({
        slug,
        title: title.value,
        content: content.value,
        user_id: user.value?.id,
      })
      .select('id')
      .single()

    const batchStoryWithTags = selectedTags.value.map(tag => ({
      story_id: createdStory.id,
      tag_id: tag.id,
    }))
    await Promise.all([
      // @ts-ignore
      supabase.from('story_tags').insert(batchStoryWithTags),
      // @ts-ignore
      supabase.from('story_statuses').insert({ story_id: createdStory.id }),
    ])

    openModal.value = true
    modalAlert.isSuccess = true
    modalAlert.title = 'Berhasil'
    modalAlert.message = `Terima kasihh! Cerita kamu dengan judul "${title.value}" akan segera kami proses, ya!`

    title.value = 'Tanpa judul'
    console.log(content.value)
    selectedTags.value = []
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
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <p>new page. login as:{{ user?.id ?? 'none' }}</p>
    <div class="mx-auto mt-12 max-w-screen-lg">
      <UInput
        placeholder="Judulnyaaa"
        variant="none"
        color="gray"
        padded
        input-class="mb-2 font-bold text-4xl"
        v-model="title"
        @focus="showTags = false"
        required
      />
      <div class="mb-4 flex w-full items-center gap-2">
        <UButton
          v-for="tag in selectedTags"
          :key="tag.label"
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
            class="flex w-full flex-col items-start p-2 transition hover:bg-gray-100"
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
          <NuxtLink class="text-blue-500 hover:underline" to="/faq"
            >FAQ</NuxtLink
          >.
        </p>

        <template #footer>
          <div class="flex items-center justify-end gap-4">
            <UButton variant="ghost" @click="() => reloadNuxtApp()"
              >Tutup</UButton
            >
            <UButton
              icon="i-heroicons:chevron-right"
              @click="() => navigateTo('/new')"
              >Ke cerita</UButton
            >
          </div>
        </template>
      </UCard>
    </LazyUModal>
  </div>
</template>
