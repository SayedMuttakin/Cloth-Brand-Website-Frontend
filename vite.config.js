import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': env.VITE_API_BASE_URL, // Proxy API requests to backend
        '/socket.io': {
          target: env.VITE_API_BASE_URL,
          ws: true
        }
      },
    },
    envPrefix: 'VITE_' // This ensures only VITE_ prefixed env variables are exposed
  }
})