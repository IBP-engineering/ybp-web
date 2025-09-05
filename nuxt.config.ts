// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',
  devtools: { enabled: true },

  // workarounds from https://github.com/nuxt/nuxt/issues/32175#issuecomment-2898200099
  // vite: {
  //   $server: {
  //     build: {
  //       rollupOptions: {
  //         output: {
  //           preserveModules: true,
  //         },
  //       },
  //     },
  //   },
  // },

  image: {
    format: ['avif', 'webp'],
    domains: ['api.dicebear.com', 'pbwnxbtrvstghwumkkrk.supabase.co'],
  },
  css: ['~/styles/tailwind.css'],
  routeRules: {
    '/goodies': { prerender: true },
    '/panduan': {
      redirect:
        'https://ybp-eng.notion.site/Panduan-Pengguna-18dcff94653a800eac48d49c740b9ad5',
    },
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
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
    'motion-v/nuxt',
  ],
  // future: {
  //   compatibilityVersion: 4,
  // },
  experimental: {
    viewTransition: true,
    asyncEntry: true,
    granularCachedData: true,
    enforceModuleCompatibility: true,
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
      subsets: ['latin'],
    },
  },
  site: {
    url: 'https://www.ykbookparty.org',
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
