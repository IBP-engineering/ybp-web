import prettier from 'eslint-plugin-prettier/recommended'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    rules: {
      'vue/html-self-closing': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
]).prepend({
  ignores: [
    '.nuxt',
    '.env',
    'dist',
    'node_modules',
    'package.json',
    'scripts',
    '*.svg',
  ],
})
