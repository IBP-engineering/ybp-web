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
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Detail member',
})

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

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const toast = useToast()
const usernameParams = route.params.username
const { data: user, refresh: refreshUser } = await useAsyncData(
  `users/${usernameParams}`,
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
        tags:story_tags!id(tag:tag_id(title)), 
        author:users(id, username, display_name), 
        status:story_statuses!id(*)
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

const state = reactive({
  username: user.value.username,
  displayName: user.value.display_name,
  bio: user.value.bio ?? '',
  role: String(user.value.roles.id),
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
      title: 'Terjadi kesalahan ketika mengubah member',
      description: 'Username telah digunakan',
      color: 'red',
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
      role_id: Number(data.role),
      updated_at: new Date().toString(),
    })
    .eq('id', user.value.id)

  if (errorUpdate) {
    toast.add({
      title: 'Terjadi kesalahan ketika mengubah member',
      description: errorUpdate.message,
      color: 'red',
    })
    isLoading.value = false
    await Promise.allSettled([refreshUser(), refreshStories()])
    return
  }

  toast.add({
    title: 'Berhasil mengubah member',
    color: 'green',
  })
  openEditProfileSlide.value = false
  isLoading.value = false

  if (data.username !== user.value.username) {
    // username is changing
    await navigateTo(`/hq/members/${data.username}`)
  } else {
    await Promise.allSettled([refreshUser(), refreshStories()])
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
          <RoleBadge :name="user.roles.name" />
          <h1 class="text-xl font-bold md:mb-1 md:text-4xl">
            {{ user.display_name }}
          </h1>
          <p class="text-sm text-gray-600 md:text-base">@{{ user.username }}</p>
          <p class="mt-1 text-balance">
            {{ user.bio }}
          </p>
          <p
            :title="new Date(user.created_at).toString()"
            class="my-3 inline-flex items-center gap-1 text-gray-600"
          >
            <UIcon name="i-heroicons:calendar-days" class="h-5 w-5" /> Bergabung
            pada
            {{
              new Intl.DateTimeFormat('id', {
                month: 'long',
                year: 'numeric',
              }).format(new Date(user.created_at))
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
          <UserPicture :seed="user.username" />
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
        <h2 class="text-lg font-semibold">DAFTAR CERITA</h2>
        <div class="space-y-4" v-if="stories.length > 0">
          <StoryCard v-for="v in stories" :story="v" :key="v.id" />
        </div>
        <p class="text-gray-600" v-else>Belum ada cerita yang ditambahkan</p>
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
            v-if="user.roles.name !== 'admin'"
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
