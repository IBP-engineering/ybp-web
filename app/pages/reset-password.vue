<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'

defineOgImageComponent('default')
definePageMeta({
  layout: 'auth',
})
useSeoMeta({
  title: 'Atur Ulang Kata Sandi',
  description: 'Lupa kata sandi? Yuk, reset kata sandi kamu disini.',
})

const schema = v.pipe(
  v.object({
    password: passwordValidator,
    repeatPassword: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('Mohon masukkan konfirmasi password anda'),
    ),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['repeatPassword']],
      input => input.password === input.repeatPassword,
      'Konfirmasi password tidak sesuai',
    ),
    ['repeatPassword'],
  ),
)

type Schema = v.InferInput<typeof schema>

const supabase = useSupabaseClient()
const route = useRoute()
const form = reactive<Schema>({ password: '', repeatPassword: '' })
const isLoading = ref(false)
const isSuccess = ref(false)
const showRepeatPassword = ref(false)
const showPassword = ref(false)
const isValidResetPassword = ref(false)
const toast = useToast()

async function updatePassword(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    const { error } = await supabase.auth.updateUser({
      password: event.data.password,
    })

    if (error) {
      toast.add({
        title: 'Upss...',
        description: error.message,
        color: 'error',
      })
      isLoading.value = false
      return
    }

    isSuccess.value = true
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

onBeforeMount(() => {
  const haveCode = route.query.code
  const isError = route.query.error && route.query.error_description

  if (!haveCode && !isError) {
    throw createError({ statusCode: 403, statusMessage: 'Page is forbidden' })
  }

  isValidResetPassword.value = true
})
</script>

<template>
  <div
    v-if="isValidResetPassword"
    class="relative flex h-full w-full justify-center"
  >
    <div
      v-if="route.query.error"
      class="containter h-full flex items-center m-auto"
    >
      <div class="flex flex-col text-center justify-center items-center">
        <UIcon name="ph:warning-fill" class="text-warning-500" size="64" />
        <h2 class="text-warning-500 font-bold text-lg mb-2">Upsss</h2>
        <span class="text-balance">
          {{ route.query.error_description }}. <br />Please contact admin if
          necessary.
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

    <div
      v-else
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
        <div
          v-if="isSuccess"
          class="flex flex-col text-center justify-center items-center"
        >
          <UIcon
            name="ph:shield-check-fill"
            class="text-primary-500"
            size="64"
          />
          <h2 class="text-primary-500 font-bold text-lg mb-2">
            Permintaan berhasil diproses
          </h2>
          <span class="text-balance">
            Kata sandi kamu berhasil diubah. Selamat datang kembali!
          </span>

          <UButton
            to="/dashboard"
            class="mt-4"
            variant="subtle"
            trailing-icon="ph:arrow-right"
            color="neutral"
            >Ke dashboard</UButton
          >
        </div>

        <template v-else>
          <b class="text-center font-bold md:text-left">Update password</b>
          <small class="text-neutral-600 text-balance">
            Atur sandi agar Anda tak lagi kesulitan mengingatnya.
          </small>
          <UForm
            :schema="schema"
            :state="form"
            class="flex w-full flex-col gap-5"
            @submit.prevent="updatePassword"
          >
            <UFormField label="New password" name="password">
              <UInput
                v-model="form.password"
                class="w-full"
                :loading="isLoading"
                :type="showPassword ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }"
                ><template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="
                      showPassword ? 'Hide password' : 'Show password'
                    "
                    :aria-pressed="showPassword"
                    aria-controls="password"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField label="Repeat new password" name="repeatPassword">
              <UInput
                v-model="form.repeatPassword"
                class="w-full"
                :loading="isLoading"
                :type="showRepeatPassword ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }"
                ><template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="
                      showRepeatPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                    "
                    :aria-label="
                      showRepeatPassword ? 'Hide password' : 'Show password'
                    "
                    :aria-pressed="showRepeatPassword"
                    aria-controls="password"
                    @click="showRepeatPassword = !showRepeatPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UButton
              block
              icon="ph:envelope"
              :loading="isLoading"
              type="submit"
            >
              Ubah password
            </UButton>
          </UForm>
        </template>
      </div>
    </div>
  </div>
</template>
