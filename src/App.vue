<template>
  <div>
    <router-view />
    <div class="nav-buttons">
      <router-link to="/teacher">
        <el-button type="primary">教师页面</el-button>
      </router-link>
      <router-link to="/student">
        <el-button type="primary">学生页面</el-button>
      </router-link>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.nav-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}
</style>
