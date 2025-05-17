import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,  // 前端端口
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8088', // 后端地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 如有需要可开启
      }
    }
  }
})
