<script setup lang="ts">
const content = ref('<p>Pada suatu masa...</p>')
const title = ref('Tanpa judul')
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <p>new page</p>
    <div class="mx-auto mt-12 max-w-screen-lg">
      <UInput
        placeholder="Judulnyaaa"
        variant="none"
        color="gray"
        input-class="mb-2 text-4xl"
        v-model="title"
        required
      />
      <Editor v-model:editor="content" />
      <div class="mt-4 flex items-center justify-end gap-4">
        <UButton icon="i-heroicons:chevron-left" variant="ghost"
          >Kembali</UButton
        >
        <UButton>Simpan</UButton>
      </div>
    </div>
  </div>
</template>
