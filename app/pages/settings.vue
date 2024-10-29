<script setup lang="ts">
import * as v from 'valibot'

useHead({
  title: 'Settings',
})

const schema = v.object({
  displayName: v.string(),
  username: v.string(),
  email: v.pipe(v.string(), v.email('Invalid email')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Schema>({
  displayName: '',
  email: '',
  username: '',
})

function onSubmit() {
  console.log('haloha', state)
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 md:px-0">
    <h1 class="text-3xl font-bold leading-relaxed md:text-4xl">@kalwabed</h1>

    <div class="mt-8 grid md:grid-cols-2">
      <div
        class="rounded border border-neutral-300 bg-neutral-50 px-8 py-6 shadow"
      >
        <h2 class="mb-4 text-xl font-bold md:text-2xl">User</h2>
        <UForm :schema="v.safeParser(schema)" :state="state" class="space-y-4">
          <UFormGroup label="Name" name="name">
            <UInput v-model="state.displayName" />
          </UFormGroup>
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Username" name="username">
            <UInput v-model="state.username" />
          </UFormGroup>
        </UForm>
      </div>
    </div>

    <UButton class="mt-8" size="lg" @click="onSubmit">Simpan perubahan</UButton>
  </div>
</template>
