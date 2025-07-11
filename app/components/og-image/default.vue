<script setup lang="ts">
/**
 * @credits Nuxt SEO <https://nuxtseo.com/>
 */
import { useOgImageRuntimeConfig } from '#og-image/shared'

// convert to typescript props
const props = withDefaults(
  defineProps<{
    colorMode?: 'dark' | 'light'
    title?: string
    description: string
    icon: string | boolean
    siteName: string
    siteLogo: string
    theme?: string
  }>(),
  {
    colorMode: 'light',
    theme: '#00dc82',
    title: 'title',
  },
)

const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const runtimeConfig = useOgImageRuntimeConfig()

const colorMode = computed(() => {
  return props.colorMode || runtimeConfig.colorPreference || 'light'
})

const themeHex = computed(() => {
  // regex test if valid hex
  if (HexRegex.test(props.theme)) return props.theme

  // if it's hex without the hash, just add the hash
  if (HexRegex.test(`#${props.theme}`)) return `#${props.theme}`

  // if it's rgb or rgba, we convert it to hex
  if (props.theme.startsWith('rgb')) {
    const rgb = props.theme
      .replace('rgb(', '')
      .replace('rgba(', '')
      .replace(')', '')
      .split(',')
      .map(v => Number.parseInt(v.trim(), 10))
    const hex = rgb
      .map(v => {
        const hex = v.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      })
      .join('')
    return `#${hex}`
  }
  return '#FFFFFF'
})

const themeRgb = computed(() => {
  // we want to convert it so it's just `<red>, <green>, <blue>` (255, 255, 255)
  return themeHex.value
    .replace('#', '')
    .match(/.{1,2}/g)
    ?.map(v => Number.parseInt(v, 16))
    .join(', ')
})

const siteConfig = useSiteConfig()
const siteName = computed(() => {
  return props.siteName || siteConfig.name
})
const siteLogo = computed(() => {
  return props.siteLogo || siteConfig.logo
})

const IconComponent = runtimeConfig.hasNuxtIcon
  ? resolveComponent('Icon')
  : defineComponent({
      render() {
        return h('div', 'missing @nuxt/icon')
      },
    })
if (
  typeof props.icon === 'string' &&
  !runtimeConfig.hasNuxtIcon &&
  import.meta.dev
) {
  console.warn(
    'Please install `@nuxt/icon` to use icons with the fallback OG Image component.',
  )

  console.log('\nnpx nuxi module add icon\n')
  // create simple div renderer component
}
</script>

<template>
  <div
    class="relative flex h-full w-full justify-between p-[60px]"
    :class="[
      colorMode === 'light'
        ? ['bg-white', 'text-neutral-900']
        : ['bg-neutral-900', 'text-white'],
    ]"
  >
    <div
      class="absolute right-[-100%] top-0 flex"
      :style="{
        width: '200%',
        height: '200%',
        backgroundImage: `radial-gradient(circle, rgba(${themeRgb}, 0.5) 0%,  ${colorMode === 'dark' ? 'rgba(5, 5, 5,0.3)' : 'rgba(255, 255, 255, 0.7)'} 50%, ${props.colorMode === 'dark' ? 'rgba(5, 5, 5,0)' : 'rgba(255, 255, 255, 0)'} 70%)`,
      }"
    />
    <div class="relative h-full w-full justify-between">
      <div class="flex flex-row items-start justify-between">
        <div class="flex w-full max-w-[65%] flex-col">
          <h1 class="m-0 mb-[30px] text-[75px] font-bold">
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="text-[35px]"
            :class="[
              colorMode === 'light'
                ? ['text-neutral-700']
                : ['text-neutral-300'],
            ]"
          >
            {{ description }}
          </p>
        </div>
        <div v-if="Boolean(icon)" style="width: 30%" class="flex justify-end">
          <IconComponent
            :name="icon"
            size="250px"
            style="margin: 0 auto; opacity: 0.7"
          />
        </div>
      </div>
      <div class="flex w-full flex-row items-center justify-center text-left">
        <img v-if="siteLogo" :src="siteLogo" height="30" />
        <template v-else>
          <svg
            height="50"
            width="50"
            class="mr-3"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              :fill="theme.includes('#') ? theme : `#${theme}`"
              d="M62.3,-53.9C74.4,-34.5,73.5,-9,67.1,13.8C60.6,36.5,48.7,56.5,30.7,66.1C12.7,75.7,-11.4,74.8,-31.6,65.2C-51.8,55.7,-67.9,37.4,-73.8,15.7C-79.6,-6,-75.1,-31.2,-61.1,-51C-47.1,-70.9,-23.6,-85.4,0.8,-86C25.1,-86.7,50.2,-73.4,62.3,-53.9Z"
              transform="translate(100 100)"
            />
          </svg>
          <p v-if="siteName" style="font-size: 25px" class="font-bold">
            {{ siteName }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
