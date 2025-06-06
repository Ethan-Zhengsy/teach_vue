<template>
  <div class="teacher-home-container">
    <!-- 使用 src\components\TeacherHomeForm.vue 组件 -->
    <TeacherHomeView />
  </div>
</template>

<script setup>
// 使用 src\components\TeacherHomeForm.vue 组件
import TeacherHomeView from '../components/TeacherHomeForm.vue'
</script>

<style scoped>
.teacher-home-container {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  width: 100%;
  max-width: 500px;
  margin: 60px auto 0 auto;
  text-align: center;
}
/* 其余样式在 TeacherHomeForm.vue 中定义 */
</style>