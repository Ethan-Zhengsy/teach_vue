<template>
  <!-- 整个表单容器 -->
  <div class="container">
    <!-- 标题区域 -->
    <div class="page-header">
      <h1>教师个人信息</h1>
      <div class="header-line"></div>
    </div>
    
    <!-- 表单容器 -->
    <div class="emergency-form">
      <!-- 姓名字段 -->
      <div class="form-group">
        <label>姓名*：</label>
        <input type="text" v-model="formData.name" required>
      </div>
      
      <!-- 性别选择 -->
      <div class="form-group">
        <label>性别*：</label>
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
        <input type="tel" v-model="formData.phone" pattern="[0-9]{11}" required>
      </div>
      
      <!-- 教学经验（数字） -->
      <div class="form-group">
        <label>教学经验(年)：</label>
        <input type="number" v-model.number="formData.experience" min="0">
      </div>
      
      <!-- 评分（0-10分小数） -->
      <div class="form-group">
        <label>评分(0-10分)：</label>
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
        <button @click="showData">预览数据</button>
        <button @click="saveData">保存数据</button>
      </div>
      
      <!-- 数据预览区域 -->
      <div class="data-preview" v-if="showPreview">
        <h3>将要提交的数据：</h3>
        <pre>{{ formattedData }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'
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
        const API_URL = "/user/update/teacher";
        
        // 使用Fetch API发送POST请求
        const response = await api.post(API_URL, this.formData);
        
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
/* 新增外层容器样式 */
.container {
  max-width: 900px; /* 增加整体宽度 */
  margin: 30px auto; /* 居中并保持上下间距 */
  padding: 0 15px; /* 小屏幕的内边距 */
}

/* 标题区域样式 */
.page-header {
  margin-bottom: 30px;
  position: relative;
  padding-left: 10px; /* 向左微调 */
  border-left: 4px solid #1a73e8; /* 左侧蓝色竖线 */
}

/* 主标题样式 */
.page-header h1 {
  font-size: 32px;       /* 字体大小 */
  color: #1a73e8;        /* 蓝色标题 */
  font-weight: 600;      /* 中等粗细 */
  padding-bottom: 8px;  /* 下边距 */
  position: relative;     /* 定位上下文 */
  display: inline-block; /* 宽度适应内容 */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1); /* 文字阴影 */
}

/* 标题底部装饰线 */
.header-line {
  position: absolute;    /* 绝对定位 */
  bottom: 0;             /* 对齐底部 */
  left: 0;               /* 从左侧开始 */
  width: 200px;          /* 标题线长度 */
  height: 3px;           /* 线的高度 */
  background: linear-gradient(to right, #1a73e8, #8ab4f8); /* 渐变色 */
  border-radius: 2px;    /* 轻微圆角 */
}

/* 表单容器样式 */
.emergency-form {
  max-width: 800px;
  margin: 0 auto; /* 在容器内居中 */
  padding: 30px; /* 增加内边距 */
  background: #ffffff; /* 白色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* 更明显的阴影 */
  border: 1px solid #eaeaea; /* 添加边框 */
}

/* 表单组样式 - 每个输入项 */
.form-group {
  margin-bottom: 22px; /* 每个组之间的垂直间距 */
  position: relative; /* 相对定位 */
}

/* 标签样式 */
label {
  display: block; /* 独占一行 */
  margin-bottom: 8px; /* 与输入框的间距 */
  font-weight: bold; /* 粗体 */
  color: #3c4858; /* 更深的灰色 */
  font-size: 15px; /* 字体大小 */
}

/* 添加必填标记 */
label:after {
  content: ' *'; /* 添加星号 */
  color: #ff4d4f; /* 红色星号 */
}

/* 输入框通用样式 */
input[type="text"],
input[type="tel"],
input[type="number"],
select,
textarea {
  width: 100%; /* 宽度100%填满容器 */
  padding: 13px 15px; /* 内边距 */
  border: 1px solid #dcdfe6; /* 边框 */
  border-radius: 5px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
  transition: all 0.3s ease; /* 所有属性过渡效果 */
  background-color: #fafafa; /* 非常浅的背景色 */
}

/* 输入框聚焦状态 */
input:focus,
select:focus,
textarea:focus {
  border-color: #409eff; /* 聚焦时边框变蓝色 */
  outline: 0; /* 去除默认outline */
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15); /* 蓝色光晕效果 */
  background-color: #ffffff; /* 聚焦时背景变白 */
}

/* 按钮容器 */
.form-actions {
  display: flex; /* Flex布局 */
  gap: 18px; /* 按钮间间距 */
  margin-top: 30px; /* 顶部外边距 */
}

/* 按钮通用样式 */
button {
  flex: 1; /* 平均分配宽度 */
  padding: 15px 0; /* 内边距 */
  border: none; /* 无边框 */
  border-radius: 6px; /* 圆角 */
  font-size: 17px; /* 字体大小 */
  font-weight: 600; /* 字体粗细 */
  cursor: pointer; /* 鼠标手形 */
  transition: all 0.3s ease; /* 所有属性动画 */
  letter-spacing: 0.5px; /* 字间距 */
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12); /* 按钮阴影 */
}

/* 预览按钮样式 */
button:first-child {
  background-color: #17a2b8; /* 青色背景 */
  color: white; /* 白色文字 */
}

/* 预览按钮悬停效果 */
button:first-child:hover {
  background-color: #138496; /* 深一点的青色 */
  transform: translateY(-3px); /* 上移3像素 */
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15); /* 更大的阴影 */
}

/* 保存按钮样式 */
button:last-child {
  background-color: #28a745; /* 绿色背景 */
  color: white; /* 白色文字 */
}

/* 保存按钮悬停效果 */
button:last-child:hover {
  background-color: #218838; /* 深一点的绿色 */
  transform: translateY(-3px); /* 上移3像素 */
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15); /* 更大的阴影 */
}

/* 数据预览区域 */
.data-preview {
  margin-top: 35px; /* 顶部外边距 */
  padding: 25px; /* 内边距 */
  background: #f7f9fc; /* 浅蓝色背景 */
  border: 1px solid #dde4ee; /* 浅灰色边框 */
  border-radius: 6px; /* 圆角 */
}

/* JSON预览标题 */
.data-preview h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

/* JSON预览格式 */
pre {
  background: #2c3e50; /* 深蓝色背景 */
  color: #eaeaea; /* 浅灰色文字 */
  padding: 18px; /* 内边距 */
  border-radius: 6px; /* 圆角 */
  overflow: auto; /* 内容溢出时滚动 */
  white-space: pre-wrap; /* 保留空白符但可换行 */
  font-family: 'Consolas', 'Monaco', monospace; /* 等宽字体 */
  font-size: 15px; /* 字体大小 */
  line-height: 1.5; /* 行高 */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3); /* 内阴影效果 */
}

/* 响应式设计：小屏幕适配 */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .emergency-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .header-line {
    width: 150px;
  }
}
</style>