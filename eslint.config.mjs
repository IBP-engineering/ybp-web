import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-plugin-prettier/recommended'

await withNuxt([
  {
    rules: {
      'vue/html-self-closing': 'off',
    },
  },
  prettier,
])
