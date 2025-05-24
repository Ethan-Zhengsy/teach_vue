<!-- views/StudentPageView.vue -->
<template>
  <div class="page-container">
    <h1>学生个人中心</h1>
    
    <SectionCard title="我的成绩单">
      <el-button type="primary" @click="showUploadTip">
        <el-icon><Upload /></el-icon>
        上传成绩单（开发中）
      </el-button>
    </SectionCard>

    <SectionCard title="学习目标">
      <EditableField
        :value="store.studyGoal"
        type="textarea"
        placeholder="请输入你的学习目标..."
        @save="handleSaveGoal"
      />
    </SectionCard>

    <SectionCard title="找老师偏好">
      <div class="preference-item">
        <span>科目偏好：</span>
        <el-select placeholder="请选择（开发中）" disabled />
      </div>
      
      <div class="preference-item">
        <span>价格范围：</span>
        <el-slider 
          :min="0" 
          :max="500" 
          :step="50" 
          disabled
          range
        />
      </div>
    </SectionCard>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>

<script setup>
import { useStudentStore } from '../store/modules/StudentForm'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import SectionCard from '../components/SectionCard.vue'
import EditableField from '../components/EditableField.vue'

const store = useStudentStore()

const handleSaveGoal = (value) => {
  store.studyGoal = value
  ElMessage.success('学习目标已保存')
}

const showUploadTip = () => {
  ElMessage.warning('成绩单上传功能开发中')
}
</script>

<style scoped>
.preference-item {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
</style>