<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { Database } from '~/types/database.types'

const schema = v.pipe(
  v.object({
    password: optionalPasswordValidator,
    username: usernameValidator,
    email: emailValidator,
    repeatPassword: v.pipe(v.string()),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['repeatPassword']],
      input => {
        const { password, repeatPassword } = input
        const trimmedPassword =
          typeof password === 'string' ? password.trim() : password
        const trimmedRepeatPassword =
          typeof repeatPassword === 'string'
            ? repeatPassword.trim()
            : repeatPassword

        // Rule: If the password is empty, the confirmation is not required to match (or even be present).
        // So, if trimmedPassword is empty, the check passes immediately.
        if (trimmedPassword === '') {
          return true
        }

        // Rule: If the password IS NOT empty, the confirmation MUST match.
        // This means trimmedRepeatPassword cannot be empty AND must equal trimmedPassword.
        if (trimmedRepeatPassword === '') {
          // Password is not empty, but repeatPassword is empty -> Mismatch
          return false
        }

        // If both are non-empty, compare them.
        return trimmedPassword === trimmedRepeatPassword
      },
      'Konfirmasi password tidak sesuai',
    ),
    ['repeatPassword'],
  ),
)

type Schema = v.InferOutput<typeof schema>

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const toast = useToast()
const { data: userProfile } = await useAsyncData(
  'profile-account',
  async () => {
    const { data } = await supabase
      .from('users')
      .select('id, username, bio, location, display_name, email')
      .eq('id', user.value.sub)
      .single()

    return data
  },
)

const form = reactive<Schema>({
  email: userProfile.value.email,
  username: userProfile.value.username,
  password: '',
  repeatPassword: '',
})
const showRepeatPassword = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const formRef = ref<Form<Schema>>()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data
  isLoading.value = true

  try {
    const existingUsername = await supabase
      .from('users')
      .select('id, username')
      .ilike('username', `%${data.username.trim()}%`)
      .neq('id', user.value.sub)

    if (existingUsername?.data[0]) {
      toast.add({
        title: 'Gagal mengubah',
        icon: 'i-heroicons-exclamation-circle-solid',
        description:
          'Username telah ada digunakan. Mohon menggunakan username yang lain',
        color: 'warning',
      })
      isLoading.value = false
      formRef.value.setErrors([
        { message: 'Username telah digunakan', name: 'username' },
      ])
      return
    }

    // const existingEmail = await supabase
    //   .from('users')
    //   .select('id, username')
    //   .ilike('email', `%${data.email.trim()}%`)
    //   .neq('id', user.value.id)
    //
    // if (existingEmail?.data[0]) {
    //   toast.add({
    //     title: 'Gagal mengubah',
    //     icon: 'i-heroicons-exclamation-circle-solid',
    //     description:
    //       'Email telah ada digunakan. Mohon menggunakan email yang lain',
    //     color: 'warning',
    //   })
    //   isLoading.value = false
    //   formRef.value.setErrors([
    //     { message: 'Email telah digunakan', name: 'email' },
    //   ])
    //   return
    // }

    await Promise.allSettled([
      supabase
        .from('users')
        .update({
          // email: data.email,
          username: data.username,
        })
        .eq('id', user.value.sub),
      // TODO: handle email confirmation process
      data.password
        ? supabase.auth.updateUser({
            password: data.password,
          })
        : null,
    ])

    toast.add({
      title: 'Berhasil',
      description: 'Pengaturan akun berhasil diubah',
      icon: 'lucide:circle-check-big',
      color: 'success',
    })
    form.password = ''
    form.repeatPassword = ''
  } catch (error) {
    console.error(error)
  } finally {
    refreshNuxtData()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="rounded border border-neutral-300 bg-neutral-50 px-8 py-6 shadow">
    <h2
      class="mb-4 text-xl font-bold md:text-2xl inline-flex gap-2 items-center"
    >
      <UIcon name="i-lucide-lock" /> Account
    </h2>
    <UForm
      ref="formRef"
      :schema="schema"
      :state="form"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Email" name="email">
        <p class="text-muted">{{ form.email }}</p>
      </UFormField>
      <UFormField label="Username" name="username" required>
        <UInput v-model="form.username" class="w-full" :loading="isLoading" />
      </UFormField>
      <UFormField label="New password" name="password">
        <UInput
          v-model="form.password"
          class="w-full"
          :loading="Boolean(form.password) && isLoading"
          :type="showPassword ? 'text' : 'password'"
          :ui="{ trailing: 'pe-1' }"
          ><template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>
      <UFormField label="Repeat new password" name="repeatPassword">
        <UInput
          v-model="form.repeatPassword"
          class="w-full"
          :loading="Boolean(form.repeatPassword) && isLoading"
          :type="showRepeatPassword ? 'text' : 'password'"
          :ui="{ trailing: 'pe-1' }"
          ><template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showRepeatPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="
                showRepeatPassword ? 'Hide password' : 'Show password'
              "
              :aria-pressed="showRepeatPassword"
              aria-controls="password"
              @click="showRepeatPassword = !showRepeatPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex justify-end">
        <UButton
          class="mt-8"
          trailing-icon="ph:floppy-disk-bold"
          size="lg"
          :loading="isLoading"
          type="submit"
          >Simpan perubahan</UButton
        >
      </div>
    </UForm>
  </div>
</template>
