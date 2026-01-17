import request from '@/config/axios'

/**
 * 经营分析API
 * 
 * @author 闪电账PRO
 */

// ==================== 运营仪表盘 ====================

/**
 * 获取仪表盘数据
 */
export const getDashboard = () => {
  return request.get({ url: '/finance/analysis/dashboard' })
}

/**
 * 获取实时数据
 */
export const getRealtimeData = () => {
  return request.get({ url: '/finance/analysis/dashboard/realtime' })
}

/**
 * 获取健康度评分
 */
export const getHealthScore = () => {
  return request.get({ url: '/finance/analysis/dashboard/health-score' })
}

// ==================== 租户活跃度分析 ====================

/**
 * 获取租户活跃度数据
 */
export const getTenantActive = (params: any) => {
  return request.get({ url: '/finance/analysis/tenant/active', params })
}

/**
 * 获取留存分析数据
 */
export const getTenantRetention = (params: any) => {
  return request.get({ url: '/finance/analysis/tenant/retention', params })
}

/**
 * 获取租户分布数据
 */
export const getTenantDistribution = (params: any) => {
  return request.get({ url: '/finance/analysis/tenant/distribution', params })
}

// ==================== 收入分析 ====================

/**
 * 获取收入概览数据
 */
export const getRevenueOverview = (params: any) => {
  return request.get({ url: '/finance/analysis/revenue/overview', params })
}

/**
 * 获取收入趋势数据
 */
export const getRevenueTrend = (params: any) => {
  return request.get({ url: '/finance/analysis/revenue/trend', params })
}

/**
 * 获取收入构成数据
 */
export const getRevenueComposition = (params: any) => {
  return request.get({ url: '/finance/analysis/revenue/composition', params })
}

/**
 * 获取ARPU分析数据
 */
export const getArpuData = (params: any) => {
  return request.get({ url: '/finance/analysis/revenue/arpu', params })
}

// ==================== 趋势分析 ====================

/**
 * 获取用户增长趋势
 */
export const getUserGrowthTrend = (params: any) => {
  return request.get({ url: '/finance/analysis/trend/user-growth', params })
}

/**
 * 获取数据量趋势
 */
export const getDataVolumeTrend = (params: any) => {
  return request.get({ url: '/finance/analysis/trend/data-volume', params })
}

/**
 * 获取使用趋势
 */
export const getUsageTrend = (params: any) => {
  return request.get({ url: '/finance/analysis/trend/usage', params })
}

/**
 * 获取趋势预测
 */
export const getTrendForecast = (params: any) => {
  return request.get({ url: '/finance/analysis/trend/forecast', params })
}
