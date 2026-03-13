import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (
            id.includes('/react/')
          ) {
            return 'react-vendor'
          }

          if (id.includes('/react-dom/')) {
            return 'react-dom-vendor'
          }

          if (id.includes('/react-router-dom/')) {
            return 'router-vendor'
          }

          if (
            id.includes('/@chakra-ui/') ||
            id.includes('/@emotion/')
          ) {
            return 'chakra-vendor'
          }

          if (id.includes('/react-icons/')) {
            return 'icons-vendor'
          }

          return undefined
        },
      },
    },
  },
})
