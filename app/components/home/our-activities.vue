<script setup lang="ts">
const activities = [
  {
    title: 'Book Party',
    desc: 'Book Party adalah ruang seru bagi pecinta buku untuk berkumpul, berdiskusi, dan menikmati akhir pekan dengan membaca yang lebih hidup. Kegiatan ini bisa ningkatin minat baca sekaligus nambah wawasan literasi kamu. Nggak perlu takut nggak diterima, di sini semua genre kami rayakan. Dari pembaca pemula, veteran, bahkan penulis profesional, semuanya punya tempat. Kita bersama-sama merayakan literasi. Pantau terus kegiatan Book Party di Instagram @yogbookparty',
    icon: 'heroicons:book-open',
    href: '/activities',
    span: 2,
  },
  {
    title: 'YBP Collab',
    desc: 'Percaya bahwa literasi bisa tumbuh lebih kuat ketika berbagai pihak bersatu? Kami juga! Itulah kenapa Yogyakarta Book Party selalu terbuka untuk berkolaborasi dengan komunitas, brand, penulis profesional, dan banyak pihak lainnya. Tenang aja, nggak selalu soal buku kok! Selama punya semangat yang sama untuk meningkatkan minat baca, kita bisa merancang kampanye bersama-sama. Yuk, kolaborasi dan buat perubahan bareng.',
    icon: 'ph:handshake',
    span: 1,
  },
  {
    title: 'Reading Habits',
    desc: 'Reading Challenge adalah tantangan membaca kepada Bookmates untuk membangun kebiasaan membaca setiap hari dengan cara yang seru. Kami paham bahwa untuk membangun kebiasaan membaca tidak mudah. Itulah kenapa kami menciptakan wadah untuk Bookmates agar bisa konsisten sambil melihat proses teman lainnya. Menariknya, ada hadiah spesial buat mereka yang berhasil menyelesaikan tantangan! Yuk, gabung bersama kami!',
    icon: 'ph:cactus',
    span: 1,
  },
  {
    title: 'Malam Imajinasi',
    desc: 'Nggak bisa tidur karena overthinking? Wajar kok, kamu cuma perlu ngobrol aja. Makanya Yogya Book Party mengadakan malam imajinasi untuk bookmates yang sering mengalami overthinking dan insomnia. Dipandu oleh mentor psikologi berpengalaman. Sesi ini hadir sebagai ruang aman untuk berbagi, memahami, dan menambah wawasan. Melalui obrolan Daring, acara ini diharapkan bisa membantu bookmates mengurangi beban pikiran. Ingin mencurahkan banyak hal? yuk gabung Yogya Book Party! ',
    icon: 'ph:cloud-moon',
    span: 2,
  },
  {
    title: 'Deklamasi Puisi',
    desc: 'Punya puisi yang ingin didengar banyak orang? Sekarang saatnya. Yogya Book Party menghadirkan Deklamasi Puisi, ruang bagi siapa saja yang ingin menyampaikan pesan lewat puisi, mau itu puisi karya sendiri atau karya Sastrawan terkenal, kamu bisa melatih kreatifitas dan kepercayaan diri kamu disini. Yuk gabung bersama kami dan buat puisimu di rasakan banyak orang! ',
    icon: 'heroicons:chat-bubble-left-ellipsis',
    span: 3,
  },
  {
    title: 'YBP Fomo',
    desc: 'YBP Fomo adalah kegiatan yang bertujuan untuk menormalisasi literasi di masyarakat. Bersama-sama membaca di ruang yang tidak biasa, sehingga menciptakan ruang membaca aman tanpa ada batas. Tentunya, berdampak juga pada Bookmates. Selain menambah wawasan. Kita juga mendapat pengalaman baru dengan sensasi yang menyenangkan! Nantikan segera YBP Fomo, Teman. ',
    icon: 'ph:rocket-launch',
    span: 1,
  },
  {
    title: 'Sports Club',
    desc: 'Meningkatkan wawasan itu penting, tapi kalau fisik nggak dijaga, gimana bisa tetap fokus? Yogya Book Party paham, banyak orang sibuk mengisi otak tapi lupa merawat tubuh. Makanya, kami bikin wadah buat Bookmates supaya nggak cuma pinter, tapi juga sehat. ',
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
      Agenda Kami <br /><span class="text-primary-600">Paling Seru</span>
    </h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <NuxtLink
        v-for="act in activities"
        :key="act.title"
        :to="act.href"
        class="group relative flex h-full flex-1 flex-col gap-x-8 gap-y-4 rounded-xl border border-gray-300 bg-white bg-gradient-to-b from-gray-50/50 to-gray-200/50 p-4 px-4 py-5 shadow ring-1 ring-gray-200 transition duration-150 hover:bg-gray-100/50 hover:ring-2 sm:p-6"
        :class="[
          activitiesSpan[act.span - 1],
          act.href ? 'hover:ring-primary-500' : '',
        ]"
      >
        <UIcon :name="act.icon" class="text-primary-500 h-12 w-12" />
        <b
          class="flex items-center gap-1.5 truncate text-base font-semibold text-gray-900 dark:text-white"
          >{{ act.title }}</b
        >
        <p class="text-[15px] text-gray-500 dark:text-gray-400">
          {{ act.desc }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
