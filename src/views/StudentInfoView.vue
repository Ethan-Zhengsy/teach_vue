<template>
  <div class="student-info-container">
    <!-- 使用 src\components\StudentInfoView.vue 组件 -->
    <StudentInfoView />
  </div>
</template>

<script setup>
// 使用 src\components\StudentInfoForm.vue 组件
import StudentInfoView from '../components/StudentInfoForm.vue'
</script>

<style scoped>
.student-info-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
}
/* 其余样式在 StudentInfoForm.vue 中定义 */
</style>