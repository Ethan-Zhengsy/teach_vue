import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // 新增：引入路由

createApp(App)
  .use(router) // 新增：使用路由
  .mount('#app')
