<script setup lang="ts">
import {
  nonEmpty,
  object,
  pipe,
  safeParser,
  string,
  email,
  trim,
  forward,
  partialCheck,
  type InferInput,
} from 'valibot'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})
useHead({
  title: 'Buat akun baru',
})

const schema = pipe(
  object({
    fullname: pipe(
      string(),
      trim(),
      nonEmpty('Mohon masukkan nama lengkap anda'),
    ),
    email: pipe(
      string(),
      trim(),
      email('Format email tidak valid'),
      nonEmpty('Mohon masukkan email anda'),
    ),
    username: pipe(string(), trim(), nonEmpty('Mohon masukkan username anda')),
    bio: pipe(
      string(),
      trim(),
      nonEmpty('Mohon masukkan biodata singkat anda'),
    ),
    password: pipe(string(), trim(), nonEmpty('Mohon masukkan password anda')),
    repeatPassword: pipe(
      string(),
      trim(),
      nonEmpty('Mohon masukkan konfirmasi password anda'),
    ),
  }),
  forward(
    partialCheck(
      [['password'], ['repeatPassword']],
      input => input.password === input.repeatPassword,
      'Konfirmasi password tidak sesuai',
    ),
    ['repeatPassword'],
  ),
)

type Schema = InferInput<typeof schema>

const isLoading = ref(false)
const state = reactive<Partial<Schema>>({
  fullname: '',
  username: '',
  password: '',
  bio: '',
  email: '',
  repeatPassword: '',
})

const toast = useToast()

async function register(event: FormSubmitEvent<Schema>) {
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
        <b>Buat akun baru</b>

        <UForm
          :schema="safeParser(schema)"
          :state="state"
          @submit="register"
          class="flex w-full flex-col gap-5"
        >
          <UFormGroup required label="Nama lengkap" name="fullname">
            <UInput v-model="state.fullname" :loading="isLoading" type="text" />
          </UFormGroup>
          <UFormGroup required label="Username" name="username">
            <UInput v-model="state.username" :loading="isLoading" type="text" />
          </UFormGroup>
          <UFormGroup required label="Email" name="email">
            <UInput v-model="state.email" :loading="isLoading" type="email" />
          </UFormGroup>
          <UFormGroup required label="Password" name="password">
            <UInput
              v-model="state.password"
              :loading="isLoading"
              type="password"
            />
          </UFormGroup>
          <UFormGroup
            required
            label="Konfirmasi password"
            name="repeatPassword"
          >
            <UInput
              v-model="state.repeatPassword"
              :loading="isLoading"
              type="password"
            />
          </UFormGroup>

          <UButton block :loading="isLoading" type="submit"> Daftar </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>
