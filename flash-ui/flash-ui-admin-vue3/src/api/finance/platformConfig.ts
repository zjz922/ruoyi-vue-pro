import request from '@/config/axios'

// ==================== 抖店配置 ====================

// 获取抖店配置分页
export const getDoudianConfigPage = (params: any) => {
  return request.get({ url: '/finance/platform-config/doudian/page', params })
}

// 获取抖店配置详情
export const getDoudianConfig = (id: number) => {
  return request.get({ url: '/finance/platform-config/doudian/get', params: { id } })
}

// 创建抖店配置
export const createDoudianConfig = (data: any) => {
  return request.post({ url: '/finance/platform-config/doudian/create', data })
}

// 更新抖店配置
export const updateDoudianConfig = (data: any) => {
  return request.put({ url: '/finance/platform-config/doudian/update', data })
}

// 删除抖店配置
export const deleteDoudianConfig = (id: number) => {
  return request.delete({ url: '/finance/platform-config/doudian/delete', params: { id } })
}

// 测试抖店连接
export const testDoudianConnection = (id: number) => {
  return request.post({ url: '/finance/platform-config/doudian/test-connection', params: { id } })
}

// 刷新抖店Token
export const refreshDoudianToken = (id: number) => {
  return request.post({ url: '/finance/platform-config/doudian/refresh-token', params: { id } })
}

// ==================== 千川配置 ====================

// 获取千川配置分页
export const getQianchuanConfigPage = (params: any) => {
  return request.get({ url: '/finance/platform-config/qianchuan/page', params })
}

// 获取千川配置详情
export const getQianchuanConfig = (id: number) => {
  return request.get({ url: '/finance/platform-config/qianchuan/get', params: { id } })
}

// 创建千川配置
export const createQianchuanConfig = (data: any) => {
  return request.post({ url: '/finance/platform-config/qianchuan/create', data })
}

// 更新千川配置
export const updateQianchuanConfig = (data: any) => {
  return request.put({ url: '/finance/platform-config/qianchuan/update', data })
}

// 删除千川配置
export const deleteQianchuanConfig = (id: number) => {
  return request.delete({ url: '/finance/platform-config/qianchuan/delete', params: { id } })
}

// 测试千川连接
export const testQianchuanConnection = (id: number) => {
  return request.post({ url: '/finance/platform-config/qianchuan/test-connection', params: { id } })
}

// 刷新千川Token
export const refreshQianchuanToken = (id: number) => {
  return request.post({ url: '/finance/platform-config/qianchuan/refresh-token', params: { id } })
}

// ==================== 聚水潭配置 ====================

// 获取聚水潭配置分页
export const getJushuitanConfigPage = (params: any) => {
  return request.get({ url: '/finance/platform-config/jushuitan/page', params })
}

// 获取聚水潭配置详情
export const getJushuitanConfig = (id: number) => {
  return request.get({ url: '/finance/platform-config/jushuitan/get', params: { id } })
}

// 创建聚水潭配置
export const createJushuitanConfig = (data: any) => {
  return request.post({ url: '/finance/platform-config/jushuitan/create', data })
}

// 更新聚水潭配置
export const updateJushuitanConfig = (data: any) => {
  return request.put({ url: '/finance/platform-config/jushuitan/update', data })
}

// 删除聚水潭配置
export const deleteJushuitanConfig = (id: number) => {
  return request.delete({ url: '/finance/platform-config/jushuitan/delete', params: { id } })
}

// 测试聚水潭连接
export const testJushuitanConnection = (id: number) => {
  return request.post({ url: '/finance/platform-config/jushuitan/test-connection', params: { id } })
}

// 刷新聚水潭Token
export const refreshJushuitanToken = (id: number) => {
  return request.post({ url: '/finance/platform-config/jushuitan/refresh-token', params: { id } })
}
