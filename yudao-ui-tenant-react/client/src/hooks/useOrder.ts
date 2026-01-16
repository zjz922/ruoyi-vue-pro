import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as orderApi from '@/api/order';

/**
 * 订单相关的React Query Hooks
 */

/**
 * 获取订单分页
 */
export const useOrderPage = (params: orderApi.OrderPageRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrderPage(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

/**
 * 获取订单详情
 */
export const useOrder = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrder(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 获取订单统计
 */
export const useOrderStats = (shopId: number, startTime?: string, endTime?: string) => {
  return useQuery({
    queryKey: ['orderStats', shopId, startTime, endTime],
    queryFn: () => orderApi.getOrderStats(shopId, startTime, endTime),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * 创建订单
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: orderApi.CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: () => {
      // 重新获取订单列表
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/**
 * 更新订单
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: orderApi.UpdateOrderRequest) => orderApi.updateOrder(data),
    onSuccess: (_, variables) => {
      // 重新获取订单详情和列表
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/**
 * 删除订单
 */
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/**
 * 导出订单
 */
export const useExportOrders = () => {
  return useMutation({
    mutationFn: (params: { shopId: number; status?: string; startTime?: string; endTime?: string }) =>
      orderApi.exportOrders(params.shopId, params.status, params.startTime, params.endTime),
  });
};
