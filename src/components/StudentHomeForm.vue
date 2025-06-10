<template>
  <div>
    <!-- 聊天列表按钮（右上角） -->
    <button class="chat-list-btn" @click="goToChatSession">
      会话列表
    </button>
    <!-- h2：学生主页 -->
    <h2>学生主页</h2>
    <p>欢迎，{{ username }}！这是您的学生专属主页。</p>
    <!-- 匹配教师功能 -->
    <div class="match-teacher-section">
      <h3>智能匹配教师</h3>
      <form class="filter-form" @submit.prevent="fetchTeachers">
        <select v-model="filter.subject">
          <option value="">选择科目</option>
          <option value="数学">数学</option>
          <option value="语文">语文</option>
          <option value="英语">英语</option>
          <option value="物理">物理</option>
          <option value="化学">化学</option>
          <option value="生物">生物</option>
          <option value="历史">历史</option>
          <option value="地理">地理</option>
          <option value="政治">政治</option>
        </select>
        <select v-model="filter.grade">
          <option value="">选择年级</option>
          <option value="小学">小学</option>
          <option value="初中">初中</option>
          <option value="高中">高中</option>
        </select>
        <input
          type="number"
          min="0"
          max="150"
          step="1"
          v-model.number="filter.minScore"
          placeholder="最低成绩(可选)"
          style="width:120px"
        />
        <button type="submit" class="search-btn">筛选</button>
      </form>
      <!-- 教师列表 -->
      <div class="teacher-list">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error-msg">{{ error }}</div>
        <div v-else-if="teachers.length === 0" class="empty-tip">暂无推荐教师</div>
        <!-- 推荐教师列表部分 -->
        <ul v-else>
          <li
            v-for="teacher in teachers"
            :key="teacher.userId"
            class="teacher-item"
            @click="goToTeacherDetail(teacher.userId)"
          >
            <div class="teacher-main">
              <span class="teacher-name">{{ teacher.username || '教师' }}</span>
              <span class="teacher-gender">{{ genderText(teacher.gender) }}</span>
              <span class="teacher-edu">{{ educationText(teacher.education) }}</span>
              <span class="teacher-score">评分: {{ teacher.score ?? '-' }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

// 引入路由和API工具
const router = useRouter()
const username = ref('')

// 筛选条件
const filter = ref({
  subject: '',
  grade: '',
  minScore: undefined
})

// 教师列表及状态
const teachers = ref([])
const loading = ref(false)
const error = ref('')

// 获取当前学生ID
let studentId = 0
onMounted(() => {
  // 从 localStorage 获取用户名
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  username.value = userInfo.username || '学生'
  studentId = userInfo.userId || 0
  fetchTeachers()
})

// 性别/学历格式化
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

// 查询教师
async function fetchTeachers() {
  loading.value = true
  error.value = ''
  try {
    const params = {
      studentId,
      subject: filter.value.subject || '',
      grade: filter.value.grade || '',
      minScore: filter.value.minScore || undefined,
      page: 0,
      size: 10
    }
    // 如果没有筛选，subject和grade传空字符串，后端返回推荐
    const res = await api.post('/match/teachers/ai', params)
    if (res.status === 200 && res.data && Array.isArray(res.data.content)) {
      teachers.value = res.data.content
    } else {
      teachers.value = []
      error.value = '未获取到教师数据'
    }
  } catch (e) {
    teachers.value = []
    error.value = '获取教师列表失败'
  } finally {
    loading.value = false
  }
}

// 跳转到教师详情页
function goToTeacherDetail(userId) {
  // 假设教师详情页路由为 /teacher/detail?userId=xxx
  router.push({ path: '/teacher/detail', query: { userId } })
}

// 跳转到聊天会话页
function goToChatSession() {
  router.push({ path: '/chat/session' })
}
</script>

<style scoped>
h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #60a5fa;
  margin-bottom: 1.5rem;
}
.match-teacher-section {
  margin: 2.5rem auto 0 auto;
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem 1rem 2rem 1rem;
  max-width: 480px;
  box-shadow: 0 2px 8px #e0e7ff55;
}
.match-teacher-section h3 {
  text-align: center;
  font-size: 1.3rem;
  color: #6366f1;
  margin-bottom: 1.2rem;
  font-weight: 700;
}
.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.filter-form select,
.filter-form input {
  padding: 0.5rem 0.8rem;
  border: 1.2px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  color: #22223b;
  min-width: 110px;
}
.search-btn {
  padding: 0.5rem 1.2rem;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.search-btn:hover {
  background: linear-gradient(90deg, #4f46e5 0%, #2563eb 100%);
}
.teacher-list {
  margin-top: 1rem;
}
.teacher-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.teacher-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px #e0e7ff55;
  margin-bottom: 1rem;
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  display: flex;
}
.teacher-item:hover {
  box-shadow: 0 4px 16px #6366f133;
  background: #f0f4ff;
}
.teacher-main {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.08rem;
  font-weight: 600;
  color: #22223b;
  width: 100%;
  justify-content: flex-start;
}
.teacher-name {
  color: #6366f1;
  font-size: 1.15rem;
  font-weight: 700;
}
.teacher-gender,
.teacher-edu,
.teacher-score {
  color: #64748b;
  font-size: 0.98rem;
  font-weight: 500;
}
.loading {
  text-align: center;
  color: #888;
  margin: 1.5rem 0;
}
.error-msg {
  color: #ff4d4f;
  text-align: center;
  margin: 1.5rem 0;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 1.5rem 0;
}
/* 聊天按钮样式 */
.chat-list-btn {
  position: absolute;
  top: 18px;
  right: 24px;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.chat-list-btn:hover {
  background: linear-gradient(90deg, #4f46e5 0%, #2563eb 100%);
}
</style>