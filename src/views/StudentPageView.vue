<template>
  <!-- 整个表单容器 -->
  <div class="container">
    <!-- 标题区域 -->
    <div class="page-header">
      <h1>学生个人信息</h1>
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
          <option value="">请选择性别</option>
          <option value="MALE">男</option>
          <option value="FEMALE">女</option>
        </select>
      </div>
      
      <!-- 年级选择 -->
      <div class="form-group">
        <label>年级*：</label>
        <select v-model="formData.grade" required>
          <option value="">请选择年级</option>
          <option value="一年级">一年级</option>
          <option value="二年级">二年级</option>
          <option value="三年级">三年级</option>
          <option value="四年级">四年级</option>
          <option value="五年级">五年级</option>
          <option value="六年级">六年级</option>
          <option value="初一">初一</option>
          <option value="初二">初二</option>
          <option value="初三">初三</option>
          <option value="高一">高一</option>
          <option value="高二">高二</option>
          <option value="高三">高三</option>
        </select>
      </div>
      
      <!-- 专业科目 -->
      <div class="form-group">
        <label>专业科目*：</label>
        <input type="text" v-model="formData.subject" placeholder="如：数学、物理" required>
      </div>
      
      <!-- 地址（多行文本） -->
      <div class="form-group">
        <label>地址*：</label>
        <textarea v-model="formData.address" rows="2" placeholder="详细地址" required></textarea>
      </div>
      
      <!-- 联系电话 -->
      <div class="form-group">
        <label>联系电话*：</label>
        <input type="tel" v-model="formData.phone" pattern="[0-9]{11}" placeholder="11位手机号码" required>
      </div>
      
      <!-- 综合评分 -->
      <div class="form-group">
        <label>综合评分(0-10分)：</label>
        <div class="score-container">
          <input 
            type="range" 
            v-model.number="formData.score" 
            min="0" 
            max="10" 
            step="0.5"
            class="score-slider"
          >
          <span class="score-value">{{ formData.score.toFixed(1) }}</span>
        </div>
      </div>
      
      <!-- 兴趣爱好 -->
      <div class="form-group">
        <label>兴趣爱好：</label>
        <input type="text" v-model="formData.hobby" placeholder="多个兴趣用逗号分隔">
      </div>
      
      <!-- 学习目标 -->
      <div class="form-group">
        <label>学习目标：</label>
        <textarea v-model="formData.goal" rows="3" placeholder="学习或升学目标"></textarea>
      </div>
      
      <!-- 补充说明（多行文本） -->
      <div class="form-group">
        <label>补充说明：</label>
        <textarea v-model="formData.addition" rows="3" placeholder="其他需要说明的信息"></textarea>
      </div>
      
      <!-- 表单操作按钮 -->
      <div class="form-actions">
        <button @click="showData">预览数据</button>
        <button @click="saveData">保存数据</button>
        <button @click="resetForm" class="reset-btn">重置表单</button>
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
import api from "../utils/api"

export default {
  // 数据属性定义
  data() {
    return {
      // 表单数据结构 - 与提供的JSON对应
      formData: {
        name: "",        // 姓名
        gender: "",      // 性别
        grade: "",       // 年级
        subject: "",     // 专业科目
        address: "",     // 地址
        phone: "",       // 联系电话
        score: 0.0,      // 综合评分
        hobby: "",       // 兴趣爱好
        goal: "",        // 学习目标
        addition: ""     // 补充说明
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
      // 基本验证
      if (!this.formData.name) {
        alert("请填写姓名");
        return;
      }
      if (!this.formData.gender) {
        alert("请选择性别");
        return;
      }
      if (!this.formData.grade) {
        alert("请选择年级");
        return;
      }
      
      this.showPreview = true; // 显示预览区域
      // 在控制台输出当前表单数据
      console.log("当前表单数据:", this.formData);
    },
    
    // 重置表单
    resetForm() {
      this.formData = {
        name: "",
        gender: "",
        grade: "",
        subject: "",
        address: "",
        phone: "",
        score: 0.0,
        hobby: "",
        goal: "",
        addition: ""
      };
      this.showPreview = false;
    },
    
    // 保存数据到后端接口
    async saveData() {
      try {
        // 先触发基本验证
        this.showData();
        if (!this.showPreview) return;
        
        const response = await api.post('/user/update/student',this.formData)
        
        console.log("保存成功:", result);
        alert("学生数据保存成功！");
        
        // 保存成功后可以清空表单（可选）
        // this.resetForm();
        
        // 这个GET请求不会显示给用户，只在后台执行
        this.fetchUpdatedData();
      } catch (error) {
        // 错误处理
        console.error("保存失败:", error);
        // 显示更详细的错误提示
        let errorMessage = "保存失败，请重试";

        if(error.response){
          // 后端返回的错误响应
          const {status, data } = error.response;
          if(status === 401){
            errorMessage = "身份验证已过期，请重新登录";
            // 可以在这里添加跳转到登录页的逻辑
            // this.$router.push('/login');
          }else if(data && data.message){
            errorMessage = data.message;
          }else{
            errorMessage =`服务器错误 (状态码: ${status})`;
          }
        }else if(error.request){
          // 请求已发送，但无响应
          errorMessage = "无法连接到服务器，请检查网络连接";
        }else{
          // 请求未发送
          errorMessage = "请求发送失败";
        }
        alert(errorMessage);
      }
    },

    // 执行后台GET请求，但不显示任何UI请求
    async fetchUpdatedData() {
      try {
        // 悄悄地在后台执行GET请求
        const getResponse = await api.get('/api/match/save');
        console.log("后台数据刷新完成", getResponse.data);
      } catch (getError) {
        // 只记录错误，不提示用户
        console.error("后台GET请求出错", getError);
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
  border-left: 4px solid #3498db; /* 左侧蓝色竖线 */
}

/* 主标题样式 */
.page-header h1 {
  font-size: 32px;       /* 字体大小 */
  color: #2980b9;        /* 蓝色标题 */
  font-weight: 600;      /* 中等粗细 */
  padding-bottom: 8px;   /* 下边距 */
  position: relative;    /* 定位上下文 */
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
  background: linear-gradient(to right, #2980b9, #3498db); /* 学生主题渐变 */
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
  border: 1px solid #e0e7ee; /* 添加边框 */
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
  color: #2c3e50; /* 深蓝色 */
  font-size: 15px; /* 字体大小 */
}

/* 添加必填标记 */
.required label:after {
  content: ' *'; /* 添加星号 */
  color: #e74c3c; /* 红色星号 */
}

/* 输入框通用样式 */
input[type="text"],
input[type="tel"],
select,
textarea {
  width: 100%; /* 宽度100%填满容器 */
  padding: 12px 15px; /* 内边距 */
  border: 1px solid #d6dbdf; /* 边框 */
  border-radius: 5px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
  transition: all 0.3s ease; /* 所有属性过渡效果 */
  background-color: #f8fafc; /* 非常浅的背景色 */
}

/* 输入框聚焦状态 */
input:focus,
select:focus,
textarea:focus {
  border-color: #3498db; /* 聚焦时边框变蓝色 */
  outline: 0; /* 去除默认outline */
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15); /* 蓝色光晕效果 */
  background-color: #ffffff; /* 聚焦时背景变白 */
}

/* 滑杆和数值容器 */
.score-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-slider {
  flex-grow: 1;
  height: 10px;
  border-radius: 5px;
  background: #e0e7ff;
  outline: none;
}

.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}

.score-value {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
  color: #3498db;
  font-size: 18px;
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
  background-color: #3498db; /* 学生主题蓝色 */
  color: white; /* 白色文字 */
}

/* 预览按钮悬停效果 */
button:first-child:hover {
  background-color: #2980b9; /* 深一点的蓝色 */
  transform: translateY(-3px); /* 上移3像素 */
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15); /* 更大的阴影 */
}

/* 保存按钮样式 */
button:nth-child(2) {
  background-color: #2ecc71; /* 绿色 */
  color: white; /* 白色文字 */
}

/* 保存按钮悬停效果 */
button:nth-child(2):hover {
  background-color: #27ae60; /* 深一点的绿色 */
  transform: translateY(-3px); /* 上移3像素 */
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15); /* 更大的阴影 */
}

/* 重置按钮样式 */
.reset-btn {
  background-color: #95a5a6 !important; /* 灰色背景 */
  color: white;
}

.reset-btn:hover {
  background-color: #7f8c8d !important; /* 深灰色 */
}

/* 数据预览区域 */
.data-preview {
  margin-top: 35px; /* 顶部外边距 */
  padding: 25px; /* 内边距 */
  background: #f7f9fc; /* 浅蓝色背景 */
  border: 1px solid #dde4ee; /* 浅灰色边框 */
  border-radius: 6px; /* 圆角 */
  border-left: 4px solid #3498db; /* 左侧蓝色标识线 */
}

/* JSON预览标题 */
.data-preview h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #3498db; /* 虚线分隔线 */
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
  
  .score-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}
</style>