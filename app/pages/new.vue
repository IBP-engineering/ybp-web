<script setup lang="ts">
const content = ref('<p>Pada suatu masa...</p>')
const title = ref('Tanpa judul')
const showTags = ref(false)
const tagsOrigin = ref([
  {
    id: 1,
    label: 'curhat',
    desc: 'hehehehehehe',
    alreadySelect: false,
  },
  {
    id: 2,
    label: 'tiduran',
    desc: 'hehehehehehe',
    alreadySelect: false,
  },
  {
    id: 3,
    label: 'bilamana',
    desc: 'hehehehehehe',
    alreadySelect: false,
  },
  {
    id: 4,
    label: 'herewego',
    desc: 'hehehehehehe',
    alreadySelect: false,
  },
  {
    id: 5,
    label: 'nanas',
    desc: 'hehehehehehe',
    alreadySelect: false,
  },
])
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
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <p>new page</p>
    <div class="mx-auto mt-12 max-w-screen-lg">
      <UInput
        placeholder="Judulnyaaa"
        variant="none"
        color="gray"
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
          >#{{ tag.label }}</UButton
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
        <div v-for="tag in tagsOrigin" :key="tag.label">
          <button
            v-if="!tag.alreadySelect"
            @click="() => selectTag(tag)"
            class="flex w-full flex-col items-start p-2 transition hover:bg-gray-100"
          >
            <p>#{{ tag.label }}</p>
            <small class="text-gray-600">{{ tag.desc }}</small>
          </button>
        </div>
      </div>
      <LazyEditor v-model:editor="content" />
      <div class="mt-4 flex items-center justify-end gap-4">
        <UButton icon="i-heroicons:chevron-left" variant="ghost"
          >Kembali</UButton
        >
        <UButton>Simpan</UButton>
      </div>
    </div>
  </div>
</template>
