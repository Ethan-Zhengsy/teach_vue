<template>
  <div class="student-judge-container">
    <StudentJudgeForm />
  </div>
</template>

<script setup>
import StudentJudgeForm from '../components/StudentJudgeForm.vue'
</script>

<style scoped>
.student-judge-container {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  width: 100%;
  max-width: 500px;
  margin: 60px auto 0 auto;
  text-align: center;
}
</style>