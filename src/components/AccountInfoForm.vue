<template>
  <div>
    <h2>个人信息</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else class="info-list">
      <div class="info-item"><span>用户ID：</span>{{ userInfo.userId || '-' }}</div>
      <div class="info-item"><span>用户名：</span>{{ userInfo.username || '-' }}</div>
      <div class="info-item"><span>邮箱：</span>{{ userInfo.email || '-' }}</div>
      <div class="info-item"><span>身份：</span>{{ userInfo.userType === 'TEACHER' ? '老师' : userInfo.userType === 'STUDENT' ? '学生' : '-' }}</div>
      <div class="info-item"><span>修改时间：</span>{{ userInfo.createTime || '-' }}</div>
    </div>
    <p style="text-align:center;margin-top:5rem;">
      <router-link to="/account/edit">修改账户信息</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

const userInfo = ref({})
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/user/info/user')
    if (res.status === 200 && res.data) {
      userInfo.value = res.data
    } else {
      error.value = '获取信息失败'
    }
  } catch (e) {
    error.value = '获取信息失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>  
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}
.info-list {
  margin-top: 1rem;
}
.info-item {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}
.info-item span {
  color: #888;
  margin-right: 8px;
}
.loading {
  text-align: center;
  color: #888;
}
.error-msg {
  color: #ff4d4f;
  text-align: center;
  margin-top: 1rem;
}
</style>