<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import type { Database } from '~/types/database.types'

definePageMeta({
  middleware: 'need-auth',
})

useHead({
  title: 'Settings',
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data
  try {
    // TODO: add username and email validation
    await supabase
      .from('users')
      .update({
        display_name: data.displayName,
        email: data.email,
        username: data.username,
        bio: data.bio,
        location: data.location,
      })
      .eq('id', user.value.id)

    toast.add({
      title: 'Berhasil',
      description: 'Profil kamu berhasil diubah',
      color: 'green',
    })
  } catch (error) {
    console.error(error)
  } finally {
    refreshNuxtData()
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 md:px-0">
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
          :schema="v.safeParser(schema)"
          :state="state"
          @submit="onSubmit"
          class="space-y-4"
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
              @change="value => (usernameDebInput = value)"
            />
          </UFormGroup>
          <UFormGroup label="Location" name="location">
            <UInput v-model="state.location" />
          </UFormGroup>
          <UFormGroup label="Bio" name="bio">
            <UTextarea v-model="state.bio" />
          </UFormGroup>
          <UButton class="mt-8" size="lg" type="submit"
            >Simpan perubahan</UButton
          >
        </UForm>
      </div>
    </div>
  </div>
</template>
