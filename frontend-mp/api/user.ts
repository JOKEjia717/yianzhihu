import { request } from '../utils/request'

const BASE_URL = 'http://localhost:8080'

// 登录接口
export const login = (account: string, password: string) => {
  return request.post('/children/loginByUsername', {
    data: {
      account: account,
      password: password
    }
  })
}

// 注册接口
export const register = (data: {
  name: string
  account: string
  password: string
  phone: string
}) => {
  return request.post('/children/register', {
    data: {
      name: data.name,
      account: data.account,
      password: data.password,
      phone: data.phone
    }
  })
} 