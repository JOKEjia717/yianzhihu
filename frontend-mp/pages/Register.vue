<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="title">用户注册</h2>
      <div class="form-item">
        <input
          v-model="registerForm.username"
          type="text"
          placeholder="请输入用户名"
          class="input"
        />
      </div>
      <div class="form-item">
        <input
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码"
          class="input"
        />
      </div>
      <div class="form-item">
        <input
          v-model="registerForm.email"
          type="email"
          placeholder="请输入邮箱"
          class="input"
        />
      </div>
      <div class="form-item">
        <button class="register-btn" @click="handleRegister">注册</button>
      </div>
      <div class="form-item">
        <router-link to="/login" class="login-link">
          已有账号？立即登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { setToken } from '../utils/auth'

export default defineComponent({
  name: 'Register',
  setup() {
    const router = useRouter()
    const registerForm = reactive({
      username: '',
      password: '',
      email: ''
    })

    const handleRegister = async () => {
      try {
        if (!registerForm.username || !registerForm.password || !registerForm.email) {
          alert('请填写完整信息')
          return
        }

        const res = await api.register(registerForm)
        setToken(res.token)
        router.push('/user/info')
      } catch (error: any) {
        alert(error.message || '注册失败')
      }
    }

    return {
      registerForm,
      handleRegister
    }
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-box {
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

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-btn:hover {
  background-color: #66b1ff;
}

.login-link {
  display: block;
  text-align: center;
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.login-link:hover {
  color: #66b1ff;
}
</style> 