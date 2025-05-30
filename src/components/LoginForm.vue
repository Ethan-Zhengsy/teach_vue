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
      localStorage.setItem('userInfo', JSON.stringify({
        userId: res.data.userId,
        username: res.data.username,
        email: res.data.email,
        userType: res.data.userType
      }))
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
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  width: 100%;
  max-width: 400px;
  margin: 60px auto 0 auto;
  transition: box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.2rem 0.5rem 1.5rem 0.5rem;
    max-width: 98vw;
  }
}

h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1.2;
  color: #3b3b5b;
  position: relative;
  z-index: 1;
  text-shadow: 0 4px 24px #a5b4fc33, 0 1px 0 #fff;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  background-clip: unset;
}
h2::after {
  content: "";
  display: block;
  margin: 0.6rem auto 0 auto;
  width: 60px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  opacity: 0.85;
}

.form-group {
  margin-bottom: 1.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
}

label {
  color: #4b5563;
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  align-self: flex-start;
}

input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.75rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9fafb;
  color: #22223b;
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-bottom: 0.2rem;
}

input:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 2px #a5b4fc55;
}

input.error {
  border-color: #ff4d4f;
  background: #fff1f0;
}

.error-msg {
  color: #ff4d4f;
  font-size: 0.92rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  display: block;
  min-height: 1.2em;
  width: 100%;
  text-align: left;
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px 0 rgba(99,102,241,0.08);
}

.submit-btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #4f46e5 0%, #2563eb 100%);
}

p[style*="text-align:center"] {
  margin-top: 2.2rem !important;
  color: #6b7280;
  font-size: 0.98rem;
  letter-spacing: 0.5px;
}

router-link {
  color: #6366f1;
  font-weight: 600;
  text-decoration: underline;
  margin-left: 0.3em;
  transition: color 0.2s;
}

router-link:hover {
  color: #2563eb;
}
</style>
