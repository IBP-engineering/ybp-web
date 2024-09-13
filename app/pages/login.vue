<script setup lang="ts">
import {
  nonEmpty,
  object,
  pipe,
  safeParser,
  string,
  type InferInput,
} from 'valibot'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})
useHead({
  title: 'Login',
})

const schema = object({
  username: pipe(string(), nonEmpty('Mohon masukkan username anda.')),
  password: pipe(string(), nonEmpty('Mohon masukkan password anda.')),
})

type Schema = InferInput<typeof schema>

const appConfig = useAppConfig()
const isLoading = ref(false)
const state = reactive({
  username: '',
  password: '',
})

const toast = useToast()

async function login(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  await navigateTo('/hq')
}
</script>

<template>
  <div class="relative flex h-full w-full justify-center">
    <div class="mx-auto mt-[10rem] flex w-full flex-col px-6 md:px-0">
      <div>
        <img
          src="https://picsum.photos/200/200"
          decoding="async"
          loading="lazy"
          width="200"
          height="200"
          class="z-20 mx-auto"
          alt="YBP logo"
        />
      </div>
      <div
        class="z-20 mx-auto mt-6 w-full space-y-4 rounded border bg-white p-4 shadow md:w-[24rem]"
      >
        <b>Sign in to your account</b>

        <UForm
          :schema="safeParser(schema)"
          :state="state"
          @submit="login"
          class="flex w-full flex-col gap-5"
        >
          <UFormGroup label="Username" name="username">
            <UInput v-model="state.username" :loading="isLoading" type="text" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              :loading="isLoading"
              type="password"
            />
          </UFormGroup>

          <UButton block :loading="isLoading" type="submit"> Login </UButton>
        </UForm>

        <small class="mx-auto block w-full text-center italic text-gray-500">
          {{ appConfig.appVersion }}
        </small>
      </div>
    </div>
  </div>
</template>
