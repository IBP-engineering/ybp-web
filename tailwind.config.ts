import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gold: {
          '50': '#fbf7eb',
          '100': '#f6efd7',
          '200': '#eedfaf',
          '300': '#e5cf87',
          '400': '#ddbf5f',
          '500': '#d4af37',
          '600': '#aa8c2c',
          '700': '#7f6921',
          '800': '#554616',
          '900': '#2a230b',
        },
        silver: {
          '50': '#f9f9f9',
          '100': '#f2f2f2',
          '200': '#e6e6e6',
          '300': '#d9d9d9',
          '400': '#cdcdcd',
          '500': '#c0c0c0',
          '600': '#9a9a9a',
          '700': '#737373',
          '800': '#4d4d4d',
          '900': '#262626',
        },
        bronze: {
          '50': '#faf2eb',
          '100': '#f5e5d6',
          '200': '#ebccad',
          '300': '#e1b284',
          '400': '#d7995b',
          '500': '#cd7f32',
          '600': '#a46628',
          '700': '#7b4c1e',
          '800': '#523314',
          '900': '#29190a',
        },
      },
    },
  },
}
