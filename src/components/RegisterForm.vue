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

// 注册表单组件
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
  email: ''
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
    // 这里替换为实际的 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟 API 调用
    alert('注册成功！')
    // 实际项目中这里可以跳转到登录页
  } catch (error) {
    alert('注册失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-form {
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
