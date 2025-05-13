<template>
  <div
    class="grid grid-cols-2 justify-items-stretch gap-4 md:grid-cols-3 md:justify-items-end"
  >
    <div class="text-neutral-600 md:col-span-2">
      <p class="mb-2 font-medium">PRODUCTS</p>
      <ul class="space-y-2">
        <li>
          <NuxtLink to="/stories" class="hover:underline">Stories</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/reading-habits" class="hover:underline"
            >Reading Habits</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/goodies" class="hover:underline"
            >Goodies (coming soon)</NuxtLink
          >
        </li>
      </ul>
    </div>
    <div class="text-neutral-600">
      <p class="mb-2 font-medium">ORGANIZATION</p>
      <ul class="space-y-2">
        <li>
          <NuxtLink to="/#about-us" class="hover:underline">About us</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/#faq" class="hover:underline">FAQ</NuxtLink>
        </li>
        <li>
          <a href="/#contacts" class="hover:underline">Collaboration</a>
        </li>
      </ul>
    </div>
  </div>
</template>
