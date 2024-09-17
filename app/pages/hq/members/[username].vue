<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Detail member',
})

const samples = [
  {
    title: 'Ketika kekuasaan disalahgunakan',
    author: 'Kalwabed Rizki',
    status: 'verified',
  },
  {
    title: 'Tidur beralaskan jerami',
    author: 'Kalwabed Rizki',
    status: 'rejected',
  },
  {
    title: 'Kepanasan disengat hawa panas matahari ',
    author: 'Kalwabed Rizki',
    status: 'pending',
  },
]

const openEditProfileSlide = ref(false)
</script>

<template>
  <div>
    <PageHeader
      title="Detail member"
      mode="detail"
      back-button-text="Members"
      back-button-href="/hq/members"
    />
    <div class="mx-auto w-full max-w-screen-xl">
      <div class="flex w-full flex-col-reverse justify-between p-4 md:flex-row">
        <div class="md:w-3/4">
          <RoleBadge />
          <h1 class="text-xl font-bold md:mb-1 md:text-4xl">Lughos Sari</h1>
          <p class="text-sm text-gray-600 md:text-base">@jamroji123</p>
          <p class="mt-1 text-balance">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            voluptatem numquam optio? Quis quos eaque et? In porro, cum voluptas
            ea unde quo, a delectus rem odio ducimus, id ipsum!
          </p>
          <p class="my-3 inline-flex items-center gap-1 text-gray-600">
            <UIcon name="i-heroicons:calendar-days" class="h-5 w-5" /> Bergabung
            pada Agustus 2024
          </p>
          <UButton
            block
            class="inline-flex md:hidden"
            variant="outline"
            color="gray"
            @click="openEditProfileSlide = true"
            >Edit</UButton
          >
        </div>

        <div class="flex flex-col items-center gap-2">
          <img
            src="https://api.dicebear.com/9.x/shapes/svg?seed=paijo"
            alt="Profile picture"
            class="rounded-full border bg-gray-50"
            width="110"
            height="110"
          />
          <UButton
            class="hidden md:inline-flex"
            variant="outline"
            color="gray"
            @click="openEditProfileSlide = true"
            >Edit</UButton
          >
        </div>
      </div>
      <div class="mt-4 space-y-4 px-4">
        <h2 class="text-lg">Daftar cerita</h2>
        <StoryCard v-for="v in samples" :story="v" :key="v.title" />
      </div>
    </div>
    <USlideover v-model="openEditProfileSlide" prevent-close>
      <UCard
        class="flex flex-1 flex-col"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Slideover
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="openEditProfileSlide = false"
            />
          </div>
        </template>

        <p>hello world</p>
      </UCard>
    </USlideover>
  </div>
</template>
