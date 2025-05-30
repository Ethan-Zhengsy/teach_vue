<template>
  <div>
    <!-- h2 : 页面标题 -->
    <h2>教师信息</h2>
    <!-- v-if : 根据加载状态和错误信息显示不同内容 -->
    <!-- loading : 加载状态  -->
    <div v-if="loading" class="loading">加载中...</div>
    <!-- error : 错误信息 -->
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else class="info-list">
      <div class="info-item"><span>姓名：</span>{{ info.name || '-' }}</div>
      <div class="info-item"><span>性别：</span>{{ genderText(info.gender) }}</div>
      <div class="info-item"><span>学历：</span>{{ educationText(info.education) }}</div>
      <div class="info-item"><span>授课年级：</span>{{ info.teachGrade || '-' }}</div>
      <div class="info-item"><span>授课科目：</span>{{ info.subject || '-' }}</div>
      <div class="info-item"><span>地址：</span>{{ info.address || '-' }}</div>
      <div class="info-item"><span>电话：</span>{{ info.phone || '-' }}</div>
      <div class="info-item"><span>教龄：</span>{{ info.experience ?? '-' }}</div>
      <div class="info-item"><span>评分：</span>{{ info.score ?? '-' }}</div>
      <div class="info-item"><span>爱好：</span>{{ info.hobby || '-' }}</div>
      <div class="info-item"><span>毕业院校：</span>{{ info.school || '-' }}</div>
      <div class="info-item"><span>补充说明：</span>{{ info.addition || '-' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

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
    const res = await api.get('/user/info/teacher')
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