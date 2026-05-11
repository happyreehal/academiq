import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }

          // Three.js ecosystem
          if (id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three')) {
            return 'three-vendor';
          }

          // Animation libraries
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/lenis') ||
              id.includes('node_modules/gsap')) {
            return 'animation-vendor';
          }

          // HTTP client
          if (id.includes('node_modules/axios')) {
            return 'http-vendor';
          }

          // PDF generation
          if (id.includes('node_modules/jspdf') ||
              id.includes('node_modules/html2canvas')) {
            return 'pdf-vendor';
          }

          // UI components
          if (id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/embla-carousel')) {
            return 'ui-vendor';
          }

          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'date-vendor';
          }
        },
        // ✅ FIXED: Safe asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const info = name.split('.');
          const ext = info[info.length - 1] || '';
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    chunkSizeWarningLimit: 500,
    sourcemap: false,
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lenis',
      'axios',
      'gsap',
    ],
    exclude: [
      'jspdf',
      'html2canvas',
    ],
  },
}));