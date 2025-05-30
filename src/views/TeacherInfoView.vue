<template>
  <div class="teacher-info-container">
    <TeacherInfoForm />
  </div>
</template>

<script setup>
import TeacherInfoForm from '../components/TeacherInfoForm.vue'
</script>

<style scoped>
.teacher-info-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
}
</style>