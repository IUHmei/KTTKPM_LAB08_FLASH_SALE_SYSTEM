import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/products': {
        target: 'http://172.16.40.5:8081',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://172.16.35.173:8082',
        changeOrigin: true,
      },
      '/checkout': {
        target: 'http://172.16.35.47:8083',
        changeOrigin: true,
      },
      '/stock': {
        target: 'http://172.16.35.42:8084',
        changeOrigin: true,
      },
    }
  }
})
