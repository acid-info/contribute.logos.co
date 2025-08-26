import tsParser from '@typescript-eslint/parser'
import unusedImports from 'eslint-plugin-unused-imports'

/** @type {import('eslint').Linter.Config} */
const config = [
  {
    ignores: ['.next/**', 'out/**', 'dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
    },
    settings: {
      next: { rootDir: ['app/*/'] },
    },
  },
]

export default config
