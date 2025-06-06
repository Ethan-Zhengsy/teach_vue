<template>
  <div>
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

// 获取当前教师ID
let teacherId = 0
onMounted(() => {
  // 从 localStorage 获取用户名
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  username.value = userInfo.username || '教师'
  teacherId = userInfo.userId || 0
  fetchStudents()
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
      page: 0,
      size: 10
    }
    // 如果没有筛选，subject和grade传空字符串，后端返回推荐
    const res = await api.post('/match/students/ai', params)
    if (res.status === 200 && res.data && Array.isArray(res.data.content)) {
      students.value = res.data.content
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

// 跳转到学生详情页
function goToStudentDetail(userId) {
  // 假设学生详情页路由为 /student/detail?userId=xxx
  router.push({ path: '/student/detail', query: { userId } })
}
</script>

<style scoped>  
h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #6366f1;
  margin-bottom: 1.5rem;
}
.match-student-section {
  margin: 2.5rem auto 0 auto;
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem 1rem 2rem 1rem;
  max-width: 480px;
  box-shadow: 0 2px 8px #e0e7ff55;
}
.match-student-section h3 {
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
.student-list {
  margin-top: 1rem;
}
.student-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.student-item {
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
</style>