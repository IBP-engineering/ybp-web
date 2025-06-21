<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
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
    .select('id, username, bio, location, display_name, email, profile_path')
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
const uploadInput = useTemplateRef('uploadInput')
const pic = ref<string>('')
const showModalCrop = ref(false)
const profilePic = ref<File>(null)
const defaultAvatar = `${avatarBaseUrl}?seed=${userProfile.value.username}`
const profileUrl = computed(() => {
  const supbasePublicUrl = supabase.storage
    .from('profile')
    .getPublicUrl(userProfile.value?.profile_path).data.publicUrl
  return supbasePublicUrl ?? defaultAvatar
})
const uploadedImgBlob = ref()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data
  isLoading.value = true

  try {
    let profilePicturePath: string = userProfile.value.profile_path

    if (pic.value && profilePic?.value?.name) {
      const filename = `${profilePic.value.name}`
      const { data: profileResult } = await supabase.storage
        .from('profile')
        .upload(`${user.value.id}/${filename}`, profilePic.value, {
          upsert: true,
        })

      console.log('uploading', filename)
      profilePicturePath = profileResult?.path
    }

    await supabase
      .from('users')
      .update({
        display_name: data.displayName,
        bio: data.bio,
        location: data.location,
        profile_path: profilePicturePath,
      })
      .eq('id', user.value.id)

    toast.add({
      title: 'Berhasil',
      description:
        'Pengaturan profil berhasil diubah. Perubahan pada foto profil mungkin memerlukan waktu beberapa saat sampai perubahan secara menyeluruh.',
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
    pic.value = null
    uploadInput.value.inputRef.value = ''
  }
}

/**
 * Select the picture to be cropped
 */
function selectFile(e: Event) {
  // Reset last selection and results
  pic.value = ''

  // Get selected files
  const { files } = e.target as HTMLInputElement
  if (!files || !files.length) return

  // Convert to dataURL and pass to the cropper component
  const file = files[0]
  // Define the maximum file size (2MB in bytes)
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  if (file.size > MAX_FILE_SIZE) {
    toast.add({
      title: 'Upload gagal',
      description: 'Maksimal ukuran file adalah 2MB.',
      color: 'error',
    })
    uploadInput.value.inputRef.value = ''
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // Update the picture source of the `img` prop
    pic.value = String(reader.result)

    // Show the modal
    showModalCrop.value = true
  }
}

/**
 * Get cropping results
 */
async function getResult() {
  if (!cropper) return
  const blob: Blob | null = await cropper.getBlob()
  if (!blob) return

  const file = await cropper.getFile({
    fileName: new Date().getTime().toString(),
  })

  profilePic.value = file

  uploadedImgBlob.value = URL.createObjectURL(blob)
  showModalCrop.value = false
}
</script>

<template>
  <div class="rounded border border-neutral-300 bg-neutral-50 px-8 py-6 shadow">
    <h2
      class="mb-4 text-xl font-bold md:text-2xl inline-flex gap-2 items-center"
    >
      <UIcon name="i-lucide-user" /> Profile
    </h2>
    <div class="flex flex-col mb-4">
      <UAvatar :src="uploadedImgBlob ?? profileUrl" alt="Avatar" size="3xl" />
      <UInput
        ref="uploadInput"
        class="mt-2"
        accept="image/jpg, image/jpeg, image/png, image/gif"
        type="file"
        @change="selectFile"
      />
    </div>

    <UModal v-model:open="showModalCrop" class="max-w-2xl" title="Crop">
      <template #body>
        <VuePictureCropper
          :img="pic"
          :box-style="{
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f8f8',
            margin: 'auto',
          }"
          :options="{
            viewMode: 1,
            dragMore: 'crop',
            aspectRatio: 1,
            cropBoxResizable: false,
          }"
          :preset-mode="{ mode: 'fixedSize' }"
        />
      </template>

      <template #footer>
        <div class="flex justify-end w-full">
          <UButton @click="getResult">Crop</UButton>
        </div>
      </template>
    </UModal>

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
