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