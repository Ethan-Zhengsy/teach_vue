import axios from 'axios'

// 创建一个 axios 实例
const api = axios.create({
  baseURL: 'http://127.0.0.1:8088/api', // 后端接口地址
  timeout: 5000
})

// 请求拦截器：自动在 header 中带上 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// // 响应拦截器：处理错误响应
// api.interceptors.response.use(
//   response => {
//     // 处理成功响应
//     return response.data
//   },
//   error => {
//     // 处理错误响应
//     if (error.response) {
//       const { status, data } = error.response
//       if (status === 401) {
//         // 未授权，跳转到登录页面
//         window.location.href = '/login'
//       } else {
//         console.error(`Error ${status}: ${data.message}`)
//       }
//     } else {
//       console.error('Network Error')
//     }
//     return Promise.reject(error)
//   }
// )

export default api