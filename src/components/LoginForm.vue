<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <!-- h2：页面标题 -->
    <h2>用户登录</h2>

    <!-- form-group：表单组 -->
    <!--
      label：表单标签
      input：输入框
      v-model：双向绑定
      :class：动态绑定类名
      v-if：条件渲染
      span：错误信息
    -->
    <div class="form-group">
      <label for="username">用户名</label>
      <input
        type="text"
        id="username"
        v-model="formData.username"
        :class="{ 'error': validationErrors.username }"
      />
      <span v-if="validationErrors.username" class="error-msg">
        {{ validationErrors.username }}
      </span>
    </div>

    <div class="form-group">
      <label for="password">密码</label>
      <input
        type="password"
        id="password"
        v-model="formData.password"
        :class="{ 'error': validationErrors.password }"
      />
      <span v-if="validationErrors.password" class="error-msg">
        {{ validationErrors.password }}
      </span>
    </div>

    <!-- 提交按钮 -->
    <!--
      type：按钮类型
      :disabled：禁用状态
      class：按钮样式
      v-if：条件渲染
      @click：点击事件
      isSubmitting：是否正在提交
      handleSubmit：提交函数
    -->
    <button type="submit" :disabled="isSubmitting" class="submit-btn">
      {{ isSubmitting ? '登录中...' : '立即登录' }}
    </button>

    <!-- 跳转到注册页面 -->
    <!--
      p：段落
      style：内联样式
      router-link：路由链接
      to：目标路由
      to="/register"：跳转到注册页面
    -->
    <p style="text-align:center;margin-top:5rem;">
      还没有账号？
      <router-link to="/register">立即注册</router-link>
    </p>

  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

const router = useRouter()

// formData：表单数据
const formData = reactive({
  username: '',
  password: ''
})

// validationErrors：表单验证错误信息
const validationErrors = reactive({
  username: '',
  password: '',
  general: ''
})

// isSubmitting：是否正在提交
const isSubmitting = ref(false)

// validateForm：表单验证函数
const validateForm = () => {
  let isValid = true
  // 重置错误信息
  validationErrors.username = ''
  validationErrors.password = ''
  validationErrors.general = ''

  if (!formData.username.trim()) {
    validationErrors.username = '用户名不能为空'
    isValid = false
  }
  if (!formData.password) {
    validationErrors.password = '密码不能为空'
    isValid = false
  } else if (formData.password.length < 6) {
    validationErrors.password = '密码长度不能小于6位'
    isValid = false
  }
  return isValid
}

// handleSubmit：提交函数
const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    // 调用后端登录接口
    const res = await api.post('/auth/login', {
      username: formData.username,
      password: formData.password
    })
    if (res.status === 200 && res.data.token) {
      localStorage.setItem('token', res.data.token) // 存储token
      alert('登录成功！')
      // 跳转到首页或其他页面
      router.push('/home')
    } else {
      validationErrors.general = '登录失败，请重试'
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && typeof error.response.data === 'string') {
      const msg = error.response.data
      if (msg.includes('用户名')) {
        validationErrors.username = msg
      } else if (msg.includes('密码')) {
        validationErrors.password = msg
      } else {
        validationErrors.general = msg
      }
    } else {
      validationErrors.general = '登录失败，请重试'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
  color: white;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input.error {
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
