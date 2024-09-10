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
  await navigateTo('/')
}
</script>

<template>
  <div class="relative flex justify-center w-full h-full">
    <div
      class="flex flex-col mx-auto mt-[10rem] w-full px-6 md:px-0 md:mt-[15rem]"
    >
      <div>
        <img
          src="https://picsum.photos/200/200"
          decoding="async"
          loading="lazy"
          width="200"
          height="200"
          class="mx-auto z-20"
          alt="YBP logo"
        />
      </div>
      <div
        class="w-full md:w-[24rem] shadow p-4 space-y-4 bg-white rounded border mx-auto mt-6 z-20"
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

        <small class="text-center mx-auto block italic text-gray-500 w-full">
          {{ appConfig.appVersion }}
        </small>
      </div>
    </div>
  </div>
</template>
