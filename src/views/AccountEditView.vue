<template>
  <div class="account-edit-container">
    <h2>修改账户信息</h2>
    <form @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          :class="{ error: errors.username }"
        />
        <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          :class="{ error: errors.password }"
        />
        <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="userType">身份</label>
        <select id="userType" v-model="form.userType">
          <option value="">请选择身份</option>
          <option value="TEACHER">老师</option>
          <option value="STUDENT">学生</option>
        </select>
      </div>
      <div v-if="errors.general" class="error-msg" style="text-align:center;">
        {{ errors.general }}
      </div>
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? '保存中...' : '保存修改' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

const router = useRouter()
const form = reactive({
  userId: '', // 可选
  username: '',
  password: '',
  email: '',
  userType: ''
})
const errors = reactive({
  username: '',
  password: '',
  email: '',
  general: ''
})
const isSubmitting = ref(false)

// 假设token中有userId和userType等信息，实际可根据你的登录逻辑调整
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
form.userId = userInfo.userId || ''
form.username = userInfo.username || ''
form.email = userInfo.email || ''
form.userType = userInfo.userType || ''

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validateForm = () => {
  errors.username = ''
  errors.password = ''
  errors.email = ''
  errors.general = ''
  let valid = true
  if (!form.username || form.username.length < 4 || form.username.length > 20) {
    errors.username = '用户名长度需为4-20字符'
    valid = false
  }
  if (!form.password || form.password.length < 6 || form.password.length > 32) {
    errors.password = '密码长度需为6-32字符'
    valid = false
  }
  if (!form.email || !validateEmail(form.email)) {
    errors.email = '邮箱格式不正确'
    valid = false
  }
  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    const res = await api.post('/user/update/user', {
      userId: form.userId,
      username: form.username,
      password: form.password,
      email: form.email,
      userType: form.userType
    })
    if (res.status === 200) {
      alert('修改成功！')
      // 可选：更新本地用户信息
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      router.push('/home')
    } else {
      errors.general = '修改失败，请重试'
    }
  } catch (error) {
    errors.general = '修改失败，请重试'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.account-edit-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}
input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;
  color: #333;
}
input.error, select.error {
  border-color: #ff4d4f;
}
.error-msg {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}
.submit-btn:disabled {
  background: #91d5ff;
  cursor: not-allowed;
}
.submit-btn:hover {
  background: #40a9ff;
}
</style>