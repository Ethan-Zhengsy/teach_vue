<template>
  <div class="chat-window-main">
    <div class="chat-header">
      <span>会话ID: {{ sessionId }}</span>
      <span v-if="session">
        &nbsp;|&nbsp;
        {{ session.teacherName && session.studentName
          ? (userType === 'TEACHER' ? session.studentName : session.teacherName)
          : '' }}
      </span>
    </div>
    <div class="chat-messages" ref="msgListRef">
      <div v-if="loading" class="loading">消息加载中...</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>
      <div v-else>
        <div
          v-if="hasMore"
          class="load-more"
          @click="loadMore"
          :disabled="loadingMore"
        >
          {{ loadingMore ? '加载中...' : '加载更多历史消息' }}
        </div>
        <div
          v-for="(msg, idx) in messages"
          :key="msg.messageId || idx"
          :class="['chat-msg', msg.pos === 'right' ? 'mine' : 'other']"
        >
          <div class="msg-content">{{ msg.content }}</div>
          <div class="msg-meta">
            <span>{{ msg.senderName || (msg.pos === 'right' ? '我' : '对方') }}</span>
            <span class="msg-time">{{ formatTime(msg.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框和发送按钮 -->
    <div class="chat-input-bar">
      <input
        v-model="inputMsg"
        @keyup.enter="sendMsg"
        :disabled="sending"
        placeholder="请输入消息，回车发送"
        class="chat-input"
        maxlength="1000"
      />
      <button class="send-btn" @click="sendMsg" :disabled="sending || !inputMsg.trim()">
        {{ sending ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import api from '../utils/api'

const props = defineProps({
  sessionId: { type: [String, Number], required: true },
  session: { type: Object, default: null }
})

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const userId = userInfo.userId
const userType = userInfo.userType

const messages = ref([])
const loading = ref(true)
const error = ref('')
const inputMsg = ref('')
const sending = ref(false)
const msgListRef = ref(null)

// 分页相关
const page = ref(0)
const size = ref(20)
const hasMore = ref(false)
const loadingMore = ref(false)
let totalPages = 1
let timer = null

// 加载消息历史（分页，倒序追加）
async function fetchMessages(init = true) {
  if (init) {
    page.value = 0
    messages.value = []
  }
  const params = {
    sessionId: props.sessionId,
    page: page.value,
    size: size.value
  }
  if (init) {
    loading.value = true
    error.value = ''
  } else {
    loadingMore.value = true
  }
  try {
    const res = await api.get('/chat/messages', { params })
    if (
      res.status === 200 &&
      res.data &&
      Array.isArray(res.data.content)
    ) {
      const newMsgs = res.data.content.reverse()
      if (init || page.value === 0) {
        // 首次加载/刷新/切换会话时，直接替换消息数组
        messages.value = newMsgs
      } else {
        // 加载更多历史消息时，追加到前面
        messages.value = newMsgs.concat(messages.value)
      }
      totalPages = res.data.totalPages || 1
      hasMore.value = (page.value + 1) < totalPages
      await nextTick()
      if (init) scrollToBottom()
    } else {
      if (init) error.value = '未获取到消息'
    }
  } catch (e) {
    if (init) error.value = '获取消息失败'
  } finally {
    if (init) loading.value = false
    else loadingMore.value = false
  }
}

// 加载更多历史消息
async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  page.value += 1
  await fetchMessages(false)
}

// 发送消息
async function sendMsg() {
  if (!inputMsg.value.trim()) return
  sending.value = true
  error.value = ''
  try {
    // 获取对方ID
    let receiverId = null
    if (props.session) {
      if (userType === 'TEACHER') {
        receiverId = props.session.studentUserId
      } else if (userType === 'STUDENT') {
        receiverId = props.session.teacherUserId
      }
    }
    if (!receiverId) {
      error.value = '无法获取对方ID'
      sending.value = false
      return
    }
    const res = await api.post('/chat/messages', {
      sessionId: props.sessionId,
      senderId: userId,
      receiverId,
      content: inputMsg.value.trim()
    })
    if (res.status === 200) {
      inputMsg.value = ''
      // 重新加载最新消息
      await fetchMessages(true)
      // 发送消息后强制滚动到底部
      scrollToBottom()
    } else {
      error.value = '发送失败'
    }
  } catch (e) {
    error.value = '发送失败'
  } finally {
    sending.value = false
  }
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.replace('T', ' ').slice(0, 16)
}

function scrollToBottom() {
  if (msgListRef.value) {
    msgListRef.value.scrollTop = msgListRef.value.scrollHeight
  }
}

watch(() => props.sessionId, () => {
  fetchMessages(true) // 切换会话时滚动到底部
})

onMounted(() => {
  fetchMessages(true)
  timer = setInterval(() => {
    fetchMessages(false) // 定时刷新时不滚动
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.chat-window-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
}
.chat-header {
  padding: 1rem;
  background: #f1f5fa;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.08rem;
  color: #6366f1;
  font-weight: 600;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem 1rem;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.chat-msg {
  max-width: 70%;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 6px #e0e7ff33;
  font-size: 1.05rem;
  word-break: break-all;
  align-self: flex-start;
  position: relative;
}
.chat-msg.mine {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  align-self: flex-end;
}
.msg-content {
  margin-bottom: 0.3rem;
}
.msg-meta {
  font-size: 0.92rem;
  color: #888;
  display: flex;
  justify-content: space-between;
}
.load-more {
  text-align: center;
  color: #6366f1;
  cursor: pointer;
  margin: 0.5rem 0;
  font-size: 0.98rem;
  user-select: none;
}
.load-more:disabled {
  color: #bbb;
  cursor: not-allowed;
}
.chat-input-bar {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  gap: 1rem;
}
.chat-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1.2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafc;
  color: #22223b;
}
.send-btn {
  padding: 0.7rem 1.5rem;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.send-btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
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