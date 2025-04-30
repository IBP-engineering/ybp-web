<script setup lang="ts">
import type { User } from '~/types/entities'

defineProps<{
  author: Partial<User>
}>()
</script>

<template>
  <aside class="hidden lg:block lg:max-w-[370px] h-full w-full">
    <StoryAsideProfile :author="author" />
  </aside>
</template>
