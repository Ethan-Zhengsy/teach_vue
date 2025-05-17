import axios from 'axios'

const api = axios.create({
  baseURL: 'http://你的后端地址/api', // 替换为你的后端接口地址
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