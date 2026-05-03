<template>
  <div class="change-password-container">
    <div class="change-password-box">
      <h2 class="title">修改密码</h2>
      <div class="form-item">
        <input
          v-model="passwordForm.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          class="input"
        />
      </div>
      <div class="form-item">
        <input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码"
          class="input"
        />
      </div>
      <div class="form-item">
        <input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          class="input"
        />
      </div>
      <div class="button-group">
        <button class="submit-btn" @click="handleSubmit">确认修改</button>
        <button class="cancel-btn" @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

export default defineComponent({
  name: 'ChangePassword',
  setup() {
    const router = useRouter()
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const handleSubmit = async () => {
      try {
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
          alert('请填写完整信息')
          return
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          alert('两次输入的新密码不一致')
          return
        }

        await api.updatePassword(passwordForm.oldPassword, passwordForm.newPassword)
        alert('密码修改成功')
        router.push('/user/info')
      } catch (error: any) {
        alert(error.message || '密码修改失败')
      }
    }

    const goBack = () => {
      router.push('/user/info')
    }

    return {
      passwordForm,
      handleSubmit,
      goBack
    }
  }
})
</script>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.change-password-box {
  width: 400px;
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

.form-item {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #409eff;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  background-color: #409eff;
  color: white;
  border: none;
}

.cancel-btn {
  background-color: #909399;
  color: white;
  border: none;
}

.submit-btn:hover {
  background-color: #66b1ff;
}

.cancel-btn:hover {
  background-color: #a6a9ad;
}
</style> 