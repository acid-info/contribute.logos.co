export default [
  {
    plugins: ['tailwindcss', 'unused-imports'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
    },
    settings: {
      tailwindcss: { callees: ['cn', 'cva'], config: 'tailwind.config.cjs' },
      next: { rootDir: ['app/*/'] },
    },
    overrides: [{ files: ['*.ts', '*.tsx'], parser: '@typescript-eslint/parser' }],
  },
]
