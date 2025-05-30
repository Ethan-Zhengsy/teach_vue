<template>
  <div class="user-info-container">
    <!-- 使用 src\components\AccountInfoForm.vue 组件 -->
     <AccountInfoForm />
  </div>
</template>

<script setup>
// 使用 src\components\AccountInfoForm.vue 组件
import AccountInfoForm from '../components/AccountInfoForm.vue'
</script>

<style scoped>
.user-info-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
}
/* 其余样式在 AccountInfoForm.vue 中定义 */
</style>