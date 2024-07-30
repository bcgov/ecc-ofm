import js from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginVue from 'eslint-plugin-vue'

export default [
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintPluginPrettier,
  {
    ignores: ['dist/', 'test/'],
  },
  {
    rules: {
      semi: 'off',
    },
  },
]
