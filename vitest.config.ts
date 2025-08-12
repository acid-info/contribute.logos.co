import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
    include: ['tests/**/*.test.ts'],
    hookTimeout: 120_000,
    testTimeout: 180_000,
    retry: 1,
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
