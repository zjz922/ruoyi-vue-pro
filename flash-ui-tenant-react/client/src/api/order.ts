import { get, post, put, del, getPage } from '@/utils/request';

/**
 * 订单API模块
 */

/**
 * 订单数据结构
 */
export interface Order {
  id: number;
  shopId: number;
  orderNo: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  payAmount: number;
  status: string;
  receiverName?: string;
  receiverAddress?: string;
  receiverPhone?: string;
  platform?: string;
  platformOrderId?: string;
  createTime?: string;
  updateTime?: string;
}

/**
 * 创建订单请求
 */
export interface CreateOrderRequest {
  shopId: number;
  orderNo: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  payAmount: number;
  status?: string;
  platform?: string;
  remark?: string;
}

/**
 * 更新订单请求
 */
export interface UpdateOrderRequest {
  id: number;
  status?: string;
  receiverName?: string;
  receiverAddress?: string;
  receiverPhone?: string;
  remark?: string;
}

/**
 * 订单分页查询请求
 */
export interface OrderPageRequest {
  pageNo?: number;
  pageSize?: number;
  shopId?: number;
  status?: string;
  platform?: string;
  orderNo?: string;
}

/**
 * 获取订单分页
 */
export const getOrderPage = (params: OrderPageRequest) => {
  return getPage<Order>('/finance/order/page', params.pageNo, params.pageSize, {
    params: {
      shopId: params.shopId,
      status: params.status,
      platform: params.platform,
      orderNo: params.orderNo,
    },
  });
};

/**
 * 获取订单详情
 */
export const getOrder = (id: number) => {
  return get<Order>(`/finance/order/${id}`);
};

/**
 * 创建订单
 */
export const createOrder = (data: CreateOrderRequest) => {
  return post<number>('/finance/order', data);
};

/**
 * 更新订单
 */
export const updateOrder = (data: UpdateOrderRequest) => {
  return put<boolean>('/finance/order', data);
};

/**
 * 删除订单
 */
export const deleteOrder = (id: number) => {
  return del<boolean>('/finance/order', { params: { id } });
};

/**
 * 获取订单统计
 */
export const getOrderStats = (shopId: number, startTime?: string, endTime?: string) => {
  return get<any>('/finance/order/stats', {
    params: { shopId, startTime, endTime },
  });
};

/**
 * 导出订单
 */
export const exportOrders = (shopId: number, status?: string, startTime?: string, endTime?: string) => {
  return get<string>('/finance/order/export', {
    params: { shopId, status, startTime, endTime },
    responseType: 'blob',
  });
};
