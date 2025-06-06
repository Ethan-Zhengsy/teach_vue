<template>
  <div>
    <!-- h2 : 页面标题 -->
    <h2>学生详细信息</h2>
    <!-- v-if : 根据加载状态和错误信息显示不同内容 -->
    <!-- loading : 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    <!-- error : 错误信息 -->
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <!-- info-list : 显示学生信息 -->
    <!-- v-else : 正常显示学生信息 -->
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
    <!-- chat-btn-wrap: 会话按钮 -->
    <div class="chat-btn-wrap">
      <button class="chat-btn" @click="startChat" :disabled="chatLoading">
        {{ chatLoading ? '进入中...' : '私聊会话' }}
      </button>
      <div v-if="chatError" class="chat-error">{{ chatError }}</div>
    </div>
    <!-- judge-section: 评价展示区域 -->
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
import { useRoute, useRouter } from 'vue-router'
import api from '../utils/api'

// 定义响应式变量
const route = useRoute()
const router = useRouter()
const info = ref({})
const loading = ref(true)
const error = ref('')

// 评价相关
const judges = ref([])
const judgeLoading = ref(true)
const judgeError = ref('')

// 聊天相关
const chatLoading = ref(false)
const chatError = ref('')
const isTeacher = ref(false)

// 性别转换函数
function genderText(gender) {
  if (gender === 'MALE') return '男'
  if (gender === 'FEMALE') return '女'
  if (gender === 'OTHER') return '其他'
  return '-'
}

// 页面加载时获取学生信息和评价
onMounted(async () => {
  // 判断当前用户是否为教师
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  isTeacher.value = userInfo.userType === 'TEACHER'

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
      // 只显示当前学生的评价（如有 toId 字段）
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

// 私聊会话
async function startChat() {
  chatLoading.value = true
  chatError.value = ''
  try {
    const studentUserId = Number(route.query.userId)
    const res = await api.post('/chat/sessions', studentUserId)
    if (res.status === 200 && res.data && res.data.sessionId) {
      // 跳转到会话页面，假设路由为 /chat/session?sessionId=xxx
      router.push({ path: '/chat/session', query: { sessionId: res.data.sessionId } })
    } else {
      chatError.value = '进入会话失败'
    }
  } catch (e) {
    chatError.value = '进入会话失败'
  } finally {
    chatLoading.value = false
  }
}
</script>

<style scoped>
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
.chat-btn-wrap {
  margin: 2rem 0 1rem 0;
  text-align: center;
}
.chat-btn {
  padding: 0.7rem 2.2rem;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}
.chat-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #4f46e5 0%, #2563eb 100%);
}
.chat-error {
  color: #ff4d4f;
  margin-top: 0.5rem;
  font-size: 0.98rem;
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