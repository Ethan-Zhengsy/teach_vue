import { defineStore } from 'pinia'

export const useTeacherStore = defineStore('TeacherForm', {
  state: () => ({
    subjects: ['数学', '物理'],
    price: 200,
    introduction: '10年教学经验，擅长高考冲刺辅导'
  }),
  actions: {
    async loadProfile() {
      // 模拟数据加载
      this.subjects = ['数学', '物理']
      this.price = 200
      this.introduction = '资深教师，擅长高考冲刺辅导'
      // 模拟API调用
      return new Promise(resolve => {
        setTimeout(resolve, 500)
      })
    }
  }
})