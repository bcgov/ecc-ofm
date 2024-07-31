import js from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

const globals = import('globals')

export default [
  js.configs.recommended,
  eslintPluginPrettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        // This doesn't seem to be working as expected hence the user-defined globals
        ...globals.node,
        __dirname: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
      },
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
