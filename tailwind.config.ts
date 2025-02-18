import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import animate from 'tailwindcss-animate'
import { setupInspiraUI } from '@inspira-ui/plugins'

export default <Partial<Config>>{
  darkMode: 'selector',
  safelist: ['dark'],
  prefix: '',
  content: [],
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animate, setupInspiraUI],
}
