import { request } from '../utils/request'

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

// 绑定老人
export const bindElder = (elderId: string) => {
  return request.post(`/children/elder/bind?elderId=${encodeURIComponent(elderId)}`)
}

// 获取当前子女绑定的老人列表
export const getBoundElders = () => {
  return request.get('/children/elder/bound')
}
