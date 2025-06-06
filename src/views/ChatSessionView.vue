<template>
  <div class="chat-session-container">
    <!-- 左侧会话列表 -->
    <div class="chat-list">
      <div class="chat-list-title">
        会话列表
        <span v-if="unreadCount > 0" class="unread-dot">{{ unreadCount }}</span>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>
      <ul v-else>
        <li
          v-for="session in sessions"
          :key="session.sessionId"
          :class="['chat-list-item', { active: session.sessionId === activeSessionId }]"
          @click="selectSession(session.sessionId)"
        >
          <div class="chat-user">
            <span class="chat-name">
              {{ getSessionName(session) }}
            </span>
            <span v-if="session.unreadMsgCount > 0" class="unread-badge">{{ session.unreadMsgCount }}</span>
          </div>
          <div class="chat-last-msg">{{ session.lastMessageContent || '暂无消息' }}</div>
          <div class="chat-last-time">{{ formatTime(session.lastMessageTime) }}</div>
        </li>
      </ul>
    </div>
    <!-- 右侧聊天窗口 -->
    <div class="chat-window">
      <div v-if="!activeSessionId" class="empty-chat">请选择左侧会话</div>
      <ChatWindow v-else :session-id="activeSessionId" :session="activeSession" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../utils/api'
import ChatWindow from '../components/ChatWindow.vue'

const sessions = ref([])
const loading = ref(true)
const error = ref('')
const activeSessionId = ref(null)
const unreadCount = ref(0)

const activeSession = computed(() =>
  sessions.value.find(s => s.sessionId === activeSessionId.value)
)

onMounted(() => {
  fetchSessions()
  fetchUnreadCount()
})

async function fetchSessions() {
  loading.value = true
  error.value = ''
  try {
    // 这里如需分页可加参数
    const res = await api.get('/chat/sessions', { data: { page: 0, size: 10 } })
    if (res.status === 200 && res.data && Array.isArray(res.data.content)) {
      sessions.value = res.data.content
      // 默认选中第一个会话
      if (sessions.value.length > 0) {
        activeSessionId.value = sessions.value[0].sessionId
      }
    } else {
      error.value = '未获取到会话列表'
    }
  } catch (e) {
    error.value = '获取会话列表失败'
  } finally {
    loading.value = false
  }
}

async function fetchUnreadCount() {
  try {
    const res = await api.get('/chat/UnreadMsgCount')
    if (res.status === 200 && typeof res.data === 'number') {
      unreadCount.value = res.data
    }
  } catch (e) {
    // 可忽略错误
  }
}

function selectSession(sessionId) {
  activeSessionId.value = sessionId
  // 立即将该会话的未读数设为0
  const session = sessions.value.find(s => s.sessionId === sessionId)
  if (session && session.unreadMsgCount > 0) {
    // 先减去本会话的未读数
    unreadCount.value = Math.max(0, unreadCount.value - session.unreadMsgCount)
    session.unreadMsgCount = 0
  }
}

function getSessionName(session) {
  // 当前用户是老师还是学生可根据本地 userInfo 判断
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  if (userInfo.userType === 'TEACHER') {
    return session.studentName || '学生'
  } else if (userInfo.userType === 'STUDENT') {
    return session.teacherName || '老师'
  }
  return session.teacherName || session.studentName || '用户'
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  // 简单格式化
  return timeStr.replace('T', ' ').slice(0, 16)
}
</script>

<style scoped>
.chat-session-container {
  display: flex;
  height: 80vh;
  background: #f4f6fa;
  border-radius: 12px;
  box-shadow: 0 4px 24px #e0e7ff55;
  overflow: hidden;
}
.chat-list {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 0;
}
.chat-list-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #6366f1;
  padding: 1.2rem 1rem 0.8rem 1.2rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}
.unread-dot {
  display: inline-block;
  background: #ff4d4f;
  color: #fff;
  border-radius: 12px;
  padding: 0 8px;
  font-size: 0.95rem;
  margin-left: 8px;
  vertical-align: middle;
  min-width: 22px;
  text-align: center;
}
.chat-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
}
.chat-list-item {
  padding: 1rem 1.2rem 0.7rem 1.2rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;
  background: #fff;
}
.chat-list-item.active,
.chat-list-item:hover {
  background: #f0f4ff;
}
.chat-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chat-name {
  font-weight: 600;
  color: #22223b;
}
.unread-badge {
  background: #ff4d4f;
  color: #fff;
  border-radius: 10px;
  padding: 0 8px;
  font-size: 0.92rem;
  margin-left: 0.5em;
}
.chat-last-msg {
  color: #64748b;
  font-size: 0.98rem;
  margin-top: 0.2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-last-time {
  color: #b0b3c6;
  font-size: 0.85rem;
  margin-top: 0.1em;
  text-align: right;
}
.chat-window {
  flex: 1;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}
.empty-chat {
  color: #aaa;
  font-size: 1.2rem;
  margin: auto;
  text-align: center;
}
.loading {
  color: #888;
  text-align: center;
  margin: 2rem 0;
}
.error-msg {
  color: #ff4d4f;
  text-align: center;
  margin: 2rem 0;
}
</style>