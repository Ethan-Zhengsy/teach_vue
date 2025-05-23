import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StudentPageView from '../views/StudentPageView.vue'
import TeacherPageView from '../views/TeacherPageView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: TeacherPageView
  },
  {
    path: '/student',
    name: 'student',
    component: StudentPageView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
