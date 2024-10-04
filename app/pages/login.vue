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
  title: 'Masuk',
})

const schema = object({
  email: emailValidator,
  password: pipe(string(), nonEmpty('Mohon masukkan password anda')),
})

type Schema = InferInput<typeof schema>

const supabase = useSupabaseClient()
const toast = useToast()
const appConfig = useAppConfig()
const isLoading = ref(false)
const state = reactive({
  email: '',
  password: '',
})

async function login(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: event.data.email,
    password: event.data.password,
  })
  isLoading.value = false

  if (error) {
    toast.add({
      title: 'Terjadi kesalahan',
      description: error.message,
      color: 'red',
      icon: 'i-heroicons-x-mark-solid',
    })
    console.error(error.cause, error)
    return
  }

  const { data: userRole, error: errorUser } = await supabase
    .from('users')
    .select('role_id')
    .eq('id', data.user.id)
    .eq('is_active', true)
    .single()

  if (!userRole) {
    toast.add({
      title: 'Terjadi kesalahan',
      description: errorUser.message,
      color: 'red',
      icon: 'i-heroicons-x-mark-solid',
    })
    return
  }

  if (userRole.role_id === 1) {
    await navigateTo('/')
  } else {
    await navigateTo('/hq')
  }
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
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" :loading="isLoading" type="email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              :loading="isLoading"
              type="password"
            />
          </UFormGroup>

          <UButton block :loading="isLoading" type="submit"> Login </UButton>
          <p class="text-center">
            Belum memiliki akun?
            <ULink class="text-primary-600 hover:underline" to="/register"
              >Buat baru</ULink
            >
          </p>
        </UForm>

        <small class="mx-auto block w-full text-center italic text-gray-500">
          {{ appConfig.appVersion }}
        </small>
      </div>
    </div>
  </div>
</template>
