import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  eslintPluginPrettier,
  {
    name: 'CD/CI',
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: {
      semi: ['error', 'always'],
      'eol-last': ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
    }
  }
]

