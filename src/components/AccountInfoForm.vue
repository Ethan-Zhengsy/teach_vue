<template>
  <div>
    <!-- h2 : 页面标题 -->
    <h2>个人信息</h2>
    <!-- 头像显示区域 -->
    <div class="avatar-info">
      <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" class="avatar-img" />
      <div v-else class="avatar-placeholder">无头像</div>
    </div>
    <!-- v-if : 条件渲染 -->
    <!-- loading : 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    <!-- v-else-if : 条件渲染 -->
    <!-- error : 错误信息 -->
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <!-- v-else : 正常显示用户信息 -->
    <!-- userInfo : 用户信息 -->
    <div v-else class="info-list">
      <div class="info-item"><span>用户ID：</span>{{ userInfo.userId || '-' }}</div>
      <div class="info-item"><span>用户名：</span>{{ userInfo.username || '-' }}</div>
      <div class="info-item"><span>邮箱：</span>{{ userInfo.email || '-' }}</div>
      <div class="info-item"><span>身份：</span>{{ userInfo.userType === 'TEACHER' ? '老师' : userInfo.userType === 'STUDENT' ? '学生' : '-' }}</div>
      <div class="info-item"><span>修改时间：</span>{{ userInfo.createTime || '-' }}</div>
    </div>
    <!-- 跳转到修改账户信息 -->
    <!-- router-link : 路由链接 -->
    <!-- to : 目标路由 -->
    <p style="text-align:center;margin-top:5rem;">
      <router-link to="/account/edit">修改账户信息</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

// 定义响应式变量
const userInfo = ref({})
const loading = ref(true)
const error = ref('')

// 获取用户信息的函数
onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/user/info/user')
    if (res.status === 200 && res.data) {
      userInfo.value = { ...res.data }
      // 优先请求头像接口
      const avatarRes = await api.get('/file/listavatar', { params: { userId: userInfo.value.userId } })
      if (avatarRes.status === 200 && avatarRes.data) {
        userInfo.value.avatar = avatarRes.data
      } else {
        // 如果头像接口没有返回，则用 userInfo 自带的 avatar 字段或本地缓存
        const localAvatar = (() => {
          try {
            return JSON.parse(localStorage.getItem('userInfo') || '{}').avatar || ''
          } catch { return '' }
        })()
        userInfo.value.avatar = userInfo.value.avatar || localAvatar
      }
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
.avatar-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}
.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
  border: 1px solid #eee;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid #eee;
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