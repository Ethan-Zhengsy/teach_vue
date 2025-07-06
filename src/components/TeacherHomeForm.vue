<template>
  <div>
    <!-- 右上角个人中心按钮 -->
    <button class="profile-btn" @click="goToUserProfile">
      个人中心
    </button>
    <!-- 聊天列表按钮（右上角） -->
    <button class="chat-list-btn" @click="goToChatSession">
      会话列表
      <!-- 显示未读消息数量 -->
      <span v-if="unreadCount > 0" class="unread-count">{{ unreadCount }}</span>
    </button>
    <!-- h2: 教师主页标题 -->
    <h2>教师主页</h2>
    <p>欢迎，{{ username }}！这是您的教师专属主页。</p>
    <!-- 匹配学生功能 -->
    <div class="match-student-section">
      <h3>智能匹配学生</h3>
      <form class="filter-form" @submit.prevent="fetchStudents">
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
          max="100"
          step="0.1"
          v-model.number="filter.minScore"
          placeholder="最低评分(可选)"
          style="width:120px"
        />
        <button type="submit" class="search-btn">筛选</button>
      </form>
      <!-- 学生列表 -->
      <div class="student-list">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error-msg">{{ error }}</div>
        <div v-else-if="students.length === 0" class="empty-tip">暂无推荐学生</div>
        <ul v-else>
          <li
            v-for="student in students"
            :key="student.userId"
            class="student-item"
            @click="goToStudentDetail(student.userId)"
          >
            <div class="student-main">
              <span class="student-name">{{ student.username || '学生' }}</span>
              <span class="student-gender">{{ genderText(student.gender) }}</span>
              <span class="student-grade">{{ student.grade || '-' }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="pagination">
        <button class="prev-page" @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span class="page-info">第 {{ currentPage }} 页/共 {{ totalPages }} 页</span>
        <button class="next-page" @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

// 引入 Vue Router
const router = useRouter()
const username = ref('')

// 筛选条件
const filter = ref({
  subject: '',
  grade: '',
  minScore: undefined
})

// 学生列表及状态
const students = ref([])
const loading = ref(false)
const error = ref('')
const unreadCount = ref(0)

// 定义当前页码和总页数
let currentPage = ref(1); // 当前页码
let totalPages = ref(1); // 总页数

// 获取当前教师ID
let teacherId = 0
onMounted(() => {
  // 从 localStorage 获取用户名
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  username.value = userInfo.username || '教师'
  teacherId = userInfo.userId || 0
  fetchStudents()
  fetchUnreadCount()
  // 可选：定时刷新未读数
  setInterval(fetchUnreadCount, 3000)
})

// 性别格式化
function genderText(gender) {
  if (gender === 'MALE') return '男'
  if (gender === 'FEMALE') return '女'
  if (gender === 'OTHER') return '其他'
  return '-'
}

// 查询学生
async function fetchStudents() {
  loading.value = true
  error.value = ''
  try {
    const params = {
      teacherId,
      subject: filter.value.subject || '',
      grade: filter.value.grade || '',
      minScore: filter.value.minScore || undefined,
      page: currentPage.value - 1,
      size: 6
    }
    // 如果没有筛选，subject和grade传空字符串，后端返回推荐
    const res = await api.post('/match/students/ai', params)
    if (res.status === 200 && res.data && Array.isArray(res.data.content)) {
      students.value = res.data.content
      totalPages.value = Math.ceil(res.data.totalElements / params.size);
    } else {
      students.value = []
      error.value = '未获取到学生数据'
    }
  } catch (e) {
    students.value = []
    error.value = '获取学生列表失败'
  } finally {
    loading.value = false
  }
}

// 上一页按钮逻辑
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchTeachers(); // 重新获取数据
  }
}

// 下一页按钮逻辑
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchTeachers(); // 重新获取数据
  }
}

// 获取未读消息数量
async function fetchUnreadCount() {
  try {
    const res = await api.get('/chat/UnreadMsgCount')
    if (res.status === 200 && typeof res.data === 'number') {
      unreadCount.value = res.data
    }
  } catch (e) {
    // 忽略错误
  }
}

// 跳转到学生详情页
function goToStudentDetail(userId) {
  // 假设学生详情页路由为 /student/detail?userId=xxx
  router.push({ path: '/student/detail', query: { userId } })
}

// 跳转到聊天会话页
function goToChatSession() {
  router.push({ path: '/chat/session' })
}

// 跳转到个人中心
function goToUserProfile() {
  router.push({ path: '/user/profile' })
}
</script>

<style scoped>
.teacher-home-container {
  position: relative;
}
h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #6366f1;
  margin-bottom: 1.5rem;
  position: absolute;
  top: 0px;
  left: 100px;
}
p {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 2rem;
  position: absolute;
  top: 75px;
  left: 100px;
}
.match-student-section {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 80%;
  height: 60%;
  margin: 2.5rem auto 0 auto;
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem 1rem 2rem 1rem;
  /* max-width: 480px; */
  box-shadow: 0 2px 8px #e0e7ff55;
}
.match-student-section h3 {
  text-align: center;
  font-size: 1.8rem;
  color: #6366f1;
  margin-bottom: 1.2rem;
  margin-top: 0.5rem;
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
.student-list {
  margin-top: 1rem;
}
.student-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.student-item {
  width: 27%;
  height: 80px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px #e0e7ff55;
  margin-bottom: 1rem;
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  display: flex;
}
.student-item:hover {
  box-shadow: 0 4px 16px #6366f133;
  background: #f0f4ff;
}
.student-main {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.08rem;
  font-weight: 600;
  color: #22223b;
  width: 100%;
  justify-content: flex-start;
}
.student-name {
  color: #6366f1;
  font-size: 1.15rem;
  font-weight: 700;
}
.student-gender,
.student-grade {
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
.pagination {
  position: absolute;
  bottom: 0%;
  left: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}

.pagination button {
  position: relative;
  bottom: 20px;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:hover {
  background: #f0f4ff;
}

.pagination button:disabled {
  cursor: not-allowed;
  background: #e4e6ef;
  border-color: #d1d5db;
}

.page-info {
  position: relative;
  bottom: 18px;
  margin: 0 0.5rem;
  font-size: 1rem;
  color: #64748b;
}
/* 右上角个人中心按钮样式 */
.profile-btn {
  position: absolute;
  top: 18px;
  right: 130px;
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
.profile-btn:hover {
  background: linear-gradient(90deg, #4f46e5 0%, #2563eb 100%);
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
.unread-count {
  position: absolute;
  top: 1px;
  right: 1px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 10px;
  padding: 0.1rem 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>