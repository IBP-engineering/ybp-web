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

const schema = object({
  email: emailValidator,
  password: pipe(string(), nonEmpty('Mohon masukkan password anda')),
})

type Schema = InferInput<typeof schema>

const supabase = useSupabaseClient()
const toast = useToast()
const isLoading = ref(false)
const state = reactive({
  email: '',
  password: '',
})

async function login(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
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
      await navigateTo('/dashboard')
    } else {
      await navigateTo('/hq')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
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
      <UInput v-model="state.password" :loading="isLoading" type="password" />
    </UFormGroup>

    <UButton block :loading="isLoading" type="submit"> Masuk </UButton>
    <UDivider label="ATAU" />
    <p class="text-center">
      Belum memiliki akun?
      <ULink class="text-primary-600 hover:underline" to="/register"
        >Buat baru</ULink
      >
    </p>
  </UForm>
</template>
