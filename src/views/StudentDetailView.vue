<template>
  <div class="student-detail-container">
    <!-- 使用 src\components\StudentDetailForm.vue 组件 -->
    <StudentDetailForm />
  </div>
</template>

<script setup>
// 使用 src\components\StudentDetailForm.vue 组件
import StudentDetailForm from '../components/StudentDetailForm.vue'
</script>

<style scoped>
.student-detail-container {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  width: 100%;
  max-width: 500px;
  margin: 60px auto 0 auto;
  text-align: center;
}
/* 其余样式在 StudentDetailForm.vue 中定义 */
</style>