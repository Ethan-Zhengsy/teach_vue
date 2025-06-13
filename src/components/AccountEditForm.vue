<template>
  <div>
    <!-- h2 页面标题 -->
    <h2>修改账户信息</h2>

    <!-- 头像上传区域 -->
    <!--
      v-if 条件渲染
      v-model 双向绑定
      @change 事件处理
      :src 动态绑定图片地址
      :class 动态绑定类名
      v-else 显示默认占位符
      class 样式类名
      input[type="file"] 文件输入框
      accept 限制文件类型
      @change 处理文件选择事件
      avatarUrl 头像URL
      avatarError 头像错误信息
    -->
    <div class="avatar-upload">
      <div class="avatar-preview">
        <img v-if="avatarUrl" :src="avatarUrl" alt="头像" />
        <div v-else class="avatar-placeholder">无头像</div>
      </div>
      <input type="file" accept="image/*" @change="handleAvatarChange" />
      <div v-if="avatarError" class="error-msg">{{ avatarError }}</div>
    </div>

    <form @submit.prevent="handleSubmit" class="edit-form">
      <!-- form-group 表单组 -->
      <!--
        label 表单标签
        input 输入框
        v-model 双向绑定
        :class 动态绑定类名
        v-if 条件渲染
        span 错误信息
      -->
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          :class="{ error: errors.username }"
        />
        <span v-if="errors.username" class="error-msg">
          {{ errors.username }}
        </span>
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          :class="{ error: errors.password }"
        />
        <span v-if="errors.password" class="error-msg">
          {{ errors.password }}
        </span>
      </div>

      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-msg">
          {{ errors.email }}
        </span>
      </div>

      <div class="form-group">
        <label for="userType">身份</label>
        <select id="userType" v-model="form.userType">
          <option value="">请选择身份</option>
          <option value="TEACHER">老师</option>
          <option value="STUDENT">学生</option>
        </select>
      </div>

      <!-- 错误信息 -->
      <!--
        v-if 条件渲染
        class 错误信息样式
        style 内联样式
        errors.general 错误信息
      -->
      <div v-if="errors.general" class="error-msg" style="text-align:center;">
        {{ errors.general }}
      </div>

      <!-- 提交按钮 -->
      <!--
        type 按钮类型
        :disabled 禁用状态
        class 按钮样式
        v-if 条件渲染
        @click 点击事件
        isSubmitting 是否正在提交
        handleSubmit 提交函数
      -->
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

// 引入 Vue Router
const router = useRouter()

// 定义表单数据和错误信息
const form = reactive({
  userId: '', // 可选
  username: '',
  password: '',
  email: '',
  userType: '',
})

// 定义错误信息
const errors = reactive({
  username: '',
  password: '',
  email: '',
  general: ''
})

// 定义提交状态
const isSubmitting = ref(false)

// 头像相关
const avatarUrl = ref('')
const avatarError = ref('')

// 假设token中有userId和userType等信息，实际可根据你的登录逻辑调整
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
form.userId = userInfo.userId || ''
form.username = userInfo.username || ''
form.email = userInfo.email || ''
form.userType = userInfo.userType || ''
avatarUrl.value = userInfo.avatar || ''

// 头像上传处理
const handleAvatarChange = async (e) => {
  avatarError.value = ''
  const file = e.target.files[0]
  if (!file) return
  // 限制文件大小/类型
  if (!file.type.startsWith('image/')) {
    avatarError.value = '请选择图片文件'
    return
  }
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await api.post('/file/uploadavatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.status === 200 && res.data) {
      avatarUrl.value = res.data
      form.avatar = res.data
      avatarError.value = ''
      // 同步保存到 localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      userInfo.avatar = res.data
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      avatarError.value = '上传失败，请重试'
    }
  } catch (err) {
    avatarError.value = '上传失败，请重试'
  }
}

// 定义表单验证函数
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// 定义表单验证函数
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

// 定义提交函数
const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    const res = await api.post('/user/update/user', {
      userId: form.userId,
      username: form.username,
      password: form.password,
      email: form.email,
      userType: form.userType,
    })
    if (res.status === 200) {
      alert('修改成功！')
      // 更新本地用户信息
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      router.push('/user/profile')
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
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 1.5rem;
}
.avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  color: #aaa;
  font-size: 14px;
}
input[type="file"] {
  font-size: 0.95rem;
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