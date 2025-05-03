<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { Database } from '~/types/database.types'

const schema = v.object({
  displayName: v.string(),
  location: v.string(),
  bio: v.string(),
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
  bio: userProfile.value.bio,
  location: userProfile.value.location,
})
const isLoading = ref(false)
const form = ref<Form<Schema>>()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data
  isLoading.value = true
  try {
    await supabase
      .from('users')
      .update({
        display_name: data.displayName,
        bio: data.bio,
        location: data.location,
      })
      .eq('id', user.value.id)

    toast.add({
      title: 'Berhasil',
      description: 'Pengaturan profil berhasil diubah',
      icon: 'lucide:circle-check-big',
      color: 'success',
    })
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'Upss',
      description: error.toString(),
      color: 'error',
    })
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
      <UIcon name="i-lucide-user" /> Profile
    </h2>
    <div class="mb-4">
      <UAvatar
        :src="`${avatarBaseUrl}?seed=${userProfile.username}`"
        alt="Avatar"
        size="3xl"
      />
      <small class="block text-neutral-600"
        >*akan berubah mengikuti username</small
      >
    </div>

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Name" name="name" required>
        <UInput v-model="state.displayName" class="w-full" />
      </UFormField>
      <UFormField label="Location" name="location">
        <UInput v-model="state.location" class="w-full" />
      </UFormField>
      <UFormField label="Bio" name="bio">
        <UTextarea v-model="state.bio" class="w-full" />
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
