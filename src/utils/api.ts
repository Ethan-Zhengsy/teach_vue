import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/auth', // 后端接口地址
  timeout: 5000
})

// 请求拦截器：自动带上 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api