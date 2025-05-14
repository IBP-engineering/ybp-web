<script setup lang="ts">
const { socials } = useAppConfig()
</script>

<template>
  <footer
    class="z-[5] container mx-auto mt-auto rounded-lg border border-neutral-300 bg-neutral-100 px-8 py-12 md:mb-12"
  >
    <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
      <section class="col-span-1 flex h-full flex-col justify-between">
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
      </section>

      <seciton class="col-span-2">
        <LayoutFooterLinks />
      </seciton>
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
