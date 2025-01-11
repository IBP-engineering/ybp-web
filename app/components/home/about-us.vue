<template>
  <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
    <div class="flex flex-col justify-center lg:w-3/4">
      <h2 id="about-us" class="text-3xl font-semibold leading-relaxed">
        Tentang Kami
      </h2>
      <p class="tracking-wide text-gray-600">
        Kami hadir untuk memenuhi visi, yaitu menjadikan literasi, terutama
        membaca buku, menjadi kebiasaan baru di masyarakat, khususnya di
        Yogyakarta. Yogyakarta Book Party berdiri pada tahun 2023 hingga saat
        ini memiliki lebih dari 800+ anggota dengan 4 organisasi yang berjalan
        di dalamnya.<br />
        <br />
        Komunitas ini adalah salah satu dari 63 Komunitas Book Party di bawah
        naungan Indonesia Book Party (IBP).
      </p>
    </div>
    <div class="order-first lg:order-last">
      <NuxtImg
        placeholder
        src="/assets/about-us.jpeg"
        alt="Foto pengurus dan supporter dari YBP"
        class="w-full rounded-lg"
        width="3800"
        height="2300"
        loading="lazy"
      />
    </div>
  </div>
</template>
