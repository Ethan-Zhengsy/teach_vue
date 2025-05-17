<template>
  <div class="register-container">
    <!-- 使用 src\components\RegisterForm.vue 组件 -->
    <RegisterForm />
  </div>
</template>

<script setup>
// 使用 src\components\RegisterForm.vue 组件
import RegisterForm from '../components/RegisterForm.vue'
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}
/* 其余样式在 RegisterForm.vue 中定义 */
</style>
