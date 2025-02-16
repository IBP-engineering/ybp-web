<script setup lang="ts">
defineOgImageComponent('default')
useSeoMeta({
  title: 'Aktivitas dan Kegiatan',
  description: 'Aktivitas dan Kegiatan di Yogyakarta Book Party',
})

const appConfig = useAppConfig()

const breadcrumbs = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Activities',
    to: '/activities',
  },
]
</script>

<template>
  <div class="container mx-auto w-full px-3 md:px-0">
    <UBreadcrumb
      divider="/"
      :links="breadcrumbs"
      class="mb-4 flex justify-center"
    />
    <section class="mx-auto text-center md:max-w-[70%] lg:max-w-[40%]">
      <h1 class="text-balance text-4xl font-bold leading-relaxed">
        Keseruan dan Kreativitas Menjadi Bagian Komunitas
      </h1>
      <p class="text-gray-600">Berbagai agenda dan kegiatan komunitas</p>
    </section>

    <div
      class="mx-auto mt-12 flex flex-wrap items-center justify-center gap-2 md:w-3/4 lg:w-1/2"
    >
      <UButton color="sky" size="sm" to="/activities/#bookparty"
        >Book Party</UButton
      >
      <UButton color="sky" size="sm" to="/activities/#collab">Collab</UButton>
      <UButton color="sky" size="sm">Reading Habits</UButton>
      <UButton color="sky" size="sm">Malam Imajinasi</UButton>
      <UButton color="sky" size="sm">Fomo</UButton>
      <UButton color="sky" size="sm">Sports Club</UButton>
      <UButton color="sky" size="sm">Deklamasi Puisi</UButton>
    </div>

    <ActivitiesSection
      id="bookparty"
      img="https://placehold.co/700x300.png"
      title="Book Party"
    >
      <p class="md:3/4 text-center text-gray-600 lg:w-1/2">
        Book Party adalah ruang seru bagi pecinta buku untuk berkumpul,
        berdiskusi, dan menikmati akhir pekan dengan membaca yang lebih hidup.
        Kegiatan ini bisa ningkatin minat baca sekaligus nambah wawasan literasi
        kamu. Nggak perlu takut nggak diterima, di sini semua genre kami
        rayakan. Dari pembaca pemula, veteran, bahkan penulis profesional,
        semuanya punya tempat. Kita bersama-sama merayakan literasi. Pantau
        terus kegiatan Book Party di Instagram
        <ULink :to="appConfig.socials[1].link" class="text-primary" external
          >@yogbookparty</ULink
        >
      </p>
    </ActivitiesSection>

    <ActivitiesSection
      id="collab"
      img="https://placehold.co/700x300.png"
      title="Collab"
    >
      <p class="md:3/4 text-center text-gray-600 lg:w-1/2">
        Percaya bahwa literasi bisa tumbuh lebih kuat ketika berbagai pihak
        bersatu? Kami juga! Itulah kenapa Yogyakarta Book Party selalu terbuka
        untuk berkolaborasi dengan komunitas, brand, penulis profesional, dan
        banyak pihak lainnya. Tenang aja, nggak selalu soal buku kok! Selama
        punya semangat yang sama untuk meningkatkan minat baca, kita bisa
        merancang kampanye bersama-sama. Yuk, kolaborasi dan buat perubahan
        bareng.
      </p>
      <b class="mt-8 text-center"
        >Pihak-pihak yang pernah berkolaborasi dengan Yogyakarta Book Party</b
      >

      <div
        class="mb-8 mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-2"
      >
        <img
          v-for="arr in [1, 2, 3, 4, 5, 6, 12, 122, 354]"
          :key="arr"
          src="https://placehold.co/130x80.png"
          alt="logo"
          class="rounded-xl"
        />
      </div>

      <UButton variant="soft" icon="ph:rocket-launch-fill"
        >Mari berkolaborasi</UButton
      >
    </ActivitiesSection>
  </div>
</template>
