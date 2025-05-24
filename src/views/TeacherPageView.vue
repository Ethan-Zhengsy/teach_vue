<!-- views/TeacherPageView.vue -->
<template>
  <div class="page-container">
    <h1>教师个人中心</h1>
    
    <SectionCard title="基本信息">
      <EditableField
        label="授课科目"
        :value="store.subjects.join(', ')"
        placeholder="点击设置科目"
        @edit="handleEditSubjects"
      />
      
      <EditableField
        label="课时费用"
        :value="store.price"
        type="number"
        @save="handleSavePrice"
      />
    </SectionCard>

    <SectionCard title="可授课时间表">
      <el-button type="primary" @click="showUploadTip">
        <el-icon><Upload /></el-icon>
        上传时间表（开发中）
      </el-button>
    </SectionCard>

    <SectionCard title="个人简介">
      <p style="white-space: pre-wrap">{{ store.introduction }}</p>
      <el-button @click="showEditorTip">编辑简介（开发中）</el-button>
    </SectionCard>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTeacherStore } from '../store/modules/TeacherForm'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import SectionCard from '../components/SectionCard.vue'
import EditableField from '../components/EditableField.vue'

const store = useTeacherStore()

// 模拟初始化加载
onMounted(() => {
  store.loadProfile()
})

const handleEditSubjects = () => {
  ElMessage.info('科目编辑功能开发中')
}

const handleSavePrice = (value) => {
  store.price = Number(value)
  ElMessage.success(`已保存价格：${value}元`)
}

const showUploadTip = () => {
  ElMessage.warning('文件上传功能开发中')
}

const showEditorTip = () => {
  ElMessage.warning('富文本编辑器开发中')
}
</script>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>