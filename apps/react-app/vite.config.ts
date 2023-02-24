import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import unoCSS from 'unocss/vite'

const srcRoot = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~': srcRoot,
    },
  },
  plugins: [
    unoCSS(),
    react(),
  ],
})
