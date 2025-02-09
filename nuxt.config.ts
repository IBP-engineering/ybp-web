// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  image: {
    format: ['avif', 'webp'],
  },
  routeRules: {
    '/goodies': { prerender: true },
  },
  nitro: {
    future: {
      nativeSWR: true,
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    '@nuxt/image',
  ],
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    asyncEntry: true,
    buildCache: true,
  },
  supabase: {
    redirect: false,
  },
  colorMode: {
    preference: 'light',
  },
  typescript: {
    strict: false,
  },
  fonts: {
    provider: 'bunny',
    defaults: {
      weights: [300, 400, 500, 600, 700],
    },
  },
  site: {
    url: 'https://yogyakarta.bookparty.id',
    name: 'Yogyakarta Book Party',
    locale: 'id',
    description:
      'Yogyakarta Book Party Official Website. #baca #literasi #inklusif',
  },
  robots: {
    disallow: ['/hq', '/hq/*'],
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Yogyakarta Book Party',
      logo: '/logo.jpg',
    },
  },
})
