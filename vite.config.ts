import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react'
            }
            if (id.includes('recharts')) {
              return 'recharts'
            }
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('lucide-react')) {
              return 'ui'
            }
            if (id.includes('framer-motion')) {
              return 'motion'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
