<script setup lang="ts">
import malamImg from '@/assets/images/imajinasi.webp'
import puisiImg from '@/assets/images/puisi.jpeg'
import sportImg from '@/assets/images/sport.webp'

defineOgImageComponent('default')
useSeoMeta({
  title: 'Aktivitas dan Kegiatan',
  description: 'Aktivitas dan Kegiatan di Yogyakarta Book Party',
})
definePageMeta({
  scrollToTop: false,
})

const appConfig = useAppConfig()
const igUrl = appConfig.socials.find(so => so.id === 'ig').link ?? ''
const hotlineNumber = appConfig.socials.find(so => so.id === 'wa').link ?? ''
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
const collabs = [
  { src: '/assets/activities/gramedia.png', alt: 'Gramedia' },
  { src: '/assets/activities/bentang.png', alt: 'Bentang Pustaka' },
]
</script>

<template>
  <div class="container mx-auto w-full px-3 md:px-0">
    <UBreadcrumb
      divider="/"
      :items="breadcrumbs"
      class="mb-4 flex justify-center"
    />
    <section class="mx-auto text-center md:max-w-[70%] lg:max-w-[40%]">
      <h1 class="text-4xl leading-relaxed font-bold text-balance">
        Keseruan dan Kreativitas Menjadi Bagian Komunitas
      </h1>
      <p class="text-neutral-600">Berbagai agenda dan kegiatan komunitas</p>
    </section>

    <div
      class="mx-auto mt-12 flex flex-wrap items-center justify-center gap-2 md:w-3/4 lg:w-1/2"
    >
      <UButton
        color="primary"
        variant="subtle"
        size="sm"
        to="/activities/#bookparty"
        >Book Party</UButton
      >
      <UButton
        color="primary"
        variant="subtle"
        size="sm"
        to="/activities/#collab"
        >Collab</UButton
      >
      <UButton
        color="primary"
        variant="subtle"
        size="sm"
        to="/activities/#reading-habits"
        >Reading Habits</UButton
      >
      <UButton
        color="primary"
        variant="subtle"
        size="sm"
        to="/activities/#malam-imajinasi"
        >Malam Imajinasi</UButton
      >
      <UButton color="primary" variant="subtle" size="sm" to="/activities/#fomo"
        >Fomo</UButton
      >
      <UButton
        color="primary"
        variant="subtle"
        size="sm"
        to="/activities/#puisi"
        >Deklamasi Puisi</UButton
      >
      <UButton
        color="primary"
        variant="subtle"
        size="sm"
        to="/activities/#sports-club"
        >Sports Club</UButton
      >
    </div>

    <ActivitiesSection
      id="bookparty"
      img="/assets/activities/bookparty.jpg"
      title="Book Party"
    >
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
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
      img="/assets/activities/collab.jpg"
      title="Collab"
    >
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
        Percaya bahwa literasi bisa tumbuh lebih kuat ketika berbagai pihak
        bersatu? Kami juga! Itulah kenapa Yogyakarta Book Party selalu terbuka
        untuk berkolaborasi dengan komunitas, brand, penulis profesional, dan
        banyak pihak lainnya. Tenang aja, nggak selalu soal buku kok! Selama
        punya semangat yang sama untuk meningkatkan minat baca, kita bisa
        merancang kampanye bersama-sama. Yuk, kolaborasi dan buat perubahan
        bareng.
      </p>
      <small class="mt-8 text-center font-bold uppercase"
        >Partner-partner keren yang pernah kolaborasi dengan Yogyakarta Book
        Party</small
      >

      <div
        class="mt-4 mb-8 flex max-w-4xl flex-wrap items-center justify-center gap-4"
      >
        <NuxtImg
          v-for="col in collabs"
          :key="col.src"
          :src="col.src"
          width="70"
          height="70"
          alt="logo"
          class="rounded-xl grayscale transition hover:grayscale-0"
          :title="col.alt"
        />
      </div>

      <UButton
        variant="soft"
        :to="hotlineNumber"
        external
        icon="ph:rocket-launch-fill"
        >Mari berkolaborasi</UButton
      >
    </ActivitiesSection>

    <ActivitiesSection
      id="malam-imajinasi"
      :img="malamImg"
      title="Malam Imajinasi"
      use-native-img
    >
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
        Nggak bisa tidur karena overthinking? Wajar kok, kamu cuma perlu ngobrol
        aja. Makanya Yogya Book Party mengadakan malam imajinasi untuk bookmates
        yang sering mengalami overthinking dan insomnia. Dipandu oleh mentor
        psikologi berpengalaman. Sesi ini hadir sebagai ruang aman untuk
        berbagi, memahami, dan menambah wawasan. Melalui obrolan Daring, acara
        ini diharapkan bisa membantu bookmates mengurangi beban pikiran. Ingin
        mencurahkan banyak hal? yuk gabung Yogya Book Party!
      </p>

      <UButton
        variant="soft"
        :to="igUrl"
        external
        class="mt-8"
        icon="ph:rocket-launch-fill"
        >Mari bergabung</UButton
      >
    </ActivitiesSection>

    <ActivitiesSection
      id="reading-habits"
      img="/assets/activities/readinghabits.jpg"
      title="Reading Habits"
    >
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
        Reading Challenge adalah tantangan membaca kepada Bookmates untuk
        membangun kebiasaan membaca setiap hari dengan cara yang seru. Kami
        paham bahwa untuk membangun kebiasaan membaca tidak mudah. Itulah kenapa
        kami menciptakan wadah untuk Bookmates agar bisa konsisten sambil
        melihat proses teman lainnya. Menariknya, ada hadiah spesial buat mereka
        yang berhasil menyelesaikan tantangan! Yuk, gabung bersama kami!
      </p>

      <UButton
        variant="outline"
        to="/reading-habits/leaderboard"
        trailing-icon="ph:arrow-circle-right"
        class="mt-8"
        >Lihat klasemen</UButton
      >
    </ActivitiesSection>

    <ActivitiesSection id="fomo" img="/assets/activities/fomo.jpg" title="FOMO">
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
        YBP Fomo adalah kegiatan yang bertujuan untuk menormalisasi literasi di
        masyarakat. Bersama-sama membaca di ruang yang tidak biasa, sehingga
        menciptakan ruang membaca aman tanpa ada batas. Tentunya, berdampak juga
        pada Bookmates. Selain menambah wawasan. Kita juga mendapat pengalaman
        baru dengan sensasi yang menyenangkan! Nantikan segera YBP Fomo, Teman.
      </p>
    </ActivitiesSection>

    <ActivitiesSection
      id="puisi"
      :img="puisiImg"
      title="Deklamasi Puisi"
      use-native-img
    >
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
        Punya puisi yang ingin didengar banyak orang? Sekarang saatnya. Yogya
        Book Party menghadirkan Deklamasi Puisi, ruang bagi siapa saja yang
        ingin menyampaikan pesan lewat puisi, mau itu puisi karya sendiri atau
        karya Sastrawan terkenal, kamu bisa melatih kreatifitas dan kepercayaan
        diri kamu disini. Yuk gabung bersama kami dan buat puisimu di rasakan
        banyak orang!
      </p>
    </ActivitiesSection>

    <ActivitiesSection
      id="sports-club"
      :img="sportImg"
      title="Sports Club"
      use-native-img
    >
      <p class="md:3/4 text-center text-neutral-600 lg:w-1/2">
        Meningkatkan wawasan itu penting, tapi kalau fisik nggak dijaga, gimana
        bisa tetap fokus? Yogya Book Party paham, banyak orang sibuk mengisi
        otak tapi lupa merawat tubuh. Makanya, kami bikin wadah buat Bookmates
        supaya nggak cuma pinter, tapi juga sehat.
      </p>

      <UButton
        variant="soft"
        to="https://chat.whatsapp.com/GcV4WQvCixALNSqT49XXf3"
        external
        icon="ph:whatsapp-logo-fill"
        class="mt-8"
        >Gabung grup WhatsApp</UButton
      >
    </ActivitiesSection>
  </div>
</template>
