import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // resolve: {
  //   alias: {
  //     '@': '/src' // 设置 @ 指向 src 目录
  //   }
  // },
  server: {
    // 设置服务器配置
    port: 8080,  // 前端端口
    host: true,  // 允许外部访问
    proxy: {
      '/api': {
        target: 'http://localhost:8088', // 后端地址
        changeOrigin: true, // 是否跨域
        // rewrite: (path) => path.replace(/^\/api/, '') // 如有需要可开启
      }
    }
  }
})
