import { get, post, put, del, getPage } from '@/utils/request';

/**
 * 商品成本API模块
 */

/**
 * 商品成本数据结构
 */
export interface ProductCost {
  id: number;
  shopId: number;
  productId: string;
  productName: string;
  skuId?: string;
  cost: number;
  salePrice?: number;
  stock?: number;
  costMethod?: string;
  costUpdateTime?: string;
  platform?: string;
  platformProductId?: string;
  createTime?: string;
  updateTime?: string;
}

/**
 * 创建成本请求
 */
export interface CreateProductCostRequest {
  shopId: number;
  productId: string;
  productName: string;
  skuId?: string;
  cost: number;
  salePrice?: number;
  stock?: number;
  costMethod?: string;
  remark?: string;
}

/**
 * 更新成本请求
 */
export interface UpdateProductCostRequest {
  id: number;
  cost?: number;
  salePrice?: number;
  stock?: number;
  costMethod?: string;
  remark?: string;
}

/**
 * 成本分页查询请求
 */
export interface ProductCostPageRequest {
  pageNo?: number;
  pageSize?: number;
  shopId?: number;
  productId?: string;
  productName?: string;
  costMethod?: string;
}

/**
 * 获取成本分页
 */
export const getProductCostPage = (params: ProductCostPageRequest) => {
  return getPage<ProductCost>('/finance/product-cost/page', params.pageNo, params.pageSize, {
    params: {
      shopId: params.shopId,
      productId: params.productId,
      productName: params.productName,
      costMethod: params.costMethod,
    },
  });
};

/**
 * 获取成本详情
 */
export const getProductCost = (id: number) => {
  return get<ProductCost>(`/finance/product-cost/${id}`);
};

/**
 * 创建成本
 */
export const createProductCost = (data: CreateProductCostRequest) => {
  return post<number>('/finance/product-cost', data);
};

/**
 * 更新成本
 */
export const updateProductCost = (data: UpdateProductCostRequest) => {
  return put<boolean>('/finance/product-cost', data);
};

/**
 * 删除成本
 */
export const deleteProductCost = (id: number) => {
  return del<boolean>('/finance/product-cost', { params: { id } });
};

/**
 * 获取成本统计
 */
export const getProductCostStats = (shopId: number) => {
  return get<any>('/finance/product-cost/stats', {
    params: { shopId },
  });
};

/**
 * 获取低库存商品
 */
export const getLowStockProducts = (shopId: number, threshold: number = 10, pageNo: number = 1, pageSize: number = 10) => {
  return getPage<ProductCost>('/finance/product-cost/low-stock', pageNo, pageSize, {
    params: { shopId, threshold },
  });
};

/**
 * 批量更新成本
 */
export const batchUpdateProductCost = (data: UpdateProductCostRequest[]) => {
  return post<boolean>('/finance/product-cost/batch-update', data);
};

/**
 * 导出成本
 */
export const exportProductCost = (shopId: number) => {
  return get<string>('/finance/product-cost/export', {
    params: { shopId },
    responseType: 'blob',
  });
};
