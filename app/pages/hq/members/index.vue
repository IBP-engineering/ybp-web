<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Members',
})
</script>

<template>
  <div>
    <PageHeader button-text="Tambah baru" title="Members" />
    <div class="mx-auto mt-4 w-full max-w-screen-xl px-4 md:px-8">
      <p>Total: 25</p>

      <div class="mt-2 block">
        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="v in [1, 2, 3]" :key="v.toString()">
            <NuxtLink
              to="/hq/members/123"
              class="hover:border-primary-400 flex w-full items-center justify-between border-2 bg-white p-2 transition focus:outline-none focus:ring"
            >
              <div class="flex items-center gap-2">
                <img
                  src="https://api.dicebear.com/9.x/shapes/svg?seed=hehe"
                  alt="Profile picture"
                  class="rounded-full border bg-gray-50"
                  width="40"
                  height="40"
                />
                <div class="">
                  <p
                    class="w-fit rounded border border-purple-700 bg-purple-500 px-1 text-xs font-medium text-white"
                    title="Role: Member"
                  >
                    Member
                  </p>
                  <b>jamroji123</b>
                  <small class="text-gray-600"> < hehe@gmail.com > </small>
                  <p class="text-gray-600">2 stories</p>
                </div>
              </div>
              <UIcon
                name="i-heroicons:chevron-right-16-solid"
                class="h-5 w-5 transform transition hover:translate-x-1"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
