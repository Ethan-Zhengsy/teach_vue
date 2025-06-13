<template>
  <div class="user-profile-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div
        v-for="item in menuList"
        :key="item.key"
        :class="['sidebar-item', { active: activeKey === item.key }]"
        @click="activeKey = item.key"
      >
        {{ item.label }}
      </div>
    </div>
    <!-- 右侧内容区 -->
    <div class="content-area">
      <AccountInfoForm v-if="activeKey === 'account'" />
      <StudentInfoForm v-if="activeKey === 'student' && isStudent" />
      <TeacherInfoForm v-if="activeKey === 'teacher' && isTeacher" />
      <StudentJudgeView v-if="activeKey === 'judge' && isStudent" />
      <TeacherJudgeView v-if="activeKey === 'judge' && isTeacher" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AccountInfoForm from '../components/AccountInfoForm.vue'
import StudentInfoForm from '../components/StudentInfoForm.vue'
import TeacherInfoForm from '../components/TeacherInfoForm.vue'
import StudentJudgeView from '../components/StudentJudgeForm.vue'
import TeacherJudgeView from '../components/TeacherJudgeForm.vue'

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const isStudent = userInfo.userType === 'STUDENT'
const isTeacher = userInfo.userType === 'TEACHER'

const menuList = computed(() => [
  { key: 'account', label: '账户信息' },
  isStudent
    ? { key: 'student', label: '学生信息' }
    : { key: 'teacher', label: '教师信息' },
  { key: 'judge', label: '评价查看' }
])

const activeKey = ref('account')
</script>

<style scoped>
.user-profile-container {
  display: flex;
  min-height: 500px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 24px #e0e7ff33;
  margin: 40px auto;
  max-width: 900px;
}
.sidebar {
  width: 180px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 2.5rem 0 0 0;
  gap: 0.5rem;
}
.sidebar-item {
  padding: 1.1rem 2rem 1.1rem 2.2rem;
  font-size: 1.1rem;
  color: #6366f1;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.sidebar-item.active,
.sidebar-item:hover {
  background: #f0f4ff;
  color: #22223b;
  border-left: 4px solid #6366f1;
  font-weight: 700;
}
.content-area {
  flex: 1;
  padding: 2.5rem 2.5rem;
  min-width: 0;
}
</style>