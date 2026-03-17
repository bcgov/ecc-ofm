import js from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

import globals from 'globals'

export default [
  js.configs.recommended,
  eslintPluginPrettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      semi: 'off',
      'eol-last': ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_', caughtErrors: 'all', caughtErrorsIgnorePattern: '^ignore' }],
    },
  },
]
