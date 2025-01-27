<script setup lang="ts">
const { socials } = useAppConfig()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center">
    <h3 id="contacts" class="text-xl leading-relaxed">
      Mari bergabung dan ikuti kami
    </h3>

    <div class="mt-4 flex w-full flex-wrap justify-center gap-4">
      <NuxtLink
        v-for="social in socials"
        :key="social.link"
        :to="social.link"
        class="flex w-fit items-center gap-2 rounded-lg border p-2 font-medium transition"
        :class="social.theme"
        target="_blank"
        :title="social.title"
        external
        ><UIcon :name="social.logoFill" class="h-8 w-8" />
        <span>{{ social.label }}</span></NuxtLink
      >
    </div>
  </div>
</template>
