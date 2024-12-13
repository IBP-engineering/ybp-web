<script setup lang="ts">
defineOgImageComponent('default')
useSeoMeta({
  title: 'FAQ',
  description:
    'Menjawab pertanyaan-pertanyaan yang sering muncul dan ditanyakan',
})
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <section class="mb-8">
      <h1 class="text-4xl font-bold !leading-relaxed md:text-5xl">FAQ</h1>
      <p class="text-gray-600">
        Menjawab pertanyaan-pertanyaan yang sering muncul dan ditanyakan
      </p>
    </section>

    <div class="md:w-1/2">
      <UAccordion
        color="primary"
        variant="soft"
        :items="[
          {
            label: 'Apa itu Yogyakarta Book Party?',
            defaultOpen: true,
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
          {
            label: 'Bagaimana cerita saya bisa dipublikasikan?',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
          {
            label: 'Apa perbedaan dengan komunitas book party yang lain?',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
          {
            label: 'Apa saja benefit mengikuti kegiatan Yogyakarta Book Party?',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
        ]"
      />
      <UDivider class="my-2" label="ATAU" />
      <p>
        Masih memiliki pertanyaan yang belum terjawab? Jangan segan untuk
        hubungi kami melalui DM di
        <NuxtLink
          external
          to="https://www.instagram.com/yogbookparty"
          class="text-blue-600 underline hover:text-blue-500"
          >Instagram</NuxtLink
        >!
      </p>
    </div>
  </div>
</template>
