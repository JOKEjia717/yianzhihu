//import { ref } from 'vue'

// 添加类型声明
declare const uni: any

// 定义请求选项类型
interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
}

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  skipToken?: boolean
  [key: string]: any
}

const isSafeHeaderValue = (value: string) => {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code > 255 || code === 10 || code === 13) {
      return false
    }
  }

  return true
}

const normalizeHeaderValue = (value: any) => {
  if (value === null || value === undefined) {
    return ''
  }

  const text = String(value).trim()
  if (!text) {
    return ''
  }

  return isSafeHeaderValue(text) ? text : ''
}

const buildSafeHeaders = (headers: Record<string, any>) => {
  const safeHeaders: Record<string, string> = {}

  Object.keys(headers || {}).forEach(key => {
    const safeValue = normalizeHeaderValue(headers[key])
    if (safeValue) {
      safeHeaders[key] = safeValue
    } else if (headers[key] !== undefined && headers[key] !== null) {
      console.warn(`[request] 跳过非法请求头值: ${key}`)
    }
  })

  return safeHeaders
}

// 存储 token
let accessToken = uni.getStorageSync('accessToken') || ''
let refreshToken = uni.getStorageSync('refreshToken') || ''

// 更新 token
export const updateTokens = (newAccessToken: string, newRefreshToken: string) => {
  accessToken = newAccessToken
  refreshToken = newRefreshToken
  uni.setStorageSync('accessToken', newAccessToken)
  uni.setStorageSync('refreshToken', newRefreshToken)
}

// 创建请求实例
const createRequest = (config: RequestConfig) => {
  // 添加默认配置
  const defaultConfig = {
    baseURL: 'http://localhost:8080',
    header: {
      'Content-Type': 'application/json'
    }
  }

  // 每次请求都从存储中读取，避免退出登录后还带着旧 token
  accessToken = uni.getStorageSync('accessToken') || ''
  refreshToken = uni.getStorageSync('refreshToken') || ''

  // 如果不需要携带 token，直接使用默认配置
  if (!config.skipToken && accessToken && refreshToken) {
    defaultConfig.header['accessToken'] = accessToken
    defaultConfig.header['refreshToken'] = refreshToken
  }

  // 合并配置
  const finalConfig = {
    ...defaultConfig,
    ...config,
    url: `${defaultConfig.baseURL}${config.url}`,
    header: buildSafeHeaders({
      ...defaultConfig.header,
      ...(config.header || {})
    })
  }

  return new Promise((resolve, reject) => {
    uni.request({
      ...finalConfig,
      success: (res: any) => {
        // 检查响应头中是否有新的 token（不区分大小写）
        const headers = res.header || {}
        const lowerCaseHeaders: Record<string, string> = {}
        
        // 将所有响应头转换为小写，以便不区分大小写比较
        Object.keys(headers).forEach(key => {
          lowerCaseHeaders[key.toLowerCase()] = headers[key]
        })
        
        // 检查各种可能的 token 键名
        const newAccessToken = 
          lowerCaseHeaders['accesstoken'] || 
          lowerCaseHeaders['access-token'] || 
          lowerCaseHeaders['access_token'] ||
          res.data?.data?.accessToken
          
        const newRefreshToken = 
          lowerCaseHeaders['refreshtoken'] || 
          lowerCaseHeaders['refresh-token'] || 
          lowerCaseHeaders['refresh_token'] ||
          res.data?.data?.refreshToken
        
        // 如果发现新的 token，则更新
        if (newAccessToken && newRefreshToken) {
          console.log('发现新的 token，正在更新...')
          updateTokens(newAccessToken, newRefreshToken)
          
          // 更新当前请求的 header
          finalConfig.header = buildSafeHeaders({
            ...finalConfig.header,
            'accessToken': newAccessToken,
            'refreshToken': newRefreshToken
          })
        }
        
        resolve(res)
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}

// 请求函数
export const request = (url: string, config: Partial<RequestConfig> = {}) => {
  return createRequest({ ...config, url })
}

// 添加便捷方法
request.get = (url: string, config?: Partial<RequestConfig>) => {
  return createRequest({ ...config, url, method: 'GET' })
}

request.post = (url: string, config?: Partial<RequestConfig>) => {
  return createRequest({ ...config, url, method: 'POST' })
}

request.put = (url: string, data?: any, config?: Partial<RequestConfig>) => {
  return createRequest({ ...config, url, data, method: 'PUT' })
}

request.delete = (url: string, config?: Partial<RequestConfig>) => {
  return createRequest({ ...config, url, method: 'DELETE' })
} 
