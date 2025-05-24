<!-- src/components/Profile/EditableField.vue -->
<template>
  <div class="editable-field">
    <label>{{ label }}</label>
    <div v-if="!isEditing" class="display-mode" @click="startEdit">
      <span v-if="displayValue">{{ displayValue }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <el-icon class="edit-icon"><Edit /></el-icon>
    </div>
    <div v-else class="edit-mode">
      <el-input
        v-if="type === 'textarea'"
        v-model="editValue"
        type="textarea"
        :rows="rows"
        @blur="handleSave"
      />
      <el-input
        v-else
        v-model="editValue"
        :type="type"
        @blur="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElIcon } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: '点击编辑'
  },
  rows: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['save', 'edit'])

const isEditing = ref(false)
const editValue = ref('')

const displayValue = computed(() => {
  if (props.type === 'number') {
    return props.value ? `${props.value}` : ''
  }
  return props.value
})

const startEdit = () => {
  isEditing.value = true
  editValue.value = props.value
  emit('edit')
}

const handleSave = () => {
  isEditing.value = false
  emit('save', editValue.value) // 可选：这里添加了保存编辑值的逻辑
}
</script>