import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true // listen on all addresses, including LAN/network connections
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Improve production build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Add environment variables prefix
  envPrefix: 'VITE_'
})