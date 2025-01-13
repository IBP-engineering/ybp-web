<script setup lang="ts">
const dummyData = [
  {
    number: 1,
    name: 'Budi Santoso',
    title: 'Petualangan di Pulau Misteri',
    pageCount: 250,
    genre: 'Petualangan',
    summary:
      'Seorang anak muda menemukan peta harta karun dan memulai petualangan seru di pulau terpencil.',
    point: 85,
  },
  {
    number: 2,
    name: 'Siti Aminah',
    title: 'Rahasia di Balik Senyuman',
    pageCount: 320,
    genre: 'Drama',
    summary:
      'Kisah tentang persahabatan, pengkhianatan, dan rahasia yang tersembunyi di balik senyuman seseorang.',
    point: 79,
  },
  {
    number: 3,
    name: 'Andi Wijaya',
    title: 'Misteri Rumah Tua',
    pageCount: 180,
    genre: 'Horor',
    summary:
      'Sebuah keluarga pindah ke rumah tua yang angker dan mulai mengalami kejadian-kejadian mistis.',
    point: 62,
  },
  {
    number: 4,
    name: 'Dewi Lestari',
    title: 'Cinta di Ujung Senja',
    pageCount: 280,
    genre: 'Romance',
    summary:
      'Kisah cinta yang mengharukan antara dua insan yang dipertemukan di saat senja kehidupan.',
    point: 91,
  },
  {
    number: 5,
    name: 'Rudi Hartono',
    title: 'Perjalanan Menuju Bintang',
    pageCount: 400,
    genre: 'Fiksi Ilmiah',
    summary:
      'Sebuah ekspedisi luar angkasa yang bertujuan mencari planet baru yang dapat dihuni manusia.',
    point: 75,
  },
  {
    number: 6,
    name: 'Eka Putri',
    title: 'Dongeng dari Negeri Awan',
    pageCount: 150,
    genre: 'Fantasi',
    summary:
      'Kumpulan dongeng tentang makhluk-makhluk ajaib dan petualangan di negeri khayangan.',
    point: 88,
  },
  {
    number: 7,
    name: 'Joko Susilo',
    title: 'Detektif Cilik',
    pageCount: 200,
    genre: 'Misteri',
    summary:
      'Sekelompok anak-anak yang membentuk tim detektif untuk memecahkan berbagai kasus misterius di lingkungan mereka.',
    point: 70,
  },
  {
    number: 8,
    name: 'Intan Permata',
    title: 'Senandung Rindu',
    pageCount: 220,
    genre: 'Puisi',
    summary:
      'Kumpulan puisi yang mengungkapkan kerinduan dan perasaan mendalam.',
    point: 95,
  },
  {
    number: 9,
    name: 'Hendra Gunawan',
    title: 'Bisnis Online Mudah',
    pageCount: 300,
    genre: 'Bisnis',
    summary:
      'Panduan praktis untuk memulai dan mengembangkan bisnis online dengan mudah.',
    point: 82,
  },
  {
    number: 10,
    name: 'Citra Kirana',
    title: 'Resep Masakan Nusantara',
    pageCount: 160,
    genre: 'Kuliner',
    summary:
      'Koleksi resep masakan tradisional dari berbagai daerah di Indonesia.',
    point: 89,
  },
]

const columns = [
  {
    key: 'number',
    label: 'No.',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'title',
    label: 'Judul',
  },
  {
    key: 'pageCount',
    label: 'Jumlah Halaman',
  },
  {
    key: 'genre',
    label: 'Genre',
  },
  {
    key: 'summary',
    label: 'Kesimpulan',
    rowClass: 'max-w-64 truncate',
  },
  {
    key: 'point',
    label: 'Poin',
  },
]

const expand = ref({
  openedRows: [dummyData[0]],
  row: {},
})
</script>

<template>
  <div class="rounded-lg border border-gray-300 bg-white py-2 shadow">
    <UTable v-model:expand="expand" :columns="columns" :rows="dummyData">
      <template #expand="{ row }">
        <div class="p-4">
          <pre>{{ row.summary }}</pre>
        </div>
      </template>
    </UTable>
  </div>
</template>
