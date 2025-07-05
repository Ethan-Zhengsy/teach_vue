<template>
  <div class="student-home-container">
    <!-- 使用 src\components\StudentHomeForm.vue 组件 -->
    <StudentHomeForm :username="username" @fetchTeachers="fetchTeachers" />
  </div>
</template>

<script setup>
// 使用 src\components\StudentHomeForm.vue 组件
import StudentHomeForm from '../components/StudentHomeForm.vue'
</script>

<style scoped>
.student-home-container {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  width: 100%;
  max-width: 500px;
  margin: 60px auto 0 auto;
  text-align: center;
}
/* 其余样式在 StudentHomeForm.vue 中定义 */
</style>