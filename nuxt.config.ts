// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/google-fonts'],
  future: {
    compatibilityVersion: 4,
  },
  colorMode: {
    preference: 'light',
  },
  googleFonts: {
    display: 'swap',
    families: {
      Rubik: '400..700',
    },
  },
})

