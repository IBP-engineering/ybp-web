<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import {
  type InferInput,
  forward,
  maxLength,
  nonEmpty,
  object,
  partialCheck,
  pipe,
  string,
  trim,
} from 'valibot'
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from '~/utils/validator'

defineOgImageComponent('default')
definePageMeta({
  layout: 'auth',
})
useSeoMeta({
  title: 'Buat akun baru',
  description:
    'Buat akun baru untuk melanjutkan proses registrasi sebagai anggota',
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
      color: 'warning',
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
      color: 'error',
      title: 'Kesalahan ketika akan mendaftarkan akun',
      description: error.message,
    })
    console.error(error)
    isLoading.value = false
    return
  }

  toast.add({
    icon: 'heroicons:check',
    color: 'success',
    title: 'Berhasil daftar',
  })
  isLoading.value = false
  reloadNuxtApp()
}
</script>

<template>
  <div class="relative flex w-full justify-center">
    <UButton
      class="absolute top-4 left-2"
      icon="ph:caret-left"
      to="/"
      variant="ghost"
      color="neutral"
      >Home</UButton
    >

    <div
      class="mx-auto mt-[8rem] flex w-full flex-col px-6 md:px-0 md:w-[24rem]"
    >
      <div>
        <NuxtImg
          src="/assets/logo.jpg"
          width="60"
          height="60"
          class="z-20 rounded-sm mx-auto md:mx-0 border"
          alt="YBP logo"
        />
      </div>
      <div class="z-20 mx-auto mt-6 flex w-full flex-col gap-4">
        <b class="text-center font-bold md:text-left">Buat akun baru</b>
        <small class="text-neutral-600 text-balance">
          Komunitas terbuka untuk kolaborasi dan berbagi kecintaan pada buku.
          Mari bergabung!
        </small>

        <UForm
          :schema="schema"
          :state="state"
          class="flex w-full flex-col gap-5"
          @submit="register"
        >
          <UFormField required label="Nama" name="displayName">
            <UInput
              v-model="state.displayName"
              :loading="isLoading"
              class="w-full"
              type="text"
            />
          </UFormField>
          <UFormField required label="Username" name="username">
            <UInput
              v-model="state.username"
              class="w-full"
              :loading="isLoading"
              type="text"
            />
          </UFormField>
          <UFormField required label="Email" name="email">
            <UInput
              v-model="state.email"
              class="w-full"
              :loading="isLoading"
              type="email"
            />
          </UFormField>
          <UFormField required label="Password" name="password">
            <UInput
              v-model="state.password"
              :loading="isLoading"
              type="password"
              class="w-full"
            />
          </UFormField>
          <UFormField
            required
            label="Konfirmasi password"
            name="repeatPassword"
          >
            <UInput
              v-model="state.repeatPassword"
              :loading="isLoading"
              type="password"
              class="w-full"
            />
          </UFormField>

          <UButton block :loading="isLoading" type="submit">Buat akun</UButton>
        </UForm>

        <USeparator label="ATAU" />
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
