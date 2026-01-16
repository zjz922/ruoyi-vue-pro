import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productCostApi from '@/api/productcost';

/**
 * 商品成本相关的React Query Hooks
 */

/**
 * 获取成本分页
 */
export const useProductCostPage = (params: productCostApi.ProductCostPageRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['productCosts', params],
    queryFn: () => productCostApi.getProductCostPage(params),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 获取成本详情
 */
export const useProductCost = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['productCost', id],
    queryFn: () => productCostApi.getProductCost(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 获取成本统计
 */
export const useProductCostStats = (shopId: number) => {
  return useQuery({
    queryKey: ['productCostStats', shopId],
    queryFn: () => productCostApi.getProductCostStats(shopId),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * 获取低库存商品
 */
export const useLowStockProducts = (shopId: number, threshold: number = 10, pageNo: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['lowStockProducts', shopId, threshold, pageNo, pageSize],
    queryFn: () => productCostApi.getLowStockProducts(shopId, threshold, pageNo, pageSize),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 创建成本
 */
export const useCreateProductCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: productCostApi.CreateProductCostRequest) => productCostApi.createProductCost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCosts'] });
      queryClient.invalidateQueries({ queryKey: ['productCostStats'] });
    },
  });
};

/**
 * 更新成本
 */
export const useUpdateProductCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: productCostApi.UpdateProductCostRequest) => productCostApi.updateProductCost(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productCost', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['productCosts'] });
      queryClient.invalidateQueries({ queryKey: ['productCostStats'] });
    },
  });
};

/**
 * 删除成本
 */
export const useDeleteProductCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productCostApi.deleteProductCost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCosts'] });
      queryClient.invalidateQueries({ queryKey: ['productCostStats'] });
    },
  });
};

/**
 * 批量更新成本
 */
export const useBatchUpdateProductCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: productCostApi.UpdateProductCostRequest[]) => productCostApi.batchUpdateProductCost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCosts'] });
      queryClient.invalidateQueries({ queryKey: ['productCostStats'] });
    },
  });
};

/**
 * 导出成本
 */
export const useExportProductCost = () => {
  return useMutation({
    mutationFn: (shopId: number) => productCostApi.exportProductCost(shopId),
  });
};
