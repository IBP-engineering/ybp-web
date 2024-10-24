<script setup lang="ts">
import {
  nonEmpty,
  object,
  pipe,
  safeParser,
  string,
  trim,
  forward,
  maxLength,
  partialCheck,
  type InferInput,
} from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import {
  passwordValidator,
  usernameValidator,
  emailValidator,
} from '~/utils/validator'

definePageMeta({
  layout: 'auth',
})
useHead({
  title: 'Buat akun baru',
})

const schema = pipe(
  object({
    displayName: pipe(
      string(),
      trim(),
      maxLength(120, 'Maksimal 120 karakter'),
      nonEmpty('Mohon masukkan nama lengkap anda'),
    ),
    email: emailValidator,
    username: usernameValidator,
    password: passwordValidator,
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

const toast = useToast()
const supabase = useSupabaseClient()
const isLoading = ref(false)
const state = reactive<Partial<Schema>>({
  displayName: '',
  username: '',
  password: '',
  email: '',
  repeatPassword: '',
})

async function register(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  const data = event.data

  const existingUser = await supabase
    .from('users')
    .select()
    .ilike('username', `%${data.username}%`)

  if (existingUser?.data[0]) {
    toast.add({
      title: 'Gagal mendaftar',
      icon: 'i-heroicons-exclamation-circle-solid',
      description:
        'Username telah ada digunakan. Mohon menggunakan username yang lain',
      color: 'yellow',
    })
    isLoading.value = false
    return
  }

  const { error } = await $fetch<{
    error?: { message: string }
  }>('/api/signup', {
    method: 'post',
    body: data,
  })

  if (error) {
    toast.add({
      icon: 'i-heroicons-x-mark-solid',
      color: 'red',
      title: 'Kesalahan ketika akan mendaftarkan akun',
      description: error.message,
    })
    console.error(error)
    isLoading.value = false
    return
  }

  toast.add({
    icon: 'heroicons:check',
    color: 'green',
    title: 'Berhasil daftar',
  })
  isLoading.value = false
  reloadNuxtApp()
}
</script>

<template>
  <div class="relative flex w-full justify-center">
    <div class="mx-auto mt-[10rem] flex w-full flex-col px-6 md:px-0">
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
          <UFormGroup required label="Nama" name="displayName">
            <UInput
              v-model="state.displayName"
              :loading="isLoading"
              type="text"
            />
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

        <UDivider label="ATAU" />
        <p class="text-center">
          Sudah memiliki akun?
          <ULink to="/login" class="text-primary-600 hover:underline"
            >Masuk</ULink
          >
        </p>
      </div>
    </div>
  </div>
</template>
