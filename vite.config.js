import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@layouts': '/src/layouts',
      '@pages': '/src/pages',
      '@assets': '/src/assets',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@contexts': '/src/contexts',
      '@services': '/src/services',
      '@styles': '/src/styles',
      '@config': '/src/config'
    },
  },

})
