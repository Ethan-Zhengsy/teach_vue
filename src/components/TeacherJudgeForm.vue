<template>
  <div>
    <h2>收到的评价</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <ul v-else-if="judges.length > 0" class="judge-list">
      <li v-for="(j, idx) in judges" :key="idx" class="judge-item">
        <span class="judge-from">来自用户ID: {{ j.fromId }}</span>
        <span class="judge-content">{{ j.content || '无内容' }}</span>
      </li>
    </ul>
    <div v-else class="empty-tip">暂无评价</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

const judges = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    // 获取当前教师ID
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const userId = -1
    // 请求评价接口，id为当前教师ID
    const res = await api.get('/interaction/queryjudge', { params: { id: userId } })
    if (res.status === 200 && Array.isArray(res.data)) {
      judges.value = res.data.filter(j => j && j.content)
    } else {
      judges.value = []
      error.value = '未获取到评价'
    }
  } catch (e) {
    judges.value = []
    error.value = '获取评价失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #60a5fa;
  margin-bottom: 1.5rem;
}
.judge-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}
.judge-item {
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  color: #22223b;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.judge-from {
  color: #60a5fa;
  font-size: 0.95rem;
}
.judge-content {
  color: #333;
  font-size: 1.05rem;
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
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 1rem 0;
}
</style>