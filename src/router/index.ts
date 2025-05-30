import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import StudentPageView from '../views/StudentPageView.vue'
import TeacherPageView from '../views/TeacherPageView.vue'
import AccountEditView from '../views/AccountEditView.vue'
import AccountInfoView from '../views/AccountInfoView.vue'


const routes = [
  {
    // 登录页面路由
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    // 注册页面路由
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    // 首页路由（未完成）
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    // 教师信息完善页面路由
    path: '/teacher',
    name: 'teacher',
    component: TeacherPageView
  },
  {
    // 学生信息完善页面路由
    path: '/student',
    name: 'student',
    component: StudentPageView
  },
  {
    // 账户信息编辑页面路由
    path: '/account/edit',
    name: 'accountEdit',
    component: AccountEditView
  },
  {
    path: '/account/info',
    name: 'accountInfo',
    component: AccountInfoView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
