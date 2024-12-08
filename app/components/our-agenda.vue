<script setup lang="ts">
const activities = [
  {
    title: 'Book Party',
    desc: 'Bookparty adalah kegiatan membaca buku di tempat umum yang di agendakan setiap akhir pekan oleh YBP. Kegiatan ini bertujuan untuk menampung teman-teman yang bingung ingin membaca buku dimana dan dengan siapa.',
    icon: 'heroicons:book-open',
    span: 2,
  },
  {
    title: 'YBP Collab',
    desc: 'Salah satu cara YBP untuk membuka kerjasama dengan semua pihak dari berbagai kalangan di masyarakat. Bertujuan untuk memperluas lagi jaringan persahabatan antar komunitas.',
    icon: 'ph:handshake',
    span: 1,
  },
  {
    title: 'Reading Habits',
    desc: 'Tantangan yang diselenggarakan YBP untuk kegiatan baca buku rutin setiap harinya, dengan hadiah menarik untuk pemenang.',
    icon: 'ph:cactus',
    span: 1,
  },
  {
    title: 'Malam Imajinasi',
    desc: 'Acara daring yang dilakukan YBP untuk bookmates yang sedang overthinking dan insomnia. Dipandu oleh mentor psikologi yang berpengalaman, diharapkan agenda ini mampu mengurangi beban pikiran bookmates.',
    icon: 'ph:cloud-moon',
    span: 2,
  },
  {
    title: 'Deklamasi Puisi',
    desc: 'Agenda membaca puisi pada malam hari. Entah puisi yang sudah pernah dituliskan atau puisi ciptaan sendiri. Agenda ini bertujuan untuk mengasah kreatifitas dan kepercayaan diri bookmates.',
    icon: 'heroicons:chat-bubble-left-ellipsis',
    span: 3,
  },
  {
    title: 'YBP Fomo',
    desc: 'Sebuah kegiatan bookparty yang dilakukan di tempat publik yang tidak biasanya, contohnya di KRL. Bertujuan untuk memperluas jaringan literasi di masyarakat.',
    icon: 'ph:rocket-launch',
    span: 1,
  },
  {
    title: 'Sports Club',
    desc: 'Selain mengisi otak dengan bacaan yang bermanfaat, fisik juga harus dijaga. Agenda ini bertujuan untuk bookmates yang ingin berolahraga namun tidak ada rekan.',
    icon: 'ph:soccer-ball',
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
      class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white"
    >
      Agenda Kami <br /><span class="text-primary-500">Yang Paling Seru</span>
    </h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div
        v-for="act in activities"
        :key="act.title"
        class="hover:ring-primary-500 group relative flex h-full flex-1 flex-col gap-x-8 gap-y-4 rounded-xl border border-gray-300 bg-white bg-gradient-to-b from-gray-50/50 to-gray-200/50 p-4 px-4 py-5 shadow ring-1 ring-gray-200 transition duration-150 hover:bg-gray-100/50 hover:ring-2 sm:p-6"
        :class="activitiesSpan[act.span - 1]"
      >
        <UIcon :name="act.icon" class="text-primary-500 h-12 w-12" />
        <b
          class="flex items-center gap-1.5 truncate text-base font-semibold text-gray-900 dark:text-white"
          >{{ act.title }}</b
        >
        <p class="text-[15px] text-gray-500 dark:text-gray-400">
          {{ act.desc }}
        </p>
      </div>
    </div>
  </div>
</template>
