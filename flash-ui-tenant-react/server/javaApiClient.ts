/**
 * Java后端API调用客户端
 * 
 * 说明：
 * - 租户端（Node.js/React）只负责数据读取和展示
 * - 所有数据库操作由后端Java服务实现
 * - 本文件封装调用后端Java API的方法
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @date 2025-01-14
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// ============================================================================
// 配置常量
// ============================================================================

/** Java后端API基础URL，从环境变量读取 */
const JAVA_API_BASE_URL = process.env.JAVA_API_BASE_URL || 'http://localhost:8080/api';

/** API请求超时时间（毫秒） */
const API_TIMEOUT = 30000;

// ============================================================================
// 类型定义
// ============================================================================

/** API响应基础结构 */
interface ApiResponse<T> {
  /** 响应码，0表示成功 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
}

/** 分页请求参数 */
interface PageRequest {
  /** 页码，从1开始 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
}

/** 分页响应结构 */
interface PageResponse<T> {
  /** 数据列表 */
  list: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
}

// ============================================================================
// 勾稽检查相关类型
// ============================================================================

/** 勾稽检查结果 */
export interface ReconciliationResult {
  /** 检查ID */
  id: string;
  /** 检查类型：realtime-实时、daily-日结、monthly-月结 */
  type: 'realtime' | 'daily' | 'monthly';
  /** 检查时间 */
  checkTime: string;
  /** 检查状态：success-成功、warning-警告、error-错误 */
  status: 'success' | 'warning' | 'error';
  /** 检查项列表 */
  items: ReconciliationItem[];
  /** 异常数量 */
  exceptionCount: number;
  /** 检查摘要 */
  summary: string;
}

/** 勾稽检查项 */
export interface ReconciliationItem {
  /** 检查项名称 */
  name: string;
  /** 期望值 */
  expected: number;
  /** 实际值 */
  actual: number;
  /** 差异值 */
  difference: number;
  /** 差异率 */
  differenceRate: number;
  /** 状态：match-匹配、mismatch-不匹配 */
  status: 'match' | 'mismatch';
  /** 容差 */
  tolerance: number;
}

/** 勾稽异常 */
export interface ReconciliationException {
  /** 异常ID */
  id: string;
  /** 异常类型 */
  type: string;
  /** 异常描述 */
  description: string;
  /** 异常等级：low-低、medium-中、high-高 */
  level: 'low' | 'medium' | 'high';
  /** 发生时间 */
  occurTime: string;
  /** 处理状态：pending-待处理、processing-处理中、resolved-已解决 */
  status: 'pending' | 'processing' | 'resolved';
  /** 关联订单号 */
  orderNo?: string;
  /** 关联单据号 */
  documentNo?: string;
}

// ============================================================================
// 订单同步相关类型
// ============================================================================

/** 同步结果 */
export interface SyncResult {
  /** 同步ID */
  syncId: string;
  /** 同步时间 */
  syncTime: string;
  /** 同步状态：success-成功、partial-部分成功、failed-失败 */
  status: 'success' | 'partial' | 'failed';
  /** 新增订单数 */
  addedCount: number;
  /** 更新订单数 */
  updatedCount: number;
  /** 失败订单数 */
  failedCount: number;
  /** 错误信息列表 */
  errors: string[];
}

/** 对账结果 */
export interface CompareResult {
  /** 对账ID */
  compareId: string;
  /** 对账时间 */
  compareTime: string;
  /** 匹配订单数 */
  matchedCount: number;
  /** 不匹配订单数 */
  mismatchedCount: number;
  /** 本地多余订单数 */
  localOnlyCount: number;
  /** 远程多余订单数 */
  remoteOnlyCount: number;
  /** 差异详情列表 */
  differences: OrderDifference[];
}

/** 订单差异 */
export interface OrderDifference {
  /** 订单号 */
  orderNo: string;
  /** 差异类型：amount-金额差异、status-状态差异、missing-缺失 */
  type: 'amount' | 'status' | 'missing';
  /** 本地值 */
  localValue: string;
  /** 远程值 */
  remoteValue: string;
  /** 差异描述 */
  description: string;
}

/** 同步日志 */
export interface SyncLog {
  /** 日志ID */
  id: string;
  /** 同步类型：order-订单、product-商品、cost-成本 */
  type: string;
  /** 同步时间 */
  syncTime: string;
  /** 同步状态 */
  status: 'success' | 'partial' | 'failed';
  /** 同步数量 */
  count: number;
  /** 耗时（毫秒） */
  duration: number;
  /** 错误信息 */
  errorMessage?: string;
}

// ============================================================================
// 单据相关类型
// ============================================================================

/** 单据类型 */
export type DocumentType = 'picking' | 'outbound' | 'inbound' | 'return';

/** 单据状态 */
export type DocumentStatus = 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';

/** 单据信息 */
export interface Document {
  /** 单据ID */
  id: string;
  /** 单据编号 */
  documentNo: string;
  /** 单据类型 */
  type: DocumentType;
  /** 单据状态 */
  status: DocumentStatus;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 总金额 */
  totalAmount: number;
  /** 关联订单数 */
  orderCount: number;
  /** 备注 */
  remark?: string;
}

/** 单据与订单关联 */
export interface DocumentOrderLink {
  /** 关联ID */
  id: string;
  /** 单据ID */
  documentId: string;
  /** 订单ID */
  orderId: string;
  /** 订单号 */
  orderNo: string;
  /** 关联时间 */
  linkTime: string;
  /** 关联金额 */
  amount: number;
}

// ============================================================================
// API客户端实例
// ============================================================================

/** 创建API客户端实例 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: JAVA_API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      // 可以在这里添加认证token等
      // config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      const data = response.data as ApiResponse<unknown>;
      if (data.code !== 0) {
        throw new Error(data.message || '请求失败');
      }
      return response;
    },
    (error: AxiosError) => {
      const message = error.response?.data 
        ? (error.response.data as { message?: string }).message || error.message
        : error.message;
      throw new Error(message);
    }
  );

  return client;
};

const apiClient = createApiClient();

// ============================================================================
// 勾稽检查API
// ============================================================================

/**
 * 执行实时勾稽检查
 * @param tenantId 租户ID
 * @returns 勾稽检查结果
 */
export async function runRealtimeReconciliation(tenantId: string): Promise<ReconciliationResult> {
  const response = await apiClient.post<ApiResponse<ReconciliationResult>>(
    '/reconciliation/realtime',
    { tenantId }
  );
  return response.data.data;
}

/**
 * 执行日结勾稽检查
 * @param tenantId 租户ID
 * @param date 日期，格式：YYYY-MM-DD
 * @returns 勾稽检查结果
 */
export async function runDailyReconciliation(tenantId: string, date: string): Promise<ReconciliationResult> {
  const response = await apiClient.post<ApiResponse<ReconciliationResult>>(
    '/reconciliation/daily',
    { tenantId, date }
  );
  return response.data.data;
}

/**
 * 执行月结勾稽检查
 * @param tenantId 租户ID
 * @param month 月份，格式：YYYY-MM
 * @returns 勾稽检查结果
 */
export async function runMonthlyReconciliation(tenantId: string, month: string): Promise<ReconciliationResult> {
  const response = await apiClient.post<ApiResponse<ReconciliationResult>>(
    '/reconciliation/monthly',
    { tenantId, month }
  );
  return response.data.data;
}

/**
 * 获取待处理异常列表
 * @param tenantId 租户ID
 * @param pageRequest 分页参数
 * @returns 异常列表
 */
export async function getPendingExceptions(
  tenantId: string,
  pageRequest: PageRequest
): Promise<PageResponse<ReconciliationException>> {
  const response = await apiClient.get<ApiResponse<PageResponse<ReconciliationException>>>(
    '/reconciliation/exceptions',
    { params: { tenantId, ...pageRequest, status: 'pending' } }
  );
  return response.data.data;
}

/**
 * 解决异常
 * @param exceptionId 异常ID
 * @param resolution 解决方案描述
 * @returns 是否成功
 */
export async function resolveException(exceptionId: string, resolution: string): Promise<boolean> {
  const response = await apiClient.post<ApiResponse<boolean>>(
    `/reconciliation/exceptions/${exceptionId}/resolve`,
    { resolution }
  );
  return response.data.data;
}

// ============================================================================
// 订单同步API
// ============================================================================

/**
 * 从抖店同步订单
 * @param tenantId 租户ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 同步结果
 */
export async function syncOrdersFromDoudian(
  tenantId: string,
  startDate: string,
  endDate: string
): Promise<SyncResult> {
  const response = await apiClient.post<ApiResponse<SyncResult>>(
    '/order-sync/doudian',
    { tenantId, startDate, endDate }
  );
  return response.data.data;
}

/**
 * 订单对账
 * @param tenantId 租户ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 对账结果
 */
export async function compareOrders(
  tenantId: string,
  startDate: string,
  endDate: string
): Promise<CompareResult> {
  const response = await apiClient.post<ApiResponse<CompareResult>>(
    '/order-sync/compare',
    { tenantId, startDate, endDate }
  );
  return response.data.data;
}

/**
 * 获取同步日志
 * @param tenantId 租户ID
 * @param pageRequest 分页参数
 * @returns 同步日志列表
 */
export async function getSyncLogs(
  tenantId: string,
  pageRequest: PageRequest
): Promise<PageResponse<SyncLog>> {
  const response = await apiClient.get<ApiResponse<PageResponse<SyncLog>>>(
    '/order-sync/logs',
    { params: { tenantId, ...pageRequest } }
  );
  return response.data.data;
}

/**
 * 获取最后同步时间
 * @param tenantId 租户ID
 * @returns 最后同步时间
 */
export async function getLastSyncTime(tenantId: string): Promise<string | null> {
  const response = await apiClient.get<ApiResponse<string | null>>(
    '/order-sync/last-sync-time',
    { params: { tenantId } }
  );
  return response.data.data;
}

// ============================================================================
// 单据管理API
// ============================================================================

/**
 * 获取单据列表
 * @param tenantId 租户ID
 * @param type 单据类型（可选）
 * @param status 单据状态（可选）
 * @param pageRequest 分页参数
 * @returns 单据列表
 */
export async function getDocuments(
  tenantId: string,
  type?: DocumentType,
  status?: DocumentStatus,
  pageRequest?: PageRequest
): Promise<PageResponse<Document>> {
  const response = await apiClient.get<ApiResponse<PageResponse<Document>>>(
    '/documents',
    { params: { tenantId, type, status, ...pageRequest } }
  );
  return response.data.data;
}

/**
 * 获取单据详情
 * @param documentId 单据ID
 * @returns 单据详情
 */
export async function getDocumentDetail(documentId: string): Promise<Document> {
  const response = await apiClient.get<ApiResponse<Document>>(
    `/documents/${documentId}`
  );
  return response.data.data;
}

/**
 * 获取单据关联的订单
 * @param documentId 单据ID
 * @param pageRequest 分页参数
 * @returns 关联订单列表
 */
export async function getDocumentOrders(
  documentId: string,
  pageRequest?: PageRequest
): Promise<PageResponse<DocumentOrderLink>> {
  const response = await apiClient.get<ApiResponse<PageResponse<DocumentOrderLink>>>(
    `/documents/${documentId}/orders`,
    { params: pageRequest }
  );
  return response.data.data;
}

/**
 * 关联订单到单据
 * @param documentId 单据ID
 * @param orderIds 订单ID列表
 * @returns 是否成功
 */
export async function linkOrdersToDocument(documentId: string, orderIds: string[]): Promise<boolean> {
  const response = await apiClient.post<ApiResponse<boolean>>(
    `/documents/${documentId}/link`,
    { orderIds }
  );
  return response.data.data;
}

/**
 * 取消订单与单据的关联
 * @param documentId 单据ID
 * @param orderId 订单ID
 * @returns 是否成功
 */
export async function unlinkOrderFromDocument(documentId: string, orderId: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    `/documents/${documentId}/orders/${orderId}`
  );
  return response.data.data;
}

/**
 * 更新单据状态
 * @param documentId 单据ID
 * @param status 新状态
 * @returns 是否成功
 */
export async function updateDocumentStatus(documentId: string, status: DocumentStatus): Promise<boolean> {
  const response = await apiClient.put<ApiResponse<boolean>>(
    `/documents/${documentId}/status`,
    { status }
  );
  return response.data.data;
}

// ============================================================================
// 导出所有API方法
// ============================================================================

export const javaApi = {
  // 勾稽检查
  reconciliation: {
    runRealtime: runRealtimeReconciliation,
    runDaily: runDailyReconciliation,
    runMonthly: runMonthlyReconciliation,
    getPendingExceptions,
    resolveException,
  },
  // 订单同步
  orderSync: {
    syncFromDoudian: syncOrdersFromDoudian,
    compare: compareOrders,
    getLogs: getSyncLogs,
    getLastSyncTime,
  },
  // 单据管理
  document: {
    getList: getDocuments,
    getDetail: getDocumentDetail,
    getOrders: getDocumentOrders,
    linkOrders: linkOrdersToDocument,
    unlinkOrder: unlinkOrderFromDocument,
    updateStatus: updateDocumentStatus,
  },
};

export default javaApi;
