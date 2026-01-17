import request from '@/config/axios'

/**
 * 财务报表API
 * 
 * @author 闪电账PRO
 * @description 提供日报表、周报表、月报表、毛利分析等财务报表功能
 */

// ============ 数据结构定义 ============

/**
 * 报表查询参数
 */
export interface ReportQueryParams {
  shopId: number
  startDate: string
  endDate: string
  pageNo?: number
  pageSize?: number
}

/**
 * 日报表数据
 */
export interface DailyReportData {
  date: string
  orderCount: number
  totalAmount: number
  income: number
  expense: number
  netIncome: number
  conversionRate: number
}

/**
 * 周报表数据
 */
export interface WeeklyReportData {
  weekStart: string
  weekEnd: string
  orderCount: number
  totalAmount: number
  income: number
  expense: number
  netIncome: number
  avgDailyIncome: number
}

/**
 * 月报表数据
 */
export interface MonthlyReportData {
  month: string
  orderCount: number
  totalAmount: number
  income: number
  expense: number
  netIncome: number
  avgDailyIncome: number
  grossProfitRate: number
}

/**
 * 毛利分析数据
 */
export interface ProfitAnalysisData {
  date: string
  productCount: number
  totalCost: number
  totalRevenue: number
  grossProfit: number
  grossProfitRate: number
  topProducts: Array<{
    productId: number
    productName: string
    sales: number
    cost: number
    profit: number
    profitRate: number
  }>
}

/**
 * 报表统计数据
 */
export interface ReportStatistics {
  totalIncome: number
  totalExpense: number
  netIncome: number
  orderCount: number
  incomeGrowth: number
  expenseGrowth: number
  orderGrowth: number
}

/**
 * 收入来源分布
 */
export interface IncomeDistribution {
  source: string
  amount: number
  percentage: number
}

/**
 * 支出分类分布
 */
export interface ExpenseDistribution {
  category: string
  amount: number
  percentage: number
}

// ============ API接口定义 ============

/**
 * 获取日报表
 * 
 * @param params 查询参数
 * @returns 日报表数据
 */
export const getDailyReport = (params: ReportQueryParams) => {
  return request.get<DailyReportData[]>('/finance/report/daily', { params })
}

/**
 * 获取周报表
 * 
 * @param params 查询参数
 * @returns 周报表数据
 */
export const getWeeklyReport = (params: ReportQueryParams) => {
  return request.get<WeeklyReportData[]>('/finance/report/weekly', { params })
}

/**
 * 获取月报表
 * 
 * @param params 查询参数
 * @returns 月报表数据
 */
export const getMonthlyReport = (params: ReportQueryParams) => {
  return request.get<MonthlyReportData[]>('/finance/report/monthly', { params })
}

/**
 * 获取毛利分析
 * 
 * @param params 查询参数
 * @returns 毛利分析数据
 */
export const getProfitAnalysis = (params: ReportQueryParams) => {
  return request.get<ProfitAnalysisData[]>('/finance/report/profitanalysis', { params })
}

/**
 * 获取报表统计数据
 * 
 * @param shopId 店铺ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 统计数据
 */
export const getReportStatistics = (shopId: number, startDate: string, endDate: string) => {
  return request.get<ReportStatistics>('/finance/report/statistics', {
    params: { shopId, startDate, endDate },
  })
}

/**
 * 获取收入来源分布
 * 
 * @param shopId 店铺ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 收入分布数据
 */
export const getIncomeDistribution = (shopId: number, startDate: string, endDate: string) => {
  return request.get<IncomeDistribution[]>('/finance/report/income-distribution', {
    params: { shopId, startDate, endDate },
  })
}

/**
 * 获取支出分类分布
 * 
 * @param shopId 店铺ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 支出分布数据
 */
export const getExpenseDistribution = (shopId: number, startDate: string, endDate: string) => {
  return request.get<ExpenseDistribution[]>('/finance/report/expense-distribution', {
    params: { shopId, startDate, endDate },
  })
}

/**
 * 导出日报表
 * 
 * @param params 查询参数
 * @returns Excel文件
 */
export const exportDailyReport = (params: ReportQueryParams) => {
  return request.get('/finance/report/daily/export', {
    params,
    responseType: 'blob',
  })
}

/**
 * 导出周报表
 * 
 * @param params 查询参数
 * @returns Excel文件
 */
export const exportWeeklyReport = (params: ReportQueryParams) => {
  return request.get('/finance/report/weekly/export', {
    params,
    responseType: 'blob',
  })
}

/**
 * 导出月报表
 * 
 * @param params 查询参数
 * @returns Excel文件
 */
export const exportMonthlyReport = (params: ReportQueryParams) => {
  return request.get('/finance/report/monthly/export', {
    params,
    responseType: 'blob',
  })
}

/**
 * 导出毛利分析
 * 
 * @param params 查询参数
 * @returns Excel文件
 */
export const exportProfitAnalysis = (params: ReportQueryParams) => {
  return request.get('/finance/report/profitanalysis/export', {
    params,
    responseType: 'blob',
  })
}

/**
 * 获取报表对比数据
 * 
 * @param shopId 店铺ID
 * @param currentStartDate 当前周期开始日期
 * @param currentEndDate 当前周期结束日期
 * @param previousStartDate 上一周期开始日期
 * @param previousEndDate 上一周期结束日期
 * @returns 对比数据
 */
export const getReportComparison = (
  shopId: number,
  currentStartDate: string,
  currentEndDate: string,
  previousStartDate: string,
  previousEndDate: string
) => {
  return request.get('/finance/report/comparison', {
    params: {
      shopId,
      currentStartDate,
      currentEndDate,
      previousStartDate,
      previousEndDate,
    },
  })
}

/**
 * 获取报表趋势数据
 * 
 * @param shopId 店铺ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param granularity 粒度 (day/week/month)
 * @returns 趋势数据
 */
export const getReportTrend = (
  shopId: number,
  startDate: string,
  endDate: string,
  granularity: 'day' | 'week' | 'month' = 'day'
) => {
  return request.get('/finance/report/trend', {
    params: { shopId, startDate, endDate, granularity },
  })
}

/**
 * 获取报表预警数据
 * 
 * @param shopId 店铺ID
 * @returns 预警数据
 */
export const getReportAlerts = (shopId: number) => {
  return request.get('/finance/report/alerts', {
    params: { shopId },
  })
}

/**
 * 生成自定义报表
 * 
 * @param shopId 店铺ID
 * @param reportType 报表类型
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param metrics 指标列表
 * @returns 自定义报表数据
 */
export const generateCustomReport = (
  shopId: number,
  reportType: string,
  startDate: string,
  endDate: string,
  metrics: string[]
) => {
  return request.post('/finance/report/custom', {
    shopId,
    reportType,
    startDate,
    endDate,
    metrics,
  })
}

/**
 * 保存报表模板
 * 
 * @param templateName 模板名称
 * @param reportType 报表类型
 * @param metrics 指标列表
 * @param config 配置信息
 * @returns 模板ID
 */
export const saveReportTemplate = (
  templateName: string,
  reportType: string,
  metrics: string[],
  config: Record<string, any>
) => {
  return request.post<number>('/finance/report/template/save', {
    templateName,
    reportType,
    metrics,
    config,
  })
}

/**
 * 获取报表模板列表
 * 
 * @returns 模板列表
 */
export const getReportTemplates = () => {
  return request.get('/finance/report/template/list')
}

/**
 * 删除报表模板
 * 
 * @param templateId 模板ID
 * @returns 是否删除成功
 */
export const deleteReportTemplate = (templateId: number) => {
  return request.delete(`/finance/report/template/${templateId}`)
}

/**
 * 获取报表数据字典
 * 
 * @returns 数据字典
 */
export const getReportDictionary = () => {
  return request.get('/finance/report/dictionary')
}

// ============ 管理员端报表API ============

/**
 * 获取报表总览数据（管理员端）
 */
export const getReportOverview = (params: any) => {
  return request.get({ url: '/finance/report/overview', params })
}

/**
 * 获取租户排行榜
 */
export const getTenantRanking = (params: any) => {
  return request.get({ url: '/finance/report/tenant-ranking', params })
}

/**
 * 获取平台分布数据
 */
export const getPlatformDistribution = (params: any) => {
  return request.get({ url: '/finance/report/platform-distribution', params })
}

/**
 * 获取租户详细报表
 */
export const getTenantReport = (tenantId: number, params: any) => {
  return request.get({ url: `/finance/report/tenant/${tenantId}`, params })
}

/**
 * 获取店铺对比数据
 */
export const getShopComparison = (tenantId: number, params: any) => {
  return request.get({ url: `/finance/report/tenant/${tenantId}/shop-comparison`, params })
}

/**
 * 创建导出任务
 */
export const createExportTask = (data: any) => {
  return request.post({ url: '/finance/report/export/create', data })
}

/**
 * 获取导出历史
 */
export const getExportHistory = (params: any) => {
  return request.get({ url: '/finance/report/export/history', params })
}

/**
 * 下载导出文件
 */
export const downloadExportFile = (id: number) => {
  return request.download({ url: `/finance/report/export/download/${id}` })
}
