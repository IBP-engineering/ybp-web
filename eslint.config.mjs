import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-plugin-prettier/recommended'

export default withNuxt({
  rules: {
    'vue/html-self-closing': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  prettier,
})
