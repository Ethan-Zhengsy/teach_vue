<template>
  <div class="student-home-container">
    <h2>学生主页</h2>
    <p>欢迎，{{ username }}！这是您的学生专属主页。</p>
    <!-- 你可以在这里添加更多学生功能入口 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')

onMounted(() => {
  // 从 localStorage 获取用户名
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  username.value = userInfo.username || '学生'
})
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
h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #60a5fa;
  margin-bottom: 1.5rem;
}
</style>