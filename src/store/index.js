// src/store/index.js
import { createPinia } from 'pinia'

export const pinia = createPinia()


import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    // 合并 mutation 和 action
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => this.increment(), 1000)
    }
  }
})