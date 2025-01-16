<script setup lang="ts">
import * as v from 'valibot'
import type { Form, FormSubmitEvent } from '#ui/types'
import type { Database } from '~/types/database.types'

defineOgImageComponent('default')
definePageMeta({
  middleware: 'need-auth',
})

useSeoMeta({
  title: 'Pengaturan pengguna',
  description: 'Ubah nama, profil, ataupun bio dari halaman ini',
})

const schema = v.object({
  displayName: v.string(),
  username: usernameValidator,
  location: v.string(),
  bio: v.string(),
  email: emailValidator,
})

type Schema = v.InferOutput<typeof schema>

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const toast = useToast()
const { data: userProfile } = await useAsyncData('profile', async () => {
  const { data } = await supabase
    .from('users')
    .select('id, username, bio, location, display_name, email')
    .eq('id', user.value.id)
    .single()

  return data
})

const state = reactive<Schema>({
  displayName: userProfile.value.display_name,
  email: userProfile.value.email,
  username: userProfile.value.username,
  bio: userProfile.value.bio,
  location: userProfile.value.location,
})
const usernameDebInput = ref(userProfile.value.username)
const debouncedUsername = refDebounced(usernameDebInput, 500)
const isLoading = ref(false)
const form = ref<Form<Schema>>()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data
  isLoading.value = true
  try {
    const existingUsername = await supabase
      .from('users')
      .select('id, username')
      .ilike('username', `%${data.username.trim()}%`)
      .neq('id', user.value.id)

    if (existingUsername?.data[0]) {
      toast.add({
        title: 'Gagal mengubah',
        icon: 'i-heroicons-exclamation-circle-solid',
        description:
          'Username telah ada digunakan. Mohon menggunakan username yang lain',
        color: 'yellow',
      })
      isLoading.value = false
      form.value.setErrors([
        { message: 'Username telah digunakan', path: 'username' },
      ])
      return
    }

    const existingEmail = await supabase
      .from('users')
      .select('id, username')
      .ilike('email', `%${data.email.trim()}%`)
      .neq('id', user.value.id)

    if (existingEmail?.data[0]) {
      toast.add({
        title: 'Gagal mengubah',
        icon: 'i-heroicons-exclamation-circle-solid',
        description:
          'Email telah ada digunakan. Mohon menggunakan email yang lain',
        color: 'yellow',
      })
      isLoading.value = false
      form.value.setErrors([
        { message: 'Email telah digunakan', path: 'email' },
      ])
      return
    }

    await Promise.allSettled([
      supabase
        .from('users')
        .update({
          display_name: data.displayName,
          email: data.email,
          username: data.username,
          bio: data.bio,
          location: data.location,
        })
        .eq('id', user.value.id),
      supabase.auth.updateUser({
        email: data.email,
      }),
    ])

    toast.add({
      title: 'Berhasil',
      description: 'Profil kamu berhasil diubah',
      color: 'green',
    })
  } catch (error) {
    console.error(error)
  } finally {
    refreshNuxtData()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <h1 class="text-3xl font-bold leading-relaxed md:text-4xl">
      @{{ userProfile.username }}
    </h1>

    <div class="mt-8 grid md:grid-cols-2">
      <div
        class="rounded border border-neutral-300 bg-neutral-50 px-8 py-6 shadow"
      >
        <h2 class="mb-4 text-xl font-bold md:text-2xl">User</h2>
        <div class="mb-4">
          <UAvatar
            :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${debouncedUsername}`"
            alt="Avatar"
            size="3xl"
          />
          <small class="block text-gray-600"
            >*akan berubah mengikuti username</small
          >
        </div>

        <UForm
          ref="form"
          :schema="v.safeParser(schema)"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Name" name="name" required>
            <UInput v-model="state.displayName" />
          </UFormGroup>
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="state.email" type="email" />
          </UFormGroup>
          <UFormGroup label="Username" name="username" required>
            <UInput
              v-model="state.username"
              @input="event => (usernameDebInput = event.target.value)"
            />
          </UFormGroup>
          <UFormGroup label="Location" name="location">
            <UInput v-model="state.location" />
          </UFormGroup>
          <UFormGroup label="Bio" name="bio">
            <UTextarea v-model="state.bio" />
          </UFormGroup>
          <UButton
            class="mt-8"
            trailing-icon="ph:floppy-disk-bold"
            size="lg"
            :loading="isLoading"
            type="submit"
            >Simpan perubahan</UButton
          >
        </UForm>
      </div>
    </div>
  </div>
</template>
