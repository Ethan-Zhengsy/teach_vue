<template>
  <div class="teacher-detail-container">
    <h2>教师详细信息</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else class="info-list">
      <div class="info-item"><span>用户名：</span>{{ info.username || '-' }}</div>
      <div class="info-item"><span>性别：</span>{{ genderText(info.gender) }}</div>
      <div class="info-item"><span>学历：</span>{{ educationText(info.education) }}</div>
      <div class="info-item"><span>评分：</span>{{ info.score ?? '-' }}</div>
      <div class="info-item"><span>授课年级：</span>{{ info.teachGrade || '-' }}</div>
      <div class="info-item"><span>授课科目：</span>{{ info.subject || '-' }}</div>
      <div class="info-item"><span>教龄：</span>{{ info.experience ?? '-' }} 年</div>
      <div class="info-item"><span>爱好：</span>{{ info.hobby || '-' }}</div>
      <div class="info-item"><span>毕业院校：</span>{{ info.school || '-' }}</div>
      <div class="info-item"><span>地址：</span>{{ info.address || '-' }}</div>
      <div class="info-item"><span>电话：</span>{{ info.phone || '-' }}</div>
      <div class="info-item"><span>补充说明：</span>{{ info.addition || '-' }}</div>
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

function genderText(gender) {
  if (gender === 'MALE') return '男'
  if (gender === 'FEMALE') return '女'
  if (gender === 'OTHER') return '其他'
  return '-'
}
function educationText(edu) {
  if (edu === 'BACHELOR') return '本科'
  if (edu === 'MASTER') return '硕士'
  if (edu === 'DOCTOR') return '博士'
  if (edu === 'OTHER') return '其他'
  return '-'
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const userId = route.query.userId
    // 如果后端接口需要参数在 params 里
    const res = await api.get('/user/info/teacher', { params: { userId } })
    if (res.status === 200 && res.data) {
      info.value = res.data
    } else {
      error.value = '获取教师信息失败'
    }
  } catch (e) {
    error.value = '获取教师信息失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.teacher-detail-container {
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
  color: #6366f1;
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