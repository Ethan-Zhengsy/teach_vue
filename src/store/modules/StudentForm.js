// src/store/modules/student.js
import { defineStore } from 'pinia'

export const useStudentStore = defineStore('StudentForm', {
  state: () => ({
    studyGoal: '提高数学成绩至班级前五名',
    preferences: {
      subject: null,
      priceRange: [0, 200]
    }
  }),
  actions: {
    async loadProfile() {
      // 模拟API调用
      return new Promise(resolve => {
        setTimeout(resolve, 500)
      })
    }
  }
})