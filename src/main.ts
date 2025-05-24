import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router' // 新增：引入路由

createApp(App)
  .use(createPinia())
  .use(ElementPlus) // 新增：使用 Element Plus
  .use(router) // 新增：使用路由
  .mount('#app')
