<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <!-- h2：页面标题 -->
    <h2>用户注册</h2>

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
        :class="{ error: validationErrors.username }"
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
        :class="{ error: validationErrors.password }"
    />
    <span v-if="validationErrors.password" class="error-msg">
        {{ validationErrors.password }}
    </span>
    </div>

    <div class="form-group">
    <label for="role">身份</label>
    <select id="role" v-model="formData.role">
        <option value="">请选择身份</option>
        <option value="teacher">老师</option>
        <option value="student">学生</option>
    </select>
    <span v-if="validationErrors.role" class="error-msg">
        {{ validationErrors.role }}
    </span>
    </div>

    <div class="form-group">
    <label for="email">邮箱</label>
    <input
        type="email"
        id="email"
        v-model="formData.email"
        :class="{ error: validationErrors.email }"
    />
    <span v-if="validationErrors.email" class="error-msg">
        {{ validationErrors.email }}
    </span>
    </div>

    <div v-if="validationErrors.general" class="error-msg" style="text-align:center;">
      {{ validationErrors.general }}
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
    {{ isSubmitting ? '注册中...' : '立即注册' }}
    </button>

  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api' // 新增

const router = useRouter() // 新增：用于跳转

// formData：表单数据
const formData = reactive({
  username: '',
  password: '',
  role: '',
  email: ''
})

// 表单验证错误信息
const validationErrors = reactive({
  username: '',
  password: '',
  role: '',
  email: '',
  general: '' // 新增：用于显示通用错误
})

// 提交状态
const isSubmitting = ref(false)

// 邮箱格式校验
const validateEmail = (email) => {
  // 简单邮箱校验
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 表单验证
const validateForm = () => {
  let isValid = true
  validationErrors.username = ''
  validationErrors.password = ''
  validationErrors.role = ''
  validationErrors.email = ''
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
  if (!formData.role) {
    validationErrors.role = '请选择身份'
    isValid = false
  }
  if (!formData.email) {
    validationErrors.email = '邮箱不能为空'
    isValid = false
  } else if (!validateEmail(formData.email)) {
    validationErrors.email = '邮箱格式不正确'
    isValid = false
  }
  return isValid
}

// 提交函数
const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    // 调用后端注册接口
    const res = await api.post('/auth/register', {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      userType: formData.role === 'teacher' ? 'TEACHER' : 'STUDENT'
    })
    if (res.status === 200) { // 显式判断
      localStorage.setItem('token', res.data.token) // 存储token
      alert('注册成功！请登录')
      router.push('/')
    } else {
      validationErrors.general = '注册失败，请重试'
    }
  } catch (error) {
    // 处理后端返回的错误信息
    if (error.response && error.response.status === 400 && typeof error.response.data === 'string') {
      const msg = error.response.data
      // 根据后端返回的错误内容，分配到对应字段
      if (msg.includes('用户名')) {
        validationErrors.username = msg
      } else if (msg.includes('密码')) {
        validationErrors.password = msg
      } else if (msg.includes('邮箱')) {
        validationErrors.email = msg
      } else if (msg.includes('身份') || msg.includes('UserType')) {
        validationErrors.role = '请选择正确的身份'
      } else {
        validationErrors.general = msg
      }
    } else {
      validationErrors.general = '注册失败，请重试'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-form {
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
  .register-form {
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

input, select {
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

input:focus, select:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 2px #a5b4fc55;
}

input.error, select.error {
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
