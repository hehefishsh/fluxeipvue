import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@fullcalendar/vue': '@fullcalendar/vue3',  // 將這裡放在一起
    },
  },
  server: {
    proxy: {
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
})

