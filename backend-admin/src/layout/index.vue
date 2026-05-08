<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <img src="../assets/logo.png" alt="Logo" />
          <h1>社区养老管理系统</h1>
        </div>
        <el-menu
          :default-active="activeMenu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :router="true"
          class="el-menu-vertical"
        >
          <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
            <el-icon v-if="route.meta && route.meta.icon"><component :is="route.meta.icon" /></el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-icon @click="toggleSidebar" class="toggle-btn"><Fold /></el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>管理员</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 主内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 侧边栏路由
const routes = computed(() => {
  return router.options.routes[0].children.filter(item => !item.meta?.hidden)
})

// 当前激活菜单
const activeMenu = computed(() => {
  return '/' + route.path.split('/')[1]
})

// 当前页面标题
const currentTitle = computed(() => {
  return route.meta.title || ''
})

// 控制侧边栏折叠
const isSidebarCollapsed = ref(false)
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 退出登录
const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  color: white;
  height: 100vh;
  transition: width 0.3s;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #263445;
}

.logo img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 16px;
  color: white;
  white-space: nowrap;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-btn {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin-left: 10px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style> 