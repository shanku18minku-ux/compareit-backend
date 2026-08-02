import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: true,
    host: true,
    // Proxy API calls to local backend during development
    // Prevents CORS issues when running locally
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Increase chunk size warning limit (app has large bundles by design)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting to reduce main bundle size
        manualChunks: {
          // React core — always cached
          'vendor-react': ['react', 'react-dom'],
          // UI libs
          'vendor-ui': ['framer-motion', 'lucide-react', 'recharts'],
          // State & i18n
          'vendor-state': ['zustand', 'i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Capacitor plugins
          'vendor-capacitor': ['@capacitor/core', '@capacitor/app', '@capacitor/browser', '@capacitor/network', '@capacitor/geolocation'],
        },
      },
    },
  },

  // Optimize deps for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'framer-motion', 'lucide-react'],
  },
});
