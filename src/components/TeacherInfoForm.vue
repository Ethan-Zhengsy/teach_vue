<template>
  <div>
    <!-- h2 : 页面标题 -->
    <h2>教师信息</h2>
    <!-- v-if : 根据加载状态和错误信息显示不同内容 -->
    <!-- loading : 加载状态  -->
    <div v-if="loading" class="loading">加载中...</div>
    <!-- error : 错误信息 -->
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <!-- info-list : 教师信息列表 -->
    <!-- v-else : 显示教师信息 -->
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

    <!-- 文件列表区域 -->
    <div class="file-list-section">
      <h3>我的文件</h3>
      <div v-if="fileLoading" class="loading">文件加载中...</div>
      <div v-else-if="fileError" class="error-msg">{{ fileError }}</div>
      <ul v-else-if="files.length > 0" class="file-list">
        <li v-for="(url, idx) in files" :key="idx">
          <a :href="url" target="_blank" rel="noopener">查看/下载文件{{ idx + 1 }}</a>
        </li>
      </ul>
      <div v-else class="empty-tip">暂无文件</div>
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

// 文件相关
const files = ref([])
const fileLoading = ref(true)
const fileError = ref('')

// 定义函数用于格式化性别
function genderText(gender) {
  if (gender === 'MALE') return '男'
  if (gender === 'FEMALE') return '女'
  if (gender === 'OTHER') return '其他'
  return '-'
}
// 定义函数用于格式化学历
function educationText(edu) {
  if (edu === 'BACHELOR') return '本科'
  if (edu === 'MASTER') return '硕士'
  if (edu === 'DOCTOR') return '博士'
  if (edu === 'OTHER') return '其他'
  return '-'
}

// 信息获取函数
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

  // 获取文件列表
  fileLoading.value = true
  fileError.value = ''
  try {
    const res = await api.get('/file/list')
    if (res.status === 200 && Array.isArray(res.data)) {
      files.value = res.data.filter(Boolean)
    } else {
      fileError.value = '文件获取失败'
    }
  } catch (e) {
    fileError.value = '文件获取失败'
  } finally {
    fileLoading.value = false
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
.file-list-section {
  margin-top: 2rem;
  background: #fafbfc;
  border-radius: 6px;
  padding: 1rem;
}
.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.file-list li {
  margin-bottom: 0.5rem;
}
.file-list a {
  color: #1890ff;
  text-decoration: underline;
  word-break: break-all;
}
.empty-tip {
  color: #aaa;
  font-size: 0.95rem;
}
</style>