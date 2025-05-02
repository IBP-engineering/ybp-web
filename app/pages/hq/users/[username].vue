<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import {
  type InferInput,
  boolean,
  maxLength,
  nonEmpty,
  number,
  object,
  pipe,
  string,
} from 'valibot'
import type { Database } from '~/types/database.types'

defineOgImageComponent('default')
definePageMeta({
  layout: 'hq',
})

useHead({
  title: 'Detail user',
})

const schema = object({
  username: usernameValidator,
  displayName: pipe(string(), nonEmpty('Mohon masukkan nama anda')),
  location: string(),
  isActive: boolean(),
  bio: pipe(string(), maxLength(250, 'Maksimal 250 karakter')),
  role: pipe(number()),
})

type Schema = InferInput<typeof schema>

const openEditProfileSlide = ref(false)
const isLoading = ref(false)

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const toast = useToast()
const usernameParams = route.params.username
const { data: user, refresh: refreshUser } = await useAsyncData(
  `users/${usernameParams}`,
  async () => {
    const { data, error } = await supabase
      .from('users')
      .select(
        'username, id, display_name, created_at, is_active, bio, location, roles(name, id)',
      )
      .eq('username', usernameParams.toString())
      .single()

    if (error) {
      console.error(error)
      return null
    }

    return data
  },
)
const { data: roles } = await useLazyAsyncData(
  'roles',
  async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('name, id, created_at')
      .neq('has_full_access', true)

    if (error) {
      console.error(error)
      return null
    }

    return data
  },
  {
    transform: data => {
      return data?.map(role => ({
        label: role.name,
        value: role.id,
      }))
    },
  },
)

if (!user.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const { data: stories, refresh: refreshStories } = await useAsyncData(
  `users/${usernameParams}/stories`,
  async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(
        `*, 
        author:users(id, username, display_name)
        `,
      )
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    return data
  },
)

const state = reactive<Schema>({
  username: user.value.username,
  displayName: user.value.display_name,
  bio: user.value.bio ?? '',
  role: user.value.roles.id,
  location: user.value.location ?? '',
  isActive: user.value.is_active,
})

async function updateProfile(event: FormSubmitEvent<Schema>) {
  const data = event.data
  isLoading.value = true

  const existingUsername = await supabase
    .from('users')
    .select('id')
    .ilike('username', `%${data.username}%`)
    .single()

  if (existingUsername?.data && existingUsername.data.id !== user.value.id) {
    // check if username is found but is the same user
    toast.add({
      title: 'Terjadi kesalahan ketika mengubah user',
      description: 'Username telah digunakan',
      color: 'error',
    })
    isLoading.value = false
    await Promise.allSettled([refreshUser(), refreshStories()])
    return
  }

  const { error: errorUpdate } = await supabase
    .from('users')
    // @ts-ignore
    .update({
      username: data.username,
      display_name: data.displayName,
      bio: data.bio,
      location: data.location,
      is_active: data.isActive,
      role_id: Number(data.role),
      // @ts-ignore
      updated_at: new Date(),
    })
    .eq('id', user.value.id)

  if (errorUpdate) {
    toast.add({
      title: 'Terjadi kesalahan ketika mengubah user',
      description: errorUpdate.message,
      color: 'error',
    })
    isLoading.value = false
    await Promise.allSettled([refreshUser(), refreshStories()])
    return
  }

  toast.add({
    title: 'Berhasil mengubah user',
    color: 'success',
  })
  openEditProfileSlide.value = false
  isLoading.value = false

  if (data.username !== user.value.username) {
    // username is changing
    await navigateTo(`/hq/users/${data.username}`)
  } else {
    await Promise.allSettled([refreshUser(), refreshStories()])
  }
}
</script>

<template>
  <div>
    <PageHeader
      title="Detail user"
      mode="detail"
      back-button-text="Users"
      back-button-href="/hq/users"
    />
    <div class="mx-auto w-full max-w-screen-xl">
      <div class="flex w-full flex-col-reverse justify-between p-4 md:flex-row">
        <div class="md:w-3/4">
          <div class="inline-flex gap-2">
            <RoleBadge :name="user.roles.name" />
            <UBadge v-if="!user.is_active" color="neutral" size="xs"
              >Tidak aktif</UBadge
            >
          </div>
          <h1 class="text-xl font-bold md:mb-1 md:text-4xl">
            {{ user.display_name }}
          </h1>
          <p class="text-sm text-neutral-600 md:text-base">
            @{{ user.username }}
          </p>
          <p class="mt-1 text-balance">
            {{ user.bio }}
          </p>
          <div class="my-3 flex flex-col gap-x-3 gap-y-1 md:flex-row">
            <p
              :title="new Date(user.created_at).toString()"
              class="inline-flex items-center gap-1 text-neutral-600"
            >
              <UIcon name="i-heroicons:calendar-days" class="h-5 w-5" />
              Bergabung pada
              {{
                new Intl.DateTimeFormat('id', {
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(user.created_at))
              }}
            </p>
            <p
              v-if="Boolean(user.location)"
              class="inline-flex items-center gap-1 text-neutral-600"
            >
              <UIcon name="heroicons:map-pin" class="h-5 w-5" />
              {{ user.location }}
            </p>
          </div>
          <UButton
            block
            class="inline-flex md:hidden"
            variant="outline"
            color="neutral"
            @click="openEditProfileSlide = true"
            >Edit</UButton
          >
        </div>

        <div class="flex flex-col items-center gap-2">
          <UserPicture :seed="user.username" />
          <UButton
            class="hidden md:inline-flex"
            variant="outline"
            color="neutral"
            @click="openEditProfileSlide = true"
            >Edit</UButton
          >
        </div>
      </div>
      <div class="mt-4 space-y-4 px-4">
        <h2 class="text-lg font-semibold">DAFTAR CERITA</h2>
        <div v-if="stories.length > 0" class="space-y-4">
          <HqStoryCard
            v-for="story in stories"
            :key="story.id"
            :story="story"
          />
        </div>
        <p v-else class="text-neutral-600">Belum ada cerita yang ditambahkan</p>
      </div>
    </div>

    <USlideover
      v-model:open="openEditProfileSlide"
      title="Edit User"
      close-icon="i-heroicons-x-mark-20-solid"
    >
      <template #body>
        <div class="flex flex-1 flex-col">
          <UForm
            :schema="schema"
            :state="state"
            class="flex w-full flex-col"
            @submit="updateProfile"
          >
            <UFormField required label="Username" name="username">
              <UInput
                v-model="state.username"
                :loading="isLoading"
                class="w-full"
                type="text"
              />
            </UFormField>
            <UFormField required class="mt-4" label="Nama" name="displayName">
              <UInput
                v-model="state.displayName"
                class="w-full"
                :loading="isLoading"
              />
            </UFormField>
            <UFormField class="mt-4" label="Domisili" name="location">
              <UInput
                v-model="state.location"
                class="w-full"
                :loading="isLoading"
              />
            </UFormField>
            <UFormField
              v-if="user.roles.name !== 'admin'"
              required
              class="mt-4"
              label="Role"
              name="role"
            >
              <USelect v-model="state.role" class="w-full" :items="roles" />
            </UFormField>
            <UFormField class="mt-4" label="Aktif" name="isActive">
              <USwitch v-model="state.isActive" color="primary" />
            </UFormField>
            <UFormField class="mt-4" label="Bio" name="bio">
              <UTextarea
                v-model="state.bio"
                :loading="isLoading"
                class="w-full"
              />
            </UFormField>

            <div class="mt-6 flex items-center justify-end gap-4">
              <UButton
                variant="ghost"
                color="neutral"
                :loading="isLoading"
                @click="openEditProfileSlide = false"
              >
                Batal
              </UButton>
              <UButton :loading="isLoading" type="submit"> Simpan </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </USlideover>
  </div>
</template>
