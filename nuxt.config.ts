// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
  ],
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    asyncEntry: true,
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
    url: 'https://ybp-web.netlify.app',
    name: 'Yogyakarta Book Party',
    locale: 'id',
    description:
      'Yogyakarta Book Party Official Website. #baca-buku #diskusi #main-bareng',
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
