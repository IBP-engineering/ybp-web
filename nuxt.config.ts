// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/fonts', '@nuxtjs/supabase'],
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
      weights: [400, 500, 600, 700],
    },
  },
})
