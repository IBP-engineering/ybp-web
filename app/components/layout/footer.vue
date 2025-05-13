<script setup lang="ts">
const { socials } = useAppConfig()
</script>

<template>
  <footer
    class="z-[5] container mx-auto mt-auto rounded-lg border border-neutral-300 bg-neutral-100 px-8 py-12 md:mb-12"
  >
    <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
      <div class="col-span-1 flex h-full flex-col justify-between">
        <div>
          <NuxtImg
            src="/assets/logo.jpg"
            loading="lazy"
            decoding="async"
            alt="YBP Logo"
            height="70"
            width="70"
            class="rounded border"
          />
          <div class="mt-4 flex items-center">
            <small class="text-neutral-600">
              Part of
              <ULink
                external
                to="https://indobookparty.org"
                class="font-bold hover:underline"
                title="To Indonesia Book Party official page"
                >Indonesia Book Party</ULink
              >
            </small>
          </div>
          <p class="mt-8 text-neutral-600">
            Designed in Sleman, Yogyakarta.<br />
            Built around the world. 🌎
          </p>
        </div>
      </div>
      <div class="col-span-2">
        <div
          class="grid grid-cols-2 justify-items-stretch gap-4 md:grid-cols-3 md:justify-items-end"
        >
          <div class="text-neutral-600 md:col-span-2">
            <p class="mb-2 font-medium">PRODUCTS</p>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/stories" class="hover:underline"
                  >Stories</NuxtLink
                >
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
                <NuxtLink to="/#about-us" class="hover:underline"
                  >About us</NuxtLink
                >
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
      </div>
    </div>
    <div
      class="mt-20 flex flex-col items-center justify-between text-neutral-600 md:flex-row"
    >
      <div class="flex gap-1">
        <NuxtLink
          v-for="social in socials"
          :key="social.id"
          :title="social.title"
          :to="social.link"
          target="_blank"
          external
        >
          <UIcon :name="social.logo" class="h-6 w-6" />
        </NuxtLink>
      </div>
      <div class="flex">
        <p class="font-medium">
          © {{ new Date().getFullYear() }} Yogyakarta Book Party
        </p>
      </div>
    </div>
  </footer>
</template>
