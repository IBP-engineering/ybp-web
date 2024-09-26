<script setup lang="ts">
const content = ref('<h1>Jika saya pergi sendiri</h1>')
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <p>new page</p>
    <div class="mt-12">
      <Editor v-model:editor="content" />
    </div>

    <code>{{ content }}</code>
  </div>
</template>
