import request from '../utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

class ApiService {
  // 用户认证相关
  async login(params: LoginParams) {
    return request.post<{ token: string }>('/auth/login', params)
  }

  async register(params: RegisterParams) {
    return request.post<{ token: string }>('/auth/register', params)
  }

  async logout() {
    return request.post('/auth/logout')
  }

  // 用户信息相关
  async getUserInfo() {
    return request.get<UserInfo>('/user/info')
  }

  async updateUserInfo(data: Partial<UserInfo>) {
    return request.put<UserInfo>('/user/info', data)
  }

  async updatePassword(oldPassword: string, newPassword: string) {
    return request.put('/user/password', { oldPassword, newPassword })
  }
}

export const api = new ApiService() 