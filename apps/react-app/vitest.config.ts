import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const srcRoot = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~': srcRoot,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: 'verbose',
    setupFiles: [
      './test/vitest.setup',
    ],
  },
})
