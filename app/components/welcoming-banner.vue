<script setup lang="ts">
// @deprecated component

const cookieBanner = useCookie('welcome020', {
  maxAge: 60 * 60 * 24 * 30 * 12, // 1 year
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
  <UModal v-model:open="isOpen" class="w-full md:max-w-2xl" @close="closeModal">
    <template #content>
      <UCard
        :ui="{
          body: 'divide-y divide-neutral-100 dark:divide-neutral-800',
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
              class="mx-auto rounded border"
            />
          </div>
          <h3
            class="mb-4 text-center text-base font-semibold text-neutral-900 dark:text-white"
          >
            Official Yogyakarta Book Party web updates
          </h3>

          <b class="text-lg">0.2.0</b>
          <p>
            Fitur Terbaru: Tantangan Reading Habits, Klasemen, dan Interface
            Baru! 🥳🥳🎉
          </p>

          <ul class="mt-4 space-y-2">
            <li>
              <div class="flex items-center gap-2">
                <Icon
                  name="heroicons:check-circle-16-solid"
                  class="text-primary-500"
                />
                <b>Tantangan Reading Habits</b>
              </div>
              <p class="text-neutral-600">
                Siap untuk meningkatkan kebiasaan membaca? Kenalan dengan
                Tantangan Reading Habits! Fitur ini bikin kamu lebih fokus pada
                tujuan membaca dan mudah melacak kemajuan lewat dashboard yang
                simpel.
              </p>
            </li>
            <li>
              <div class="flex items-center gap-2">
                <Icon
                  name="heroicons:check-circle-16-solid"
                  class="text-primary-500"
                />
                <b>Klasemen Reading Habits</b>
              </div>
              <p class="text-neutral-600">
                Cek juga Klasemen Reading Habits untuk lihat peringkat dan
                kemajuanmu dibandingkan teman-teman. Dapatkan inspirasi dari
                pencapaian pembaca lain dan lihat siapa yang jadi juara!
              </p>
            </li>
            <li>
              <div class="flex items-center gap-2">
                <Icon
                  name="heroicons:check-circle-16-solid"
                  class="text-primary-500"
                />
                <b>Interface yang lebih menarik</b>
              </div>
              <p class="text-neutral-600">
                Dan yang paling seru, navigasi kami sekarang lebih stylish dan
                gampang digunakan. Dengan tambahan breadcrumb, kamu bisa dengan
                mudah melacak posisi di aplikasi. Selamat membaca dan nikmati
                pengalaman baru yang lebih seru!
              </p>
            </li>
          </ul>

          <p class="mt-4 border-t border-neutral-300 pt-1">
            Pantau @yogbookparty untuk update kegiatan menarik selanjutnya.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-center">
            <UButton variant="outline" color="neutral" @click="closeModal"
              >Tutup</UButton
            >
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
