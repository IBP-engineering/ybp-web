<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError & { url: string },
})

console.error(props.error)

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="relative h-full w-full overflow-hidden bg-background">
    <SharedParticlesBg
      class="absolute inset-0 z-[5]"
      :quantity="100"
      :staticity="20"
    />

    <div class="relative z-10 flex h-full flex-col items-center justify-center">
      <Shared3dText
        class="text-8xl font-bold max-md:text-7xl"
        shadow-color="red"
      >
        {{ error.statusCode }}
      </Shared3dText>
      <Shared3dText
        class="text-4xl font-black max-md:text-5xl"
        shadow-color="skyblue"
        :animate="false"
      >
        Uh oh.
      </Shared3dText>
      <p class="mt-4">{{ error.message }}</p>

      <UButton color="black" class="mt-8" size="sm" @click="handleError"
        >Go back home</UButton
      >
    </div>
  </div>
</template>
