<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'

defineOgImageComponent('default')
definePageMeta({
  layout: 'auth',
  middleware: 'need-auth',
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
    isLoading.value = true
  }
}

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('session', session, event)
    if (event === 'PASSWORD_RECOVERY') {
      console.log('session', session)
    }
  })
})
</script>

<template>
  <div class="relative flex h-full w-full justify-center">
    <UAlert
      v-if="route.query.error"
      title="Heads up!"
      :description="route.query.error_description.toString()"
      icon="ph:warning-fill"
      color="error"
    />

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
