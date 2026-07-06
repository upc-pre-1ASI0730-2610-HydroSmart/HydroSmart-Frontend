import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so built assets work when the site is served from the
  // root or from a subpath (Netlify, GitHub Pages, etc.). The previous value
  // '/HydroSmart-Frontend/' caused assets to be requested from that absolute
  // path which made the deployed site show a blank page due to 404s on bundles.
  base: './',
  plugins: [
    vue(),
    vueDevTools({
      enabled: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://hydrosmart-backend-jlh9.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  }
})
