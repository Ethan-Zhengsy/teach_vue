<template>
  <div>
    <!-- h2 : 页面标题 -->
    <h2>学生信息</h2>
    <!-- v-if : 根据加载状态和错误信息显示不同内容 -->
    <!-- loading : 加载状态  -->
    <div v-if="loading" class="loading">加载中...</div>
    <!-- error : 错误信息 -->
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <!-- info-list : 显示学生信息 -->
    <!-- v-else : 正常显示学生信息 -->
    <div v-else class="info-list">
      <div class="info-item"><span>姓名：</span>{{ info.name || '-' }}</div>
      <div class="info-item"><span>性别：</span>{{ genderText(info.gender) }}</div>
      <div class="info-item"><span>年级：</span>{{ info.grade || '-' }}</div>
      <div class="info-item"><span>科目：</span>{{ info.subject || '-' }}</div>
      <div class="info-item"><span>地址：</span>{{ info.address || '-' }}</div>
      <div class="info-item"><span>电话：</span>{{ info.phone || '-' }}</div>
      <div class="info-item"><span>分数：</span>{{ info.score ?? '-' }}</div>
      <div class="info-item"><span>爱好：</span>{{ info.hobby || '-' }}</div>
      <div class="info-item"><span>目标：</span>{{ info.goal || '-' }}</div>
      <div class="info-item"><span>补充说明：</span>{{ info.addition || '-' }}</div>
    </div>
  </div>
</template>

<script setup>  
import { ref, onMounted } from 'vue'
import api from '../utils/api'

// 定义响应式变量
const info = ref({})
const loading = ref(true)
const error = ref('')

// 性别转换函数
function genderText(gender) {
  if (gender === 'MALE') return '男'
  if (gender === 'FEMALE') return '女'
  if (gender === 'OTHER') return '其他'
  return '-'
}

// 组件挂载时获取学生信息
onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/user/info/student')
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