import request from '@/config/axios'

/**
 * 获取抖店授权URL
 */
export const getAuthUrl = () => {
  return request.get({ url: '/finance/doudian/oauth/authorize-url' })
}

/**
 * 获取授权状态
 */
export const getAuthStatus = () => {
  return request.get({ url: '/finance/doudian/oauth/status' })
}

/**
 * 使用授权码换取Token
 */
export const exchangeToken = (data: { code: string; state: string }) => {
  return request.post({ url: '/finance/doudian/oauth/exchange-token', data })
}

/**
 * 刷新Token
 */
export const refreshToken = (data: { shopId: number }) => {
  return request.post({ url: '/finance/doudian/oauth/refresh-token', data })
}

/**
 * 撤销授权
 */
export const revokeAuth = (data: { shopId: number }) => {
  return request.post({ url: '/finance/doudian/oauth/revoke', data })
}

/**
 * OAuth回调处理
 */
export const handleCallback = (params: { code: string; state: string }) => {
  return request.get({ url: '/finance/doudian/oauth/callback', params })
}
