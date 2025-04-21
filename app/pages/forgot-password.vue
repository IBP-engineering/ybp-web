<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'

defineOgImageComponent('default')
definePageMeta({
  layout: 'auth',
})
useSeoMeta({
  title: 'Lupa Password',
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
      return
    }

    toast.add({
      title: 'Sukses',
      description: 'Permintaan sedang diproses',
      color: 'success',
    })
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'Upss...',
      description: 'Sepertinya terjadi kesalahan',
      color: 'error',
    })
  } finally {
    isLoading.value = true
    isSubmitted.value = true
  }
}
</script>

<template>
  <div class="relative flex h-full w-full justify-center">
    <div class="mx-auto mt-[10rem] flex w-full flex-col px-6 md:px-0">
      <div>
        <NuxtImg
          src="/assets/logo.jpg"
          width="150"
          height="150"
          class="z-20 mx-auto rounded-full border"
          alt="YBP logo"
        />
      </div>
      <div
        class="z-20 mx-auto mt-6 flex w-full flex-col gap-4 rounded border bg-white p-4 shadow md:w-[24rem]"
      >
        <template v-if="!isSubmitted">
          <b class="text-center">Lupa kata sandi</b>
          <small class="text-center text-neutral-600 text-balance">
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
          <USeparator label="ATAU" />
          <p class="text-center">
            Belum memiliki akun?
            <ULink class="text-primary-600 hover:underline" to="/register"
              >Buat baru</ULink
            >
          </p>
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
