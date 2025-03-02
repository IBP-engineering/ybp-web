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

const props = withDefaults(
  defineProps<{
    redirect?: boolean
  }>(),
  { redirect: true },
)

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

const injectOnSuccessLogin = inject(onSuccessLogin, () => null)

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
      .select('role_id, is_active')
      .eq('id', data.user.id)
      .single()

    if (!userRole) {
      supabase.auth.signOut()
      toast.add({
        title: 'Terjadi kesalahan',
        description: errorUser.message,
        color: 'red',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    if (!userRole.is_active) {
      supabase.auth.signOut()
      toast.add({
        title: 'Akun sudah tidak aktif kembali',
        description: 'Mohon hubungi admin untuk info lebih lanjut',
        color: 'red',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    injectOnSuccessLogin()

    if (!props.redirect) {
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
    class="flex w-full flex-col gap-5"
    @submit.prevent="login"
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
