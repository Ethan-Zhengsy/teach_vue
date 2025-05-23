<template>
  <div class="section-card">
    <h3 class="title">{{ title }}</h3>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<style scoped>
.section-card {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
.title {
  color: #303133;
  margin-bottom: 15px;
  font-size: 18px;
}
</style>