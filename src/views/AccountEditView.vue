<template>
  <div class="account-edit-container">
    <!-- 使用 src\components\AccountEditForm.vue 组件 -->
    <AccountEditForm />
  </div>
</template>

<script setup>
// 使用 src\components\AccountEditForm.vue 组件
import AccountEditForm from '../components/AccountEditForm.vue'
</script>

<style scoped>
.account-edit-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
}
/* 其余样式在 AccountEditForm.vue 中定义 */
</style>