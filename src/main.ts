import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router' // 新增：引入路由

createApp(App)
  .use(router) // 新增：使用路由
  .mount('#app')
