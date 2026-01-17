# 闪电账PRO 前端对接指南

## 一、概述

本文档指导如何将闪电账PRO的React前端从tRPC调用方式迁移到RuoYi-Vue-Pro的RESTful API调用方式。

## 二、API调用层封装

### 2.1 创建统一请求工具

在 `client/src/utils/` 目录下创建 `request.ts`：

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/app-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // 租户ID
    const tenantId = localStorage.getItem('TENANT_ID');
    if (tenantId) {
      config.headers['tenant-id'] = tenantId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // code为0表示成功
    if (res.code === 0) {
      return res.data;
    }
    // 处理错误
    if (res.code === 401) {
      // 未登录，跳转登录页
      window.location.href = '/login';
      return Promise.reject(new Error('未登录'));
    }
    return Promise.reject(new Error(res.msg || '请求失败'));
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config });
  },
  upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    return service.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  },
};

export default service;
```

### 2.2 创建API模块

在 `client/src/api/` 目录下创建各模块API文件：

#### productCost.ts

```typescript
import { request } from '@/utils/request';

export interface ProductCost {
  id: number;
  productId: string;
  sku: string;
  title: string;
  cost: number;
  merchantCode?: string;
  price: number;
  customName?: string;
  stock: number;
  status: number;
  effectiveDate?: string;
  shopName: string;
  createTime: string;
  updateTime: string;
}

export interface ProductCostPageParams {
  pageNo?: number;
  pageSize?: number;
  productId?: string;
  title?: string;
  sku?: string;
  shopName?: string;
  status?: number;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}

// 获取商品成本分页列表
export function getProductCostPage(params: ProductCostPageParams) {
  return request.get<PageResult<ProductCost>>('/finance/product-cost/page', params);
}

// 获取商品成本详情
export function getProductCost(id: number) {
  return request.get<ProductCost>('/finance/product-cost/get', { id });
}

// 创建商品成本
export function createProductCost(data: Partial<ProductCost>) {
  return request.post<number>('/finance/product-cost/create', data);
}

// 更新商品成本
export function updateProductCost(data: Partial<ProductCost> & { id: number; reason?: string }) {
  return request.put<boolean>('/finance/product-cost/update', data);
}

// 删除商品成本
export function deleteProductCost(id: number) {
  return request.delete<boolean>('/finance/product-cost/delete', { id });
}

// 批量导入商品成本
export function importProductCosts(file: File) {
  return request.upload<{ createCount: number; updateCount: number; failCount: number; failMsg: string }>(
    '/finance/product-cost/import',
    file
  );
}

// 获取成本变更历史
export function getProductCostHistory(productCostId: number) {
  return request.get<any[]>('/finance/product-cost/history', { productCostId });
}

// 获取店铺名称列表
export function getShopNames() {
  return request.get<string[]>('/finance/product-cost/shop-names');
}
```

#### order.ts

```typescript
import { request } from '@/utils/request';

export interface Order {
  id: number;
  mainOrderNo: string;
  subOrderNo: string;
  productName: string;
  productSpec?: string;
  quantity: number;
  sku?: string;
  unitPrice: number;
  payAmount: number;
  freight: number;
  totalDiscount: number;
  platformDiscount: number;
  merchantDiscount: number;
  influencerDiscount: number;
  serviceFee: number;
  payMethod?: string;
  receiver?: string;
  receiverPhone?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  orderTime?: string;
  payTime?: string;
  shipTime?: string;
  completeTime?: string;
  status: string;
  afterSaleStatus?: string;
  cancelReason?: string;
  appChannel?: string;
  trafficSource?: string;
  orderType?: string;
  influencerId?: string;
  influencerName?: string;
  flagColor?: string;
  merchantRemark?: string;
  buyerMessage?: string;
  shopName: string;
}

export interface OrderPageParams {
  pageNo?: number;
  pageSize?: number;
  mainOrderNo?: string;
  subOrderNo?: string;
  productName?: string;
  receiver?: string;
  status?: string;
  province?: string;
  shopName?: string;
  orderTime?: string[];
}

export interface OrderStats {
  totalCount: number;
  shippedCount: number;
  totalAmount: number;
}

// 获取订单分页列表
export function getOrderPage(params: OrderPageParams) {
  return request.get<{ list: Order[]; total: number }>('/finance/order/page', params);
}

// 获取订单详情
export function getOrder(id: number) {
  return request.get<Order>('/finance/order/get', { id });
}

// 获取订单统计
export function getOrderStats() {
  return request.get<OrderStats>('/finance/order/stats');
}

// 创建订单
export function createOrder(data: Partial<Order>) {
  return request.post<number>('/finance/order/create', data);
}

// 更新订单
export function updateOrder(data: Partial<Order> & { id: number }) {
  return request.put<boolean>('/finance/order/update', data);
}

// 删除订单
export function deleteOrder(id: number) {
  return request.delete<boolean>('/finance/order/delete', { id });
}

// 批量导入订单
export function importOrders(file: File) {
  return request.upload<{ createCount: number; updateCount: number; failCount: number; failMsg: string }>(
    '/finance/order/import',
    file
  );
}

// 获取省份列表
export function getProvinces() {
  return request.get<string[]>('/finance/order/provinces');
}

// 获取订单状态列表
export function getStatuses() {
  return request.get<string[]>('/finance/order/statuses');
}
```

#### doudian.ts

```typescript
import { request } from '@/utils/request';

export interface DoudianConfig {
  id: number;
  shopName: string;
  appKey: string;
  appSecret: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpireTime?: string;
  status: number;
  lastSyncTime?: string;
}

export interface DoudianSyncParams {
  accessToken: string;
  startTime?: string;
  endTime?: string;
  page?: number;
  size?: number;
}

// 检查API配置状态
export function checkDoudianConfig() {
  return request.get<any>('/finance/doudian/config/check');
}

// 获取配置列表
export function getDoudianConfigList() {
  return request.get<DoudianConfig[]>('/finance/doudian/config/list');
}

// 创建配置
export function createDoudianConfig(data: Partial<DoudianConfig>) {
  return request.post<number>('/finance/doudian/config/create', data);
}

// 更新配置
export function updateDoudianConfig(data: Partial<DoudianConfig> & { id: number }) {
  return request.put<boolean>('/finance/doudian/config/update', data);
}

// 删除配置
export function deleteDoudianConfig(id: number) {
  return request.delete<boolean>('/finance/doudian/config/delete', { id });
}

// 同步订单
export function syncDoudianOrders(params: DoudianSyncParams) {
  return request.post<any>('/finance/doudian/order/sync', params);
}

// 获取订单详情
export function getDoudianOrderDetail(accessToken: string, shopOrderId: string) {
  return request.get<any>('/finance/doudian/order/detail', { accessToken, shopOrderId });
}

// 同步商品
export function syncDoudianProducts(params: DoudianSyncParams) {
  return request.post<any>('/finance/doudian/product/sync', params);
}

// 获取商品详情
export function getDoudianProductDetail(accessToken: string, productId: string) {
  return request.get<any>('/finance/doudian/product/detail', { accessToken, productId });
}

// 获取结算账单
export function getDoudianSettleBill(params: DoudianSyncParams) {
  return request.get<any>('/finance/doudian/settle/bill', params);
}

// 获取资金流水
export function getDoudianAccountFlow(params: DoudianSyncParams) {
  return request.get<any>('/finance/doudian/account/flow', params);
}

// 获取达人佣金
export function getDoudianCommission(params: DoudianSyncParams) {
  return request.get<any>('/finance/doudian/commission/list', params);
}

// 获取保险详情
export function getDoudianInsurance(accessToken: string, orderId: string) {
  return request.get<any>('/finance/doudian/insurance/detail', { accessToken, orderId });
}

// 获取售后列表
export function getDoudianAfterSaleList(params: DoudianSyncParams) {
  return request.get<any>('/finance/doudian/aftersale/list', params);
}

// 获取售后详情
export function getDoudianAfterSaleDetail(accessToken: string, afterSaleId: string) {
  return request.get<any>('/finance/doudian/aftersale/detail', { accessToken, afterSaleId });
}
```

## 三、页面组件迁移示例

### 3.1 商品成本页面迁移

**迁移前（tRPC）：**

```typescript
import { trpc } from '@/lib/trpc';

const { data, isLoading } = trpc.productCost.list.useQuery({
  page: 1,
  pageSize: 20,
  search: searchTerm,
});

const createMutation = trpc.productCost.create.useMutation();
```

**迁移后（RESTful）：**

```typescript
import { useState, useEffect } from 'react';
import { getProductCostPage, createProductCost, ProductCost } from '@/api/productCost';

const [data, setData] = useState<{ list: ProductCost[]; total: number } | null>(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await getProductCostPage({
        pageNo: 1,
        pageSize: 20,
        title: searchTerm,
      });
      setData(result);
    } catch (error) {
      console.error('获取数据失败', error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, [searchTerm]);

// 创建
const handleCreate = async (values: Partial<ProductCost>) => {
  try {
    await createProductCost(values);
    // 刷新列表
  } catch (error) {
    console.error('创建失败', error);
  }
};
```

### 3.2 使用React Query（推荐）

如果希望保持类似tRPC的使用体验，可以使用React Query：

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductCostPage, createProductCost, updateProductCost, deleteProductCost } from '@/api/productCost';

// 查询Hook
export function useProductCostPage(params: ProductCostPageParams) {
  return useQuery({
    queryKey: ['productCost', 'page', params],
    queryFn: () => getProductCostPage(params),
  });
}

// 创建Hook
export function useCreateProductCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCost'] });
    },
  });
}

// 更新Hook
export function useUpdateProductCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCost'] });
    },
  });
}

// 删除Hook
export function useDeleteProductCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCost'] });
    },
  });
}
```

**页面使用：**

```typescript
import { useProductCostPage, useCreateProductCost } from '@/hooks/useProductCost';

function ProductCostPage() {
  const { data, isLoading } = useProductCostPage({ pageNo: 1, pageSize: 20 });
  const createMutation = useCreateProductCost();

  const handleCreate = (values: any) => {
    createMutation.mutate(values);
  };

  // ...
}
```

## 四、环境变量配置

在 `.env` 文件中配置API基础路径：

```env
# 开发环境
VITE_API_BASE_URL=http://localhost:48080/app-api

# 生产环境
VITE_API_BASE_URL=/app-api
```

## 五、认证流程变更

### 5.1 登录流程

```typescript
import { request } from '@/utils/request';

interface LoginParams {
  username: string;
  password: string;
  tenantName?: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresTime: number;
}

export async function login(params: LoginParams): Promise<LoginResult> {
  const result = await request.post<LoginResult>('/system/auth/login', params);
  // 保存token
  localStorage.setItem('ACCESS_TOKEN', result.accessToken);
  localStorage.setItem('REFRESH_TOKEN', result.refreshToken);
  return result;
}

export function logout() {
  localStorage.removeItem('ACCESS_TOKEN');
  localStorage.removeItem('REFRESH_TOKEN');
  window.location.href = '/login';
}
```

### 5.2 Token刷新

```typescript
// 在请求拦截器中添加token刷新逻辑
service.interceptors.response.use(
  (response) => {
    // ...
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        const result = await axios.post('/app-api/system/auth/refresh-token', {
          refreshToken,
        });
        localStorage.setItem('ACCESS_TOKEN', result.data.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${result.data.data.accessToken}`;
        return service(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

## 六、迁移检查清单

| 检查项 | 状态 |
|--------|------|
| 创建统一请求工具 request.ts | ☐ |
| 创建API模块文件 | ☐ |
| 配置环境变量 | ☐ |
| 迁移登录认证逻辑 | ☐ |
| 迁移商品成本页面 | ☐ |
| 迁移订单管理页面 | ☐ |
| 迁移抖店同步页面 | ☐ |
| 测试所有API调用 | ☐ |
| 测试认证流程 | ☐ |
| 测试错误处理 | ☐ |
