<script setup lang="ts">
defineOgImageComponent('default')
useSeoMeta({
  title: 'FAQ',
  description:
    'Menjawab pertanyaan-pertanyaan yang sering muncul dan ditanyakan',
})

const faqs = [
  {
    label: 'Gimana caranya ikutan Yogyakarta Book Party?',
    defaultOpen: true,
    content:
      'Gampang banget! Langsung aja dateng ke acara rutin Yogyakarta Book Party. Gak perlu registrasi, kecuali ada info khusus di media sosial kita. Cek terus info terbarunya ya! 😉',
  },
  {
    label: 'Harus bawa apa aja nih pas ikutan Book Party?',
    content:
      'Cukup bawa buku favoritmu dan jangan lupa bawa mood yang ceria biar makin seru! 😄',
  },
  {
    label: 'Kapan dan di mana acaranya?',
    content:
      'Biasanya sih di akhir pekan (Sabtu/Minggu), tapi bisa juga di hari lain. Lokasinya suka pindah-pindah, jadi pantengin terus info di Instagram kita ya! 🗓️📍',
  },
  {
    label: 'Ada aturan khusus gak buat buku yang dibawa?',
    content:
      'Bebas! Mau bawa novel, komik, buku pelajaran, atau ensiklopedia, semuanya boleh! 📚 Yang penting asli ya, jangan bajakan! 🙅🏻‍♀️',
  },
  {
    label: 'Acaranya ngapain aja sih?',
    content:
      'Kita bakal baca bareng (tapi tetep senyap ya🤫), terus diskusi tentang buku yang kita bawa. Ada juga aktivitas seru lainnya biar makin asik! 🤩',
  },
  {
    label: 'Boleh ajak temen yang belum pernah ikut Book Party gak?',
    content:
      'Boleh banget! Ajak siapa aja yang kamu mau, pacar, temen, sodara, tetangga, bahkan tukang bakso langgananmu juga boleh! Semakin rame semakin seru! 🎉',
  },
]
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <section class="mb-8">
      <h1 class="text-4xl font-bold !leading-relaxed md:text-5xl">FAQ</h1>
      <p class="text-gray-600">
        Hai Bookmates! 👋 Punya pertanyaan seputar Yogyakarta Book Party? Yuk,
        cekidot FAQ-nya! 👇
      </p>
    </section>

    <div class="md:w-1/2">
      <UAccordion color="primary" variant="soft" :items="faqs" multiple />
      <UDivider class="my-2" label="ATAU" />
      <p>
        Gimana? Udah siap buat gabung di Yogyakarta Book Party? 🎉 Masih ada
        yang mau ditanyain? 🤔 Kalo ada, langsung aja sampein ke kita lewat
        Instagram
        <NuxtLink
          external
          to="https://www.instagram.com/yogbookparty"
          class="text-blue-600 underline hover:text-blue-500"
          >@yogbookparty</NuxtLink
        >
        ya! 😉 See you there! 👋
      </p>
    </div>
  </div>
</template>
