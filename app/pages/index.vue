<script setup lang="ts">
import heroTugu from "~/assets/images/tugu.png";
useHead({
  title: 'Home',
})
</script>

<template>
  <div class="bg-gray-50">
    <nav class="py-10">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <div>
            <img src="https://placehold.co/400x400.png" alt="YBP Logo" class="h-12 rounded-full">
          </div>
          <ul class="flex space-x-8 ml-12">
            <li>
              <a href="#" class="text-gray-600 hover:bg-primary-50 gap-2 px-4 py-3 transition md:w-auto">Stories</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:bg-primary-50 gap-2 px-4 py-3 transition md:w-auto">Activities</a>
            </li>
            <li><a href="#" class="text-gray-600 hover:bg-primary-50 gap-2 px-4 py-3 transition md:w-auto">Goodies</a>
            </li>
            <li><a href="#" class="text-gray-600 hover:bg-primary-50 gap-2 px-4 py-3 transition md:w-auto">About Us</a>
            </li>
          </ul>
        </div>
        <div>
          <button
            class="text-gray-600 px-4 py-3 rounded border border-gray-600 hover:bg-primary-50 hover:border-gray-600">Join
            Now</button>
        </div>
      </div>
    </nav>

    <div class="py-20">
      <div class="container mx-auto text-center">
        <p class="text-2xl text-gray-500 mb-2">Baca buku, diskusi, dan main-main bareng</p>
        <h1 class="text-9xl font-bold text-gray-700 mb-2">Jogja</h1>
        <div class="flex items-center justify-center mb-6">
          <h1 class="text-8xl font-bold text-gray-700">Book</h1>
          <img :src="heroTugu" alt="Image Description" class="mx-4 h-48">
          <h1 class="text-8xl font-bold text-gray-700">Party</h1>
        </div>
      </div>
    </div>
    <div class="bg-gray-100 container mx-auto px-12 py-10 rounded-xl">
      <div class="w-full rounded overflow-hidden">
        <div class="flex items-center">
          <div class="w-5 h-5 rounded-full border border-primary-300 bg-primary-500 mr-2" />
          <div class="text-gray-500 text-xl">Kegiatan yang Akan Datang</div>
        </div>
        <div class="flex mt-6">
          <div class="w-1/3">
            <img src="https://picsum.photos/300/200" alt="Banner Image" class="w-full h-auto rounded-xl">
          </div>
          <div class="w-2/3 p-4 ml-4">
            <p class="text-gray-500 text-3xl">
              Nama Kegiatan
            </p>
            <br>
            <p class="text-gray-500 text-xl">
              Hari: 24 Agustus 2024<br>
              Waktu: 14.00 WIB - selesai<br>
              Tempat: Wisdom Park UGM
            </p>
            <br>
            <p class="text-gray-500 text-xl">
              Catatan:<br>
              Bawa alat tulis dan buku yang isinya pengen kamu ceritain ke bookmates lainnya, yaa!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
