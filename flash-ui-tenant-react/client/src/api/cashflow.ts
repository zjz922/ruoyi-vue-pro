import { get, post, put, del, getPage } from '@/utils/request';

/**
 * 资金流水API模块
 */

/**
 * 资金流水数据结构
 */
export interface Cashflow {
  id: number;
  shopId: number;
  flowNo: string;
  tradeType: string;
  amount: number;
  balance?: number;
  channel?: string;
  counterparty?: string;
  description?: string;
  tradeTime?: string;
  confirmStatus?: string;
  confirmTime?: string;
  reconciliationStatus?: string;
  platform?: string;
  platformFlowId?: string;
  createTime?: string;
  updateTime?: string;
}

/**
 * 创建流水请求
 */
export interface CreateCashflowRequest {
  shopId: number;
  flowNo: string;
  tradeType: string;
  amount: number;
  channel?: string;
  counterparty?: string;
  description?: string;
  tradeTime?: string;
  remark?: string;
}

/**
 * 更新流水请求
 */
export interface UpdateCashflowRequest {
  id: number;
  confirmStatus?: string;
  reconciliationStatus?: string;
  remark?: string;
}

/**
 * 流水分页查询请求
 */
export interface CashflowPageRequest {
  pageNo?: number;
  pageSize?: number;
  shopId?: number;
  tradeType?: string;
  channel?: string;
  confirmStatus?: string;
  reconciliationStatus?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * 获取流水分页
 */
export const getCashflowPage = (params: CashflowPageRequest) => {
  return getPage<Cashflow>('/finance/cashflow/page', params.pageNo, params.pageSize, {
    params: {
      shopId: params.shopId,
      tradeType: params.tradeType,
      channel: params.channel,
      confirmStatus: params.confirmStatus,
      reconciliationStatus: params.reconciliationStatus,
      startTime: params.startTime,
      endTime: params.endTime,
    },
  });
};

/**
 * 获取流水详情
 */
export const getCashflow = (id: number) => {
  return get<Cashflow>(`/finance/cashflow/${id}`);
};

/**
 * 创建流水
 */
export const createCashflow = (data: CreateCashflowRequest) => {
  return post<number>('/finance/cashflow', data);
};

/**
 * 更新流水
 */
export const updateCashflow = (data: UpdateCashflowRequest) => {
  return put<boolean>('/finance/cashflow', data);
};

/**
 * 删除流水
 */
export const deleteCashflow = (id: number) => {
  return del<boolean>('/finance/cashflow', { params: { id } });
};

/**
 * 确认流水
 */
export const confirmCashflow = (id: number) => {
  return put<boolean>(`/finance/cashflow/${id}/confirm`);
};

/**
 * 获取流水统计
 */
export const getCashflowStats = (shopId: number, startTime?: string, endTime?: string) => {
  return get<any>('/finance/cashflow/stats', {
    params: { shopId, startTime, endTime },
  });
};

/**
 * 获取未对账流水
 */
export const getUnreconciledCashflow = (shopId: number, pageNo: number = 1, pageSize: number = 10) => {
  return getPage<Cashflow>('/finance/cashflow/unreconciled', pageNo, pageSize, {
    params: { shopId },
  });
};

/**
 * 获取待确认流水
 */
export const getUnconfirmedCashflow = (shopId: number, pageNo: number = 1, pageSize: number = 10) => {
  return getPage<Cashflow>('/finance/cashflow/unconfirmed', pageNo, pageSize, {
    params: { shopId },
  });
};

/**
 * 导出流水
 */
export const exportCashflow = (shopId: number, startTime?: string, endTime?: string) => {
  return get<string>('/finance/cashflow/export', {
    params: { shopId, startTime, endTime },
    responseType: 'blob',
  });
};
