import request from '@/config/axios'

/**
 * 数据对账API
 * 
 * @author 闪电账PRO
 */

// ==================== 对账总览 ====================

/**
 * 获取对账总览数据
 */
export const getReconciliationOverview = () => {
  return request.get({ url: '/finance/reconciliation/overview' })
}

/**
 * 发起对账任务
 */
export const startReconciliation = (data: any) => {
  return request.post({ url: '/finance/reconciliation/start', data })
}

/**
 * 获取对账进度
 */
export const getReconciliationProgress = () => {
  return request.get({ url: '/finance/reconciliation/progress' })
}

// ==================== 差异管理 ====================

/**
 * 获取差异分页列表
 */
export const getDiffPage = (params: any) => {
  return request.get({ url: '/finance/reconciliation/diff/page', params })
}

/**
 * 获取差异详情
 */
export const getDiffDetail = (id: number) => {
  return request.get({ url: '/finance/reconciliation/diff/get', params: { id } })
}

/**
 * 处理差异
 */
export const handleDiff = (data: any) => {
  return request.put({ url: '/finance/reconciliation/diff/handle', data })
}

/**
 * 批量处理差异
 */
export const batchHandleDiff = (data: any) => {
  return request.put({ url: '/finance/reconciliation/diff/batch-handle', data })
}

// ==================== 异常监控 ====================

/**
 * 获取异常分页列表
 */
export const getExceptionPage = (params: any) => {
  return request.get({ url: '/finance/reconciliation/exception/page', params })
}

/**
 * 获取异常统计数据
 */
export const getExceptionStatistics = (params: any) => {
  return request.get({ url: '/finance/reconciliation/exception/statistics', params })
}

/**
 * 处理异常
 */
export const handleException = (data: any) => {
  return request.put({ url: '/finance/reconciliation/exception/handle', data })
}
