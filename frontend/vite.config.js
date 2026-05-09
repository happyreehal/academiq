import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    
    // Manual chunks (function syntax for Vite v8)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // Animation libraries
          if (id.includes('node_modules/framer-motion') || 
              id.includes('node_modules/lenis')) {
            return 'animation-vendor';
          }
          
          // HTTP client
          if (id.includes('node_modules/axios')) {
            return 'http-vendor';
          }
        },
      },
    },
    
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lenis', 'axios'],
  },
})