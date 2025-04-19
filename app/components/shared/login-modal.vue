<script setup lang="ts">
const open = defineModel<boolean>('open')
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <div class="py-8">
        <div class="mb-2 flex justify-end pr-8">
          <UButton
            @click="open = false"
            icon="heroicons:x-mark"
            variant="ghost"
            color="neutral"
          />
        </div>
        <div class="mx-auto flex w-full flex-col px-6 md:px-0">
          <div>
            <img
              src="~/assets/images/logo.jpg"
              decoding="async"
              loading="lazy"
              width="150"
              height="150"
              class="z-20 mx-auto rounded-full border"
              alt="YBP logo"
            />
          </div>
          <div class="z-20 mx-auto mt-6 w-full md:w-[24rem]">
            <b class="mb-4 block">Masuk untuk melanjutkan</b>

            <SharedLoginForm :redirect="false" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
