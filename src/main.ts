import { createApp } from 'vue'           // 引入 Vue.js
import './style.css'                      // 引入全局样式
import App from './App.vue'               // 引入根组件
import router from './router'             // 引入路由
import { createPinia } from 'pinia'       // 引入 Pinia 状态管理库
import ElementPlus from 'element-plus'    // 引入 Element Plus 组件库
import 'element-plus/dist/index.css'      // 引入 Element Plus 样式

createApp(App)
  .use(createPinia())   // 使用 Pinia 状态管理库
  .use(ElementPlus)     // 使用 Element Plus
  .use(router)          // 使用路由
  .mount('#app')        // 挂载应用到 DOM
