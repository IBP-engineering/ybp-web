<script setup lang="ts">
const activities = [
  {
    title: 'Book Party',
    desc: 'Nongkrong asik buat pecinta buku! Ngobrolin buku seru, nikmatin weekend sambil baca makin hidup. Minat baca naik, wawasan literasi auto nambah. Semua genre diterima! Pemula, kutu buku, penulis, gabung sini rayain literasi bareng. Info lengkap: Instagram @yogbookparty',
    icon: 'lucide:book-open',
    href: '/activities/#bookparty',
    span: 2,
  },
  {
    title: 'Reading Habits',
    desc: 'Buktiin kamu bisa baca tiap hari! Biar makin semangat, ada hadiah spesial buat yang tamat tantangan. Yuk, bangun kebiasaan baca bareng!',
    icon: 'lucide:tree-deciduous',
    href: '/activities/#reading-habits',
    span: 1,
  },
  {
    title: 'Deklamasi Puisi',
    desc: 'Punya puisi keren yang pengen didengar? Ini waktunya! Deklamasi Puisi kasih panggung buat karyamu (sendiri atau penulis lain). Latih kreativitas & pede di sini! Yuk, suarakan puisimu!',
    icon: 'lucide:message-square-warning',
    href: '/activities/#puisi',
    span: 1,
  },
  {
    title: 'Sports Club',
    desc: 'Otak pintar, badan juga harus fit! Book Party ngerti, jangan cuma isi kepala, jaga juga kesehatanmu. Biar makin fokus & produktif!',
    icon: 'lucide:volleyball',
    href: '/activities/#sports-club',
    span: 1,
  },
  {
    title: 'Malam Imajinasi',
    desc: 'Overthinking bikin susah tidur? Sini ngobrol di Malam Imajinasi Book Party! Dipandu mentor psikologi, ini tempat aman buat curhat, saling paham, dan dapat insight baru. Beban pikiran auto berkurang! Yuk, gabung!',
    icon: 'lucide:moon',
    href: '/activities/#malam-imajinasi',
    span: 1,
  },
  {
    title: 'YBP Fomo',
    desc: 'Bikin literasi jadi biasa tapi seru! Baca bareng di tempat antimainstream, bebas tanpa batas. Wawasan nambah, pengalaman unik bikin nagih!',
    icon: 'lucide:plane',
    href: '/activities/#fomo',
    span: 1,
  },
  {
    title: 'YBP Collab',
    desc: 'Literasi kuat kalau kita barengan! Yogyakarta Book Party siap kolab sama komunitas, brand, penulis, dll. Nggak cuma soal buku kok! Asal semangat naikin minat baca sama, kita bisa bikin kampanye bareng. Gass kolaborasi buat perubahan!',
    icon: 'lucide:handshake',
    href: '/activities/#collab',
    span: 2,
  },
]

const activitiesSpan = ['md:col-span-1', 'md:col-span-2', 'md:col-span-3']
</script>

<template>
  <div
    class="container mx-auto space-y-16 px-4 py-24 md:space-y-24 md:px-0 md:py-32"
  >
    <h2
      id="activities"
      class="text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white"
    >
      Agenda Kami <br /><span class="text-primary-600">Paling Seru</span>
    </h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <NuxtLink
        v-for="act in activities"
        :key="act.title"
        :to="act.href"
        class="group relative flex h-full flex-1 flex-col gap-x-8 gap-y-4 rounded-xl border border-neutral-300 bg-white bg-gradient-to-b from-neutral-50/50 to-neutral-200/50 p-4 px-4 py-5 shadow ring-1 ring-neutral-200 transition duration-150 hover:bg-neutral-100/50 hover:ring-2 sm:p-6"
        :class="[
          activitiesSpan[act.span - 1],
          act.href ? 'hover:ring-primary-500' : '',
        ]"
      >
        <UIcon :name="act.icon" class="text-primary-500 h-12 w-12" />
        <b
          class="flex items-center gap-1.5 truncate text-base font-semibold text-neutral-900 dark:text-white"
          >{{ act.title }}</b
        >
        <p class="text-[15px] text-neutral-500 dark:text-neutral-400">
          {{ act.desc }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
