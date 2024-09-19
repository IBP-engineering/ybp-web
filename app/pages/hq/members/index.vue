<script setup lang="ts">
import {
  nonEmpty,
  object,
  pipe,
  safeParser,
  string,
  trim,
  forward,
  partialCheck,
  type InferInput,
} from 'valibot'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Members',
})

const schema = pipe(
  object({
    username: usernameValidator,
    email: emailValidator,
    displayName: pipe(string(), nonEmpty('Mohon masukkan nama anda')),
    password: passwordValidator,
    repeatPassword: pipe(
      string(),
      trim(),
      nonEmpty('Mohon masukkan konfirmasi password anda'),
    ),
  }),
  forward(
    partialCheck(
      [['password'], ['repeatPassword']],
      input => input.password === input.repeatPassword,
      'Konfirmasi password tidak sesuai',
    ),
    ['repeatPassword'],
  ),
)

type Schema = InferInput<typeof schema>

const isOpenModalNewMember = ref(false)
const isLoading = ref(false)
const state = reactive({
  username: '',
  displayName: '',
  email: '',
  password: '',
  repeatPassword: '',
})

async function addNewMember(event: FormSubmitEvent<Schema>) {
  console.log(event)
}

function openModalNewMember() {
  isOpenModalNewMember.value = true
}
</script>

<template>
  <div>
    <PageHeader
      button-text="Tambah baru"
      @btn-click="openModalNewMember"
      title="Members"
    />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4">
      <p>Total: 25</p>

      <div class="mt-2 block">
        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="v in [1, 2, 3]" :key="v.toString()">
            <NuxtLink
              to="/hq/members/123"
              class="hover:border-primary-400 flex w-full items-center justify-between border-2 bg-white p-2 transition focus:outline-none focus:ring"
            >
              <div class="flex items-center gap-2">
                <img
                  src="https://api.dicebear.com/9.x/shapes/svg?seed=hehe"
                  alt="Profile picture"
                  class="rounded-full border bg-gray-50"
                  width="50"
                  height="50"
                />
                <div>
                  <RoleBadge />
                  <br />
                  <b class="mr-1">Muhammad Idris</b>
                  <small class="text-gray-600">@jamroji123</small>
                  <p class="text-gray-600">2 stories</p>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <UModal v-model="isOpenModalNewMember" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Add new member
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpenModalNewMember = false"
            />
          </div>
        </template>

        <UForm
          :schema="safeParser(schema)"
          :state="state"
          @submit="addNewMember"
          class="flex w-full flex-col"
        >
          <UFormGroup required label="Nama" name="displayName">
            <UInput v-model="state.displayName" :loading="isLoading" />
          </UFormGroup>
          <UFormGroup required class="mt-4" label="Username" name="username">
            <UInput v-model="state.username" :loading="isLoading" type="text" />
          </UFormGroup>
          <UFormGroup required class="mt-4" label="Email" name="email">
            <UInput v-model="state.email" :loading="isLoading" type="text" />
          </UFormGroup>
          <UFormGroup required class="mt-4" label="Password" name="password">
            <UInput
              v-model="state.password"
              :loading="isLoading"
              type="password"
            />
          </UFormGroup>
          <UFormGroup
            required
            class="mt-4"
            label="Konfirmasi password"
            name="repeatPassword"
          >
            <UInput
              v-model="state.repeatPassword"
              :loading="isLoading"
              type="password"
            />
          </UFormGroup>

          <div class="mt-6 flex items-center justify-end gap-4">
            <UButton
              @click="isOpenModalNewMember = false"
              variant="ghost"
              color="gray"
              :loading="isLoading"
            >
              Batal
            </UButton>
            <UButton :loading="isLoading" type="submit"> Simpan </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>
