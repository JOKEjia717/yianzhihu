<template>
  <div class="user-info-container">
    <div class="user-info-box">
      <h2 class="title">用户信息</h2>
      <div class="info-item">
        <label>用户名：</label>
        <input
          v-model="userInfo.username"
          type="text"
          class="input"
          :disabled="!isEditing"
        />
      </div>
      <div class="info-item">
        <label>邮箱：</label>
        <input
          v-model="userInfo.email"
          type="email"
          class="input"
          :disabled="!isEditing"
        />
      </div>
      <div class="info-item">
        <label>注册时间：</label>
        <span class="info-text">{{ formatDate(userInfo.createdAt) }}</span>
      </div>
      <div class="info-item">
        <label>最后更新：</label>
        <span class="info-text">{{ formatDate(userInfo.updatedAt) }}</span>
      </div>
      <div class="button-group">
        <button
          v-if="!isEditing"
          class="edit-btn"
          @click="startEdit"
        >
          编辑信息
        </button>
        <template v-else>
          <button class="save-btn" @click="handleSave">保存</button>
          <button class="cancel-btn" @click="cancelEdit">取消</button>
        </template>
      </div>
      <div class="button-group">
        <router-link to="/user/password" class="change-password-btn">
          修改密码
        </router-link>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { removeToken } from '../utils/auth'
import type { UserInfo } from '../services/api'

export default defineComponent({
  name: 'UserInfo',
  setup() {
    const router = useRouter()
    const userInfo = reactive<UserInfo>({
      id: 0,
      username: '',
      email: '',
      createdAt: '',
      updatedAt: ''
    })
    const isEditing = reactive({ value: false })
    const originalInfo = reactive<UserInfo>({ ...userInfo })

    const formatDate = (date: string) => {
      return new Date(date).toLocaleString()
    }

    const startEdit = () => {
      originalInfo.username = userInfo.username
      originalInfo.email = userInfo.email
      isEditing.value = true
    }

    const cancelEdit = () => {
      userInfo.username = originalInfo.username
      userInfo.email = originalInfo.email
      isEditing.value = false
    }

    const handleSave = async () => {
      try {
        await api.updateUserInfo({
          username: userInfo.username,
          email: userInfo.email
        })
        isEditing.value = false
        alert('保存成功')
      } catch (error: any) {
        alert(error.message || '保存失败')
      }
    }

    const handleLogout = async () => {
      try {
        await api.logout()
        removeToken()
        router.push('/login')
      } catch (error: any) {
        alert(error.message || '退出失败')
      }
    }

    const fetchUserInfo = async () => {
      try {
        const data = await api.getUserInfo()
        Object.assign(userInfo, data)
      } catch (error: any) {
        alert(error.message || '获取用户信息失败')
        router.push('/login')
      }
    }

    onMounted(fetchUserInfo)

    return {
      userInfo,
      isEditing,
      formatDate,
      startEdit,
      cancelEdit,
      handleSave,
      handleLogout
    }
  }
})
</script>

<style scoped>
.user-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.user-info-box {
  width: 500px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.info-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.info-item label {
  width: 100px;
  color: #666;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.input:focus {
  outline: none;
  border-color: #409eff;
}

.info-text {
  flex: 1;
  color: #666;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.edit-btn,
.save-btn,
.cancel-btn,
.change-password-btn,
.logout-btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background-color: #409eff;
  color: white;
  border: none;
}

.save-btn {
  background-color: #67c23a;
  color: white;
  border: none;
}

.cancel-btn {
  background-color: #909399;
  color: white;
  border: none;
}

.change-password-btn {
  background-color: #e6a23c;
  color: white;
  text-decoration: none;
}

.logout-btn {
  background-color: #f56c6c;
  color: white;
  border: none;
}

.edit-btn:hover { background-color: #66b1ff; }
.save-btn:hover { background-color: #85ce61; }
.cancel-btn:hover { background-color: #a6a9ad; }
.change-password-btn:hover { background-color: #ebb563; }
.logout-btn:hover { background-color: #f78989; }
</style> 