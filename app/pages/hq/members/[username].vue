<script setup lang="ts">
import {
  nonEmpty,
  object,
  pipe,
  safeParser,
  string,
  maxLength,
  type InferInput,
} from 'valibot'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Detail member',
})

const samples = [
  {
    title: 'Ketika kekuasaan disalahgunakan',
    author: 'Kalwabed Rizki',
    status: 'verified',
  },
  {
    title: 'Tidur beralaskan jerami',
    author: 'Kalwabed Rizki',
    status: 'rejected',
  },
  {
    title: 'Kepanasan disengat hawa panas matahari ',
    author: 'Kalwabed Rizki',
    status: 'pending',
  },
]
const schema = object({
  username: usernameValidator,
  displayName: pipe(string(), nonEmpty('Mohon masukkan nama anda')),
  bio: pipe(string(), maxLength(250, 'Maksimal 250 karakter')),
  role: pipe(string(), nonEmpty('Mohon pilih role anda')),
})

type Schema = InferInput<typeof schema>

const openEditProfileSlide = ref(false)
const isLoading = ref(false)
const roleOptions = ref([])

const supabase = useSupabaseClient()
const route = useRoute()
const toast = useToast()
const usernameParams = route.params.username
const { data: member, refresh } = await useAsyncData(
  `members/${usernameParams}`,
  async () => {
    const { data, error } = await supabase
      .from('users')
      .select('username, id, display_name, created_at, bio, roles(name, id)')
      .eq('username', usernameParams)
      .single()

    if (error) {
      console.error(error)
      return null
    }

    return data
  },
)
const { data: roles } = await useLazyAsyncData('roles', async () => {
  const { data, error } = await supabase
    .from('roles')
    .select('name, id, created_at')
    .neq('has_full_access', true)

  if (error) {
    console.error(error)
    return null
  }

  return data
})

if (!member.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const state = reactive({
  username: member.value.username,
  displayName: member.value.display_name,
  bio: member.value.bio ?? '',
  role: String(member.value.roles.id),
})

async function updateProfile(event: FormSubmitEvent<Schema>) {
  const data = event.data
  isLoading.value = true

  const existingUsername = await supabase
    .from('users')
    .select('id')
    .ilike('username', `%${data.username}%`)
    .single()

  if (existingUsername?.data && existingUsername.data.id !== member.value.id) {
    // check if username is found but is the same user
    toast.add({
      title: 'Terjadi kesalahan ketika mengubah member',
      description: 'Username telah digunakan',
      color: 'red',
    })
    isLoading.value = false
    await refresh()
    return
  }

  const { error: errorUpdate } = await supabase
    .from('users')
    // @ts-ignore
    .update({
      username: data.username,
      display_name: data.displayName,
      bio: data.bio,
      role_id: Number(data.role),
      updated_at: new Date(),
    })
    .eq('id', member.value.id)

  if (errorUpdate) {
    toast.add({
      title: 'Terjadi kesalahan ketika mengubah member',
      description: errorUpdate.message,
      color: 'red',
    })
    isLoading.value = false
    await refresh()
    return
  }

  toast.add({
    title: 'Berhasil mengubah member',
    color: 'green',
  })
  openEditProfileSlide.value = false
  isLoading.value = false

  if (data.username !== member.value.username) {
    // username is changing
    await navigateTo(`/hq/members/${data.username}`)
  } else {
    await refresh()
  }
}

onMounted(() => {
  if (roles.value?.length > 0) {
    for (const role of roles.value) {
      roleOptions.value.push({ label: role.name, value: role.id })
    }
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Detail member"
      mode="detail"
      back-button-text="Members"
      back-button-href="/hq/members"
    />
    <div class="mx-auto w-full max-w-screen-xl">
      <div class="flex w-full flex-col-reverse justify-between p-4 md:flex-row">
        <div class="md:w-3/4">
          <RoleBadge :name="member.roles.name" />
          <h1 class="text-xl font-bold md:mb-1 md:text-4xl">
            {{ member.display_name }}
          </h1>
          <p class="text-sm text-gray-600 md:text-base">
            @{{ member.username }}
          </p>
          <p class="mt-1 text-balance">
            {{ member.bio }}
          </p>
          <p
            :title="new Date(member.created_at).toISOString()"
            class="my-3 inline-flex items-center gap-1 text-gray-600"
          >
            <UIcon name="i-heroicons:calendar-days" class="h-5 w-5" /> Bergabung
            pada
            {{
              new Intl.DateTimeFormat('id', {
                month: 'long',
                year: 'numeric',
              }).format(new Date(member.created_at))
            }}
          </p>
          <UButton
            block
            class="inline-flex md:hidden"
            variant="outline"
            color="gray"
            @click="openEditProfileSlide = true"
            >Edit</UButton
          >
        </div>

        <div class="flex flex-col items-center gap-2">
          <UserPicture :seed="member.username" />
          <UButton
            class="hidden md:inline-flex"
            variant="outline"
            color="gray"
            @click="openEditProfileSlide = true"
            >Edit</UButton
          >
        </div>
      </div>
      <div class="mt-4 space-y-4 px-4">
        <h2 class="text-lg">Daftar cerita</h2>
        <StoryCard v-for="v in samples" :story="v" :key="v.title" />
      </div>
    </div>

    <USlideover v-model="openEditProfileSlide">
      <UCard
        class="flex flex-1 flex-col"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Edit member
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="openEditProfileSlide = false"
            />
          </div>
        </template>

        <UForm
          :schema="safeParser(schema)"
          :state="state"
          @submit="updateProfile"
          class="flex w-full flex-col"
        >
          <UFormGroup required label="Username" name="username">
            <UInput v-model="state.username" :loading="isLoading" type="text" />
          </UFormGroup>
          <UFormGroup required class="mt-4" label="Nama" name="displayName">
            <UInput v-model="state.displayName" :loading="isLoading" />
          </UFormGroup>
          <UFormGroup
            required
            v-if="member.roles.name !== 'admin'"
            class="mt-4"
            label="Role"
            name="role"
          >
            <USelect v-model="state.role" :options="roleOptions" />
          </UFormGroup>
          <UFormGroup class="mt-4" label="Bio" name="bio">
            <UTextarea v-model="state.bio" :loading="isLoading" />
          </UFormGroup>

          <UButton block :loading="isLoading" class="mb-2 mt-6" type="submit">
            Simpan
          </UButton>
          <UButton
            block
            @click="openEditProfileSlide = false"
            variant="ghost"
            color="gray"
            :loading="isLoading"
          >
            Batal
          </UButton>
        </UForm>
      </UCard>
    </USlideover>
  </div>
</template>
