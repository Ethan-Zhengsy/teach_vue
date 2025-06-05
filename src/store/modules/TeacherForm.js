import { defineStore } from 'pinia'

// 修改 store 模块
export const useTeacherStore = defineStore('Teacher', {
  state: () => ({
    price: 200,
    profile: null, // 包含所有表单字段的对象
    //...
  }),
  actions: {
    async loadProfile() {
      // 从接口加载数据
      this.profile = await api.post('/user/update/teacher')
    },
    async saveProfile() {
      await api.updateProfile(this.profile)
    }
  }
})