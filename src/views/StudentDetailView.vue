<template>
  <div class="student-detail-container">
    <h2>学生详细信息</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else class="info-list">
      <div class="info-item"><span>用户名：</span>{{ info.username || '-' }}</div>
      <div class="info-item"><span>性别：</span>{{ genderText(info.gender) }}</div>
      <div class="info-item"><span>年级：</span>{{ info.grade || '-' }}</div>
      <div class="info-item"><span>科目：</span>{{ info.subject || '-' }}</div>
      <div class="info-item"><span>评分：</span>{{ info.score ?? '-' }}</div>
      <div class="info-item"><span>爱好：</span>{{ info.hobby || '-' }}</div>
      <div class="info-item"><span>目标：</span>{{ info.goal || '-' }}</div>
      <div class="info-item"><span>补充说明：</span>{{ info.addition || '-' }}</div>
      <div class="info-item"><span>地址：</span>{{ info.address || '-' }}</div>
      <div class="info-item"><span>电话：</span>{{ info.phone || '-' }}</div>
    </div>
    <!-- 评价展示区域 -->
    <div class="judge-section">
      <h3>评价</h3>
      <div v-if="judgeLoading" class="loading">评价加载中...</div>
      <div v-else-if="judgeError" class="error-msg">{{ judgeError }}</div>
      <ul v-else-if="judges.length > 0" class="judge-list">
        <li v-for="(j, idx) in judges" :key="idx" class="judge-item">
          <span class="judge-from">来自用户ID: {{ j.fromId }}</span>
          <span class="judge-content">{{ j.content || '无内容' }}</span>
        </li>
      </ul>
      <div v-else class="empty-tip">暂无评价</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/api'

const route = useRoute()
const info = ref({})
const loading = ref(true)
const error = ref('')

// 评价相关
const judges = ref([])
const judgeLoading = ref(true)
const judgeError = ref('')

function genderText(gender) {
  if (gender === 'MALE') return '男'
  if (gender === 'FEMALE') return '女'
  if (gender === 'OTHER') return '其他'
  return '-'
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const userId = route.query.userId
    // 获取学生详细信息
    const res = await api.get('/user/info/student', { params: { userId } })
    if (res.status === 200 && res.data) {
      info.value = res.data
    } else {
      error.value = '获取学生信息失败'
    }
  } catch (e) {
    error.value = '获取学生信息失败'
  } finally {
    loading.value = false
  }

  // 获取评价
  judgeLoading.value = true
  judgeError.value = ''
  try {
    const res = await api.get('/interaction/queryjudge')
    if (res.status === 200 && Array.isArray(res.data)) {
      // 只显示当前学生的评价
      const userIdNum = Number(route.query.userId)
      // 如果后端字段不是 toId，请用实际字段名
      judges.value = res.data.filter(j => j && j.content && j.toId === userIdNum)
    } else {
      judges.value = []
      judgeError.value = '未获取到评价'
    }
  } catch (e) {
    judges.value = []
    judgeError.value = '获取评价失败'
  } finally {
    judgeLoading.value = false
  }
})
</script>

<style scoped>
.student-detail-container {
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
.info-list {
  margin-top: 1rem;
  text-align: left;
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
.judge-section {
  margin-top: 2rem;
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  text-align: left;
}
.judge-section h3 {
  color: #60a5fa;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.judge-list {
  list-style: none;
  padding: 0;
  margin: 0;
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