<template>
  <div class="login-container">
    <!-- 使用 src\components\LoginForm.vue 组件 -->
    <LoginForm />
  </div>
</template>

<script setup>
// 使用 src\components\LoginForm.vue 组件
import LoginForm from '../components/LoginForm.vue'
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}
/* 其余样式在 LoginForm.vue 中定义 */
</style>
