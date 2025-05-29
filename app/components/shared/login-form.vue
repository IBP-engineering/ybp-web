<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { type InferInput, nonEmpty, object, pipe, string } from 'valibot'

const props = withDefaults(
  defineProps<{
    redirect?: boolean
  }>(),
  { redirect: true },
)

const route = useRoute()
const redirectPath = route.query?.redirect

const schema = object({
  email: emailValidator,
  password: pipe(string(), nonEmpty('Mohon masukkan password anda')),
})

type Schema = InferInput<typeof schema>

const supabase = useSupabaseClient()
const toast = useToast()
const isLoading = ref(false)
const show = ref(false)
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
        color: 'error',
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
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    if (!userRole.is_active) {
      supabase.auth.signOut()
      toast.add({
        title: 'Akun sudah tidak aktif kembali',
        description: 'Mohon hubungi admin untuk info lebih lanjut',
        color: 'error',
        icon: 'i-heroicons-x-mark-solid',
      })
      return
    }

    injectOnSuccessLogin()

    if (!props.redirect) {
      return
    }

    if (redirectPath) {
      await navigateTo(redirectPath.toString())
    } else {
      if (userRole.role_id === 1) {
        await navigateTo('/dashboard')
      } else {
        await navigateTo('/hq')
      }
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="flex w-full flex-col gap-5"
    @submit.prevent="login"
  >
    <UFormField label="Email" name="email">
      <UInput
        v-model="state.email"
        class="w-full"
        :loading="isLoading"
        type="email"
      />
    </UFormField>
    <UFormField label="Password" name="password">
      <UInput
        v-model="state.password"
        class="w-full"
        :loading="isLoading"
        :type="show ? 'text' : 'password'"
        :ui="{ trailing: 'pe-1' }"
        ><template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="show ? 'Hide password' : 'Show password'"
            :aria-pressed="show"
            aria-controls="password"
            @click="show = !show"
          />
        </template>
      </UInput>
      <template #hint>
        <ULink
          class="text-primary-600 text-xs hover:underline"
          to="/forgot-password"
          >Lupa password?</ULink
        >
      </template>
    </UFormField>

    <UButton block :loading="isLoading" type="submit"> Masuk </UButton>
    <USeparator label="ATAU" />
    <p class="text-center">
      Belum memiliki akun?
      <ULink
        class="text-primary-600 hover:underline"
        :to="
          redirectPath
            ? { path: '/register', query: { redirect: redirectPath } }
            : { path: '/register' }
        "
        >Buat baru</ULink
      >
    </p>
  </UForm>
</template>
