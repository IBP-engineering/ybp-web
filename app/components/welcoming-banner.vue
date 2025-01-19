<script setup lang="ts">
const cookieBanner = useCookie('welcome', {
  maxAge: 60 * 60 * 24 * 30, // 30 days
})
const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
  cookieBanner.value = new Date().toTimeString()
}

onMounted(() => {
  setTimeout(() => {
    if (!cookieBanner.value) {
      isOpen.value = true
    }
  }, 100)
})
</script>

<template>
  <UModal
    v-model="isOpen"
    @close="closeModal"
    :ui="{ width: 'md:max-w-2xl w-full' }"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <div class="flex flex-col">
        <div>
          <NuxtImg
            src="/assets/logo.jpg"
            loading="lazy"
            decoding="async"
            alt="YBP Logo"
            height="100"
            width="100"
            class="mx-auto rounded-full border"
          />
        </div>
        <h3
          class="mb-4 text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          Official Yogyakarta Book Party web updates
        </h3>

        <b class="text-lg">0.1.0</b>
        <p>Introducing our first released version of YBP web journey 🥳🥳🎉</p>

        <ul class="mt-4 space-y-2">
          <li>
            <div class="flex items-center gap-2">
              <Icon
                name="heroicons:check-circle-16-solid"
                class="text-primary-500"
              />
              <span>Tulis, publikasi, enjoy!</span>
            </div>
            <p class="text-gray-600">
              Mau tulis sesuatu yang ingin kamu bagikan kepada semua orang? Bisa
              banget. Sekarang kamu bisa tulis apapun, cerita, pengalaman, tips,
              atau review buku kamu di sini.
            </p>
          </li>
          <li>
            <div class="flex items-center gap-2">
              <Icon
                name="heroicons:check-circle-16-solid"
                class="text-primary-500"
              />
              <span>Pantau dan nikmati</span>
            </div>
            <p class="text-gray-600">
              Pantau perkembangan tulisan kamu melalui halaman dashboard yang
              mendukung di perangkat mobile.
            </p>
          </li>
        </ul>

        <p class="mt-4 border-t border-gray-300 pt-1">
          Selanjutnya akan datang sesuatu yang tak kalah menarik!
        </p>
        <p>
          Pantau perkembangannya melalui akun Instagram @yogbookparty, ya! 👋
        </p>
        <b>#kitabarumulai</b>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UButton variant="outline" color="gray" @click="closeModal"
            >Tutup</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
