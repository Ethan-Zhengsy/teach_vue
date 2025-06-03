<template>

  

  <!-- 表单容器 -->
  <div class="emergency-form">
    <!-- 姓名字段 -->
    <div class="form-group">
      <label>姓名*：</label>
      <!-- 文本输入框，双向绑定到formData.name -->
      <input type="text" v-model="formData.name" required>
    </div>
    
    <!-- 性别选择 -->
    <div class="form-group">
      <label>性别*：</label>
      <!-- 下拉选择框，绑定到formData.gender -->
      <select v-model="formData.gender" required>
        <option value="MALE">男</option>
        <option value="FEMALE">女</option>
      </select>
    </div>
    
    <!-- 学历选择 -->
    <div class="form-group">
      <label>学历*：</label>
      <select v-model="formData.education" required>
        <option value="BACHELOR">本科</option>
        <option value="MASTER">硕士</option>
        <option value="DOCTOR">博士</option>
      </select>
    </div>
    
    <!-- 教学年级选择 -->
    <div class="form-group">
      <label>教学年级*：</label>
      <select v-model="formData.teachGrade" required>
        <option value="小学">小学</option>
        <option value="初中">初中</option>
        <option value="高中">高中</option>
      </select>
    </div>
    
    <!-- 教学科目 -->
    <div class="form-group">
      <label>教学科目*：</label>
      <input type="text" v-model="formData.subject" required>
    </div>
    
    <!-- 地址（多行文本） -->
    <div class="form-group">
      <label>地址*：</label>
      <textarea v-model="formData.address" rows="2" required></textarea>
    </div>
    
    <!-- 联系电话 -->
    <div class="form-group">
      <label>联系电话*：</label>
      <!-- 电话输入模式，自动验证11位数字 -->
      <input type="tel" v-model="formData.phone" pattern="[0-9]{11}" required>
    </div>
    
    <!-- 教学经验（数字） -->
    <div class="form-group">
      <label>教学经验(年)：</label>
      <!-- .number修饰符确保值是数字类型 -->
      <input type="number" v-model.number="formData.experience" min="0">
    </div>
    
    <!-- 评分（0-10分小数） -->
    <div class="form-group">
      <label>评分(0-10分)：</label>
      <!-- step="0.1"允许输入小数 -->
      <input type="number" v-model.number="formData.score" min="0" max="10" step="0.1">
    </div>
    
    <!-- 兴趣爱好 -->
    <div class="form-group">
      <label>兴趣爱好：</label>
      <input type="text" v-model="formData.hobby">
    </div>
    
    <!-- 毕业院校 -->
    <div class="form-group">
      <label>毕业院校：</label>
      <input type="text" v-model="formData.school">
    </div>
    
    <!-- 补充说明（多行文本） -->
    <div class="form-group">
      <label>补充说明：</label>
      <textarea v-model="formData.addition" rows="3"></textarea>
    </div>
    
    <!-- 表单操作按钮 -->
    <div class="form-actions">
      <!-- 预览数据按钮 - 触发showData方法 -->
      <button @click="showData">预览数据</button>
      <!-- 保存数据按钮 - 触发saveData方法 -->
      <button @click="saveData">保存数据</button>
    </div>
    
    <!-- 数据预览区域 -->
    <div class="data-preview" v-if="showPreview">
      <h3>将要提交的数据：</h3>
      <!-- 显示格式化后的JSON数据 -->
      <pre>{{ formattedData }}</pre>
    </div>
  </div>
</template>

<script>
// Vue组件导出
export default {
  // 数据属性定义
  data() {
    return {
      // 表单数据结构 - 与你的JSON文档对应
      formData: {
        name: "",            // 姓名
        gender: "MALE",      // 性别，默认"MALE"（男）
        education: "BACHELOR", // 学历，默认"BACHELOR"（本科）
        teachGrade: "小学",  // 教学年级，默认"小学"
        subject: "",         // 教学科目
        address: "",         // 地址
        phone: "",           // 联系电话
        experience: 0,       // 教学经验（年）
        score: 0.0,          // 评分（0-10分）
        hobby: "",           // 兴趣爱好
        school: "",          // 毕业院校
        addition: ""          // 补充说明
      },
      // 控制数据预览区域的显示
      showPreview: false
    }
  },
  
  // 计算属性
  computed: {
    // 将formData转换为格式化的JSON字符串
    formattedData() {
      return JSON.stringify(this.formData, null, 2);
    }
  },
  
  // 方法定义
  methods: {
    // 显示数据预览
    showData() {
      this.showPreview = true; // 显示预览区域
      // 在控制台输出当前表单数据
      console.log("当前表单数据:", this.formData);
    },
    
    // 保存数据到Apifox接口
    async saveData() {
      try {
        // ★★★★★ 这里是唯一需要修改的地方 ★★★★★
        // 将YOUR_APIFOX_URL替换为你的真实Apifox接口URL
        const API_URL = "YOUR_APIFOX_URL";
        
        // 使用Fetch API发送POST请求
        const response = await fetch(API_URL, {
          method: 'POST', // HTTP方法为POST
          headers: {
            'Content-Type': 'application/json', // JSON格式内容
            // ★★★ 如果需要Authorization认证，取消下面行的注释并添加你的token ★★★
            // 'Authorization': 'Bearer your_token_here'
          },
          // 将表单数据转换为JSON字符串
          body: JSON.stringify(this.formData)
        });
        
        // 检查响应状态码
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }
        
        // 解析JSON响应
        const result = await response.json();
        console.log("保存成功:", result);
        alert("数据保存成功！");
        
        // 保存成功后可以清空表单（可选）
        // this.formData = {...this.defaultFormData};
        
      } catch (error) {
        // 错误处理
        console.error("保存失败:", error);
        // 显示错误提示
        alert(`保存失败: ${error.message}`);
      }
    }
  }
}
</script>

<style scoped>
/* 表单容器样式 */
.emergency-form {
  max-width: 800px; /* 最大宽度 */
  margin: 20px auto; /* 上下边距20px，水平居中 */
  padding: 20px; /* 内边距 */
  background: #f8f9fa; /* 浅灰色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); /* 轻微阴影效果 */
}

/* 表单组样式 - 每个输入项 */
.form-group {
  margin-bottom: 20px; /* 每个组之间的垂直间距 */
}

/* 标签样式 */
label {
  display: block; /* 独占一行 */
  margin-bottom: 8px; /* 与输入框的间距 */
  font-weight: bold; /* 粗体 */
  color: #495057; /* 深灰色 */
}

/* 输入框通用样式 */
input[type="text"],
input[type="tel"],
input[type="number"],
select,
textarea {
  width: 100%; /* 宽度100%填满容器 */
  padding: 12px; /* 内边距 */
  border: 1px solid #ced4da; /* 边框 */
  border-radius: 4px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
  transition: border-color 0.15s; /* 边框颜色变化动画 */
}

/* 输入框聚焦状态 */
input:focus,
select:focus,
textarea:focus {
  border-color: #80bdff; /* 聚焦时边框变蓝色 */
  outline: 0; /* 去除默认outline */
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); /* 轻微发光效果 */
}

/* 按钮容器 */
.form-actions {
  display: flex; /* Flex布局 */
  gap: 15px; /* 按钮间间距 */
  margin-top: 25px; /* 顶部外边距 */
}

/* 按钮通用样式 */
button {
  flex: 1; /* 平均分配宽度 */
  padding: 14px; /* 内边距 */
  border: none; /* 无边框 */
  border-radius: 4px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
  font-weight: 600; /* 字体粗细 */
  cursor: pointer; /* 鼠标手形 */
  transition: all 0.3s ease; /* 所有属性动画 */
}

/* 预览按钮样式 */
button:first-child {
  background-color: #17a2b8; /* 青色背景 */
  color: white; /* 白色文字 */
}

/* 保存按钮样式 */
button:last-child {
  background-color: #28a745; /* 绿色背景 */
  color: white; /* 白色文字 */
}

/* 按钮悬停效果 */
button:hover {
  opacity: 0.9; /* 轻微透明 */
  transform: translateY(-2px); /* 上移2像素 */
}

/* 数据预览区域 */
.data-preview {
  margin-top: 30px; /* 顶部外边距 */
  padding: 20px; /* 内边距 */
  background: white; /* 白色背景 */
  border: 1px solid #dee2e6; /* 浅灰色边框 */
  border-radius: 4px; /* 圆角 */
}

/* JSON预览格式 */
pre {
  background: #f8f9fa; /* 浅灰色背景 */
  padding: 15px; /* 内边距 */
  border-radius: 4px; /* 圆角 */
  overflow: auto; /* 内容溢出时滚动 */
  white-space: pre-wrap; /* 保留空白符但可换行 */
}
</style>