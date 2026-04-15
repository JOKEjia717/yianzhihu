<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">欢迎登录</h2>
      <div class="form-item">
        <input
          v-model="loginForm.username"
          type="text"
          placeholder="请输入用户名"
          class="input"
        />
      </div>
      <div class="form-item">
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          class="input"
        />
      </div>
      <div class="form-item">
        <button class="login-btn" @click="handleLogin">登录</button>
      </div>
      <div class="form-item">
        <router-link to="/register" class="register-link">
          还没有账号？立即注册
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
  name: 'Login',
  setup() {
    const router = useRouter()
    const loginForm = reactive({
      username: '',
      password: ''
    })

    const handleLogin = async () => {
      try {
        if (!loginForm.username || !loginForm.password) {
          alert('请输入用户名和密码')
          return
        }

        const res = await api.login(loginForm)
        setToken(res.token)
        router.push('/user/info')
      } catch (error: any) {
        alert(error.message || '登录失败')
      }
    }

    return {
      loginForm,
      handleLogin
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
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

.login-btn {
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

.login-btn:hover {
  background-color: #66b1ff;
}

.register-link {
  display: block;
  text-align: center;
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.register-link:hover {
  color: #66b1ff;
}
</style> 