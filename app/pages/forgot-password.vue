<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'

defineOgImageComponent('default')
definePageMeta({
  layout: 'auth',
})
useSeoMeta({
  title: 'Reset password',
  description: 'Lupa kata sandi? Yuk, reset kata sandi kamu disini.',
})

const schema = v.object({
  email: emailValidator,
})

type Schema = v.InferInput<typeof schema>

const supabase = useSupabaseClient()
const state = reactive<Schema>({ email: '' })
const isLoading = ref(false)
const isSubmitted = ref(false)
const toast = useToast()

async function sendEmail(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    const { error } = await supabase.auth.resetPasswordForEmail(
      event.data.email,
      { redirectTo: window.location.origin.concat('/reset-password') },
    )

    if (error) {
      toast.add({
        title: 'Upss...',
        description: error.message,
        color: 'error',
      })
      isLoading.value = false
      return
    }

    isSubmitted.value = true
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'Upss...',
      description: 'Sepertinya terjadi kesalahan',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="relative flex h-full w-full justify-center">
    <UButton
      class="absolute top-4 left-2"
      icon="ph:caret-left"
      to="/"
      variant="ghost"
      color="neutral"
      >Home</UButton
    >

    <div
      class="mx-auto mt-[18rem] flex w-full flex-col px-6 md:px-0 md:w-[24rem]"
    >
      <div>
        <NuxtImg
          src="/assets/logo.jpg"
          width="60"
          height="60"
          class="z-20 rounded-sm mx-auto md:mx-0 border"
          alt="YBP logo"
        />
      </div>
      <div class="z-20 mx-auto mt-6 flex w-full flex-col gap-4 rounded">
        <template v-if="!isSubmitted">
          <b class="text-center font-bold md:text-left">Reset password</b>
          <small class="text-neutral-600 text-balance">
            Masukkan alamat email Anda yang terdaftar untuk mengatur ulang kata
            sandi.
          </small>
          <UForm
            :schema="schema"
            :state="state"
            class="flex w-full flex-col gap-5"
            @submit.prevent="sendEmail"
          >
            <UFormField label="Email" name="email">
              <UInput
                v-model="state.email"
                class="w-full"
                :loading="isLoading"
                type="email"
                placeholder="cth. namamu@mail.com"
              />
            </UFormField>

            <UButton
              block
              icon="ph:envelope"
              :loading="isLoading"
              type="submit"
            >
              Kirim Email
            </UButton>
          </UForm>
        </template>

        <div
          v-else
          class="flex flex-col text-center justify-center items-center"
        >
          <UIcon name="ph:mailbox-fill" class="text-primary-500" size="64" />
          <h2 class="text-primary-500 font-bold text-lg mb-2">
            Permintaan sedang diproses
          </h2>
          <span class="text-balance">
            Kami telah mengirimkan email pengaturan ulang kata sandi ke
            <b>{{ state.email }}</b>
            jika terhubung dengan akun yang aktif. <br />Silakan periksa email
            Anda.
          </span>

          <UButton
            to="/"
            class="mt-4"
            trailing-icon="ph:house"
            variant="subtle"
            color="neutral"
            >Kembali ke Beranda</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
