import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to backend
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    },
  },
  envPrefix: 'VITE_' // This ensures only VITE_ prefixed env variables are exposed
})