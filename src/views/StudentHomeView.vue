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
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  /* 去除圆角和阴影，适配全屏 */
}
/* 其余样式在 StudentHomeForm.vue 中定义 */
</style>