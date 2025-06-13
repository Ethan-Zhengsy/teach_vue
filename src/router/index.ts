import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StudentPageView from '../views/StudentPageView.vue'
import TeacherPageView from '../views/TeacherPageView.vue'
import AccountEditView from '../views/AccountEditView.vue'
import AccountInfoView from '../views/AccountInfoView.vue'
import StudentInfoView from '../views/StudentInfoView.vue'
import TeacherInfoView from '../views/TeacherInfoView.vue'
import TeacherHomeView from '../views/TeacherHomeView.vue'
import StudentHomeView from '../views/StudentHomeView.vue'
import TeacherDetailView from '../views/TeacherDetailView.vue'
import StudentDetailView from '../views/StudentDetailView.vue'
import ChatSessionView from '../views/ChatSessionView.vue'
import StudentJudgesView from '../views/StudentJudgeView.vue'
import TeacherJudgesView from '../views/TeacherJudgeView.vue'
import UserProfileView from '../views/UserProfileView.vue'


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
    // 教师信息完善页面路由
    path: '/teacher/complete',
    name: 'teacher',
    component: TeacherPageView
  },
  {
    // 学生信息完善页面路由
    path: '/student/complete',
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
    // 账户信息查看页面路由
    path: '/account/info',
    name: 'accountInfo',
    component: AccountInfoView
  },
  {
    // 学生信息查看页面路由
    path: '/student/info',
    name: 'studentInfo',
    component: StudentInfoView
  },
  {
    // 教师信息查看页面路由
    path: '/teacher/info',
    name: 'teacherInfo',
    component: TeacherInfoView
  },
  {
    // 教师主页路由
    path: '/teacher/home',
    name: 'teacherHome',
    component: TeacherHomeView
  },
  {
    // 学生主页路由
    path: '/student/home',
    name: 'studentHome',
    component: StudentHomeView
  },
  {
    // 教师详情页面路由
    path: '/teacher/detail',
    name: 'teacherDetail',
    component: TeacherDetailView
  },
  {
    // 学生详情页面路由
    path: '/student/detail',
    name: 'studentDetail',
    component: StudentDetailView
  },
  {
    // 聊天页面路由
    path: '/chat/session',
    name: 'chatSession',
    component: ChatSessionView
  },
  {
    // 学生自身评价页面路由
    path: '/student/judge',
    name: 'studentJudge',
    component: StudentJudgesView
  },
  {
    // 教师评价页面路由
    path: '/teacher/judge',
    name: 'teacherJudge',
    component: TeacherJudgesView
  },
  {
    //
    path: "/user/profile",
    name: "userProfile",
    component: UserProfileView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
