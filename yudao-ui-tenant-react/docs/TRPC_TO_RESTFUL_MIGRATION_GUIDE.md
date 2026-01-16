# tRPC 到 RESTful API 迁移完整指南

## 📋 目录

1. [迁移概述](#迁移概述)
2. [架构对比](#架构对比)
3. [环境配置](#环境配置)
4. [API调用层迁移](#api调用层迁移)
5. [页面组件迁移](#页面组件迁移)
6. [错误处理](#错误处理)
7. [常见问题](#常见问题)
8. [迁移检查清单](#迁移检查清单)

---

## 迁移概述

### 迁移目标

将闪电帐PRO租户端从基于tRPC的中间层架构迁移到直接调用RuoYi-Vue-Pro Java后端的RESTful API架构。

### 迁移范围

- ✅ 订单管理模块
- ✅ 资金流水模块
- ✅ 商品成本模块
- ✅ 抖店配置模块
- ✅ 数据同步模块

### 迁移周期

建议分阶段迁移，每个模块独立测试后再进行下一个模块的迁移。

---

## 架构对比

### 旧架构（tRPC）

```
React租户端
    ↓ tRPC调用
Node.js中间层
    ↓ 调用Java API
Java后端(RuoYi)
    ↓ 调用第三方API
抖店/千川/聚水潭
```

**特点：**
- 中间层提供额外的处理逻辑
- 类型安全的RPC调用
- 需要维护两个后端

### 新架构（RESTful）

```
React租户端
    ↓ Axios调用RESTful API
Java后端(RuoYi)
    ↓ 调用第三方API
抖店/千川/聚水潭
```

**特点：**
- 直接调用Java后端
- 标准的HTTP RESTful API
- 单一后端维护
- 更简洁的架构

---

## 环境配置

### 1. 配置API基础URL

编辑 `.env` 文件：

```env
# Java后端API地址
VITE_API_URL=http://localhost:8080/api
# 或者生产环境
VITE_API_URL=https://api.yourdomain.com/api
```

### 2. 配置Axios实例

文件：`client/src/utils/request.ts`

```typescript
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 30000,
    withCredentials: true, // 发送Cookie用于认证
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器 - 添加认证信息
  instance.interceptors.request.use((config) => {
    // 可以在这里添加token或其他认证信息
    return config;
  });

  // 响应拦截器 - 处理统一响应格式
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { code, msg, data } = response.data;
      if (code === 0) return data;
      if (code === 10001) window.location.href = getLoginUrl();
      return Promise.reject(new Error(msg));
    }
  );

  return instance;
};
```

---

## API调用层迁移

### 1. 创建API模块

每个业务模块创建对应的API文件：

```
client/src/api/
├── order.ts          # 订单API
├── cashflow.ts       # 资金流水API
├── productcost.ts    # 商品成本API
├── doudian.ts        # 抖店配置API
└── sync.ts           # 数据同步API
```

### 2. API模块结构示例

**订单API模块** (`client/src/api/order.ts`)：

```typescript
import { get, post, put, del, getPage } from '@/utils/request';

// 定义数据结构
export interface Order {
  id: number;
  orderNo: string;
  payAmount: number;
  status: string;
  // ... 其他字段
}

// 定义请求结构
export interface CreateOrderRequest {
  shopId: number;
  orderNo: string;
  // ... 其他字段
}

// 定义API接口
export const getOrderPage = (params: OrderPageRequest) => {
  return getPage<Order>('/finance/order/page', params.pageNo, params.pageSize, {
    params: {
      shopId: params.shopId,
      status: params.status,
    },
  });
};

export const getOrder = (id: number) => {
  return get<Order>(`/finance/order/${id}`);
};

export const createOrder = (data: CreateOrderRequest) => {
  return post<number>('/finance/order', data);
};

export const updateOrder = (data: UpdateOrderRequest) => {
  return put<boolean>('/finance/order', data);
};

export const deleteOrder = (id: number) => {
  return del<boolean>('/finance/order', { params: { id } });
};
```

### 3. 创建React Query Hooks

**订单Hooks** (`client/src/hooks/useOrder.ts`)：

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as orderApi from '@/api/order';

// 查询Hook
export const useOrderPage = (params: orderApi.OrderPageRequest) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrderPage(params),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
};

// 变更Hook
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

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: orderApi.UpdateOrderRequest) => orderApi.updateOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

---

## 页面组件迁移

### 迁移步骤

#### 第1步：替换数据获取逻辑

**旧代码（tRPC）：**

```typescript
import { trpc } from '@/lib/trpc';

export function OrderList() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = trpc.order.list.useQuery({
    page,
    pageSize: 10,
  });

  return (
    <div>
      {/* 渲染列表 */}
    </div>
  );
}
```

**新代码（RESTful）：**

```typescript
import { useOrderPage } from '@/hooks/useOrder';
import { useState } from 'react';

export function OrderList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  const { data, isLoading } = useOrderPage({
    pageNo: page,
    pageSize,
    shopId: currentShopId,
  });

  return (
    <div>
      {/* 渲染列表 */}
    </div>
  );
}
```

#### 第2步：替换数据变更逻辑

**旧代码（tRPC）：**

```typescript
const createMutation = trpc.order.create.useMutation({
  onSuccess: () => {
    toast.success('创建成功');
    utils.order.list.invalidate();
  },
});

const handleCreate = async (data) => {
  await createMutation.mutateAsync(data);
};
```

**新代码（RESTful）：**

```typescript
import { useCreateOrder } from '@/hooks/useOrder';
import { toast } from 'sonner';

const { mutateAsync, isPending } = useCreateOrder();

const handleCreate = async (data) => {
  try {
    await mutateAsync(data);
    toast.success('创建成功');
  } catch (error) {
    toast.error(`创建失败: ${error.message}`);
  }
};
```

### 完整页面迁移示例

**订单管理页面迁移** (`client/src/pages/order/OrderList.tsx`)：

```typescript
import { useState } from 'react';
import { useOrderPage, useCreateOrder, useUpdateOrder, useDeleteOrder } from '@/hooks/useOrder';
import { Button, Table, Form, Input, Select, Modal, message } from 'antd';
import { toast } from 'sonner';

export function OrderList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // 查询数据
  const { data: orderData, isLoading } = useOrderPage({
    pageNo: page,
    pageSize,
    shopId: currentShopId,
    ...filters,
  });

  // 变更操作
  const { mutateAsync: create, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateOrder();
  const { mutateAsync: remove, isPending: isDeleting } = useDeleteOrder();

  // 处理创建/更新
  const handleSave = async (values) => {
    try {
      if (editingOrder) {
        await update({ id: editingOrder.id, ...values });
        toast.success('更新成功');
      } else {
        await create({ shopId: currentShopId, ...values });
        toast.success('创建成功');
      }
      setIsModalVisible(false);
      setEditingOrder(null);
    } catch (error) {
      toast.error(`操作失败: ${error.message}`);
    }
  };

  // 处理删除
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条订单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await remove(id);
          toast.success('删除成功');
        } catch (error) {
          toast.error(`删除失败: ${error.message}`);
        }
      },
    });
  };

  // 表格列配置
  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '商品', dataIndex: 'productTitle', key: 'productTitle' },
    { title: '金额', dataIndex: 'payAmount', key: 'payAmount' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => setEditingOrder(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          新建订单
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orderData?.list || []}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: orderData?.total || 0,
          onChange: setPage,
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />

      <Modal
        title={editingOrder ? '编辑订单' : '新建订单'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
        }}
        onOk={handleSave}
        confirmLoading={isCreating || isUpdating}
      >
        <Form
          initialValues={editingOrder || {}}
          onFinish={handleSave}
        >
          {/* 表单字段 */}
        </Form>
      </Modal>
    </div>
  );
}
```

---

## 错误处理

### 统一错误处理

在 `client/src/utils/request.ts` 中配置：

```typescript
instance.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;

    // 成功响应
    if (code === 0) return data;

    // 未授权 - 重定向登录
    if (code === 10001) {
      window.location.href = getLoginUrl();
      return Promise.reject(new Error('Please login'));
    }

    // 无权限
    if (code === 10002) {
      return Promise.reject(new Error('You do not have permission'));
    }

    // 其他错误
    return Promise.reject(new Error(msg || 'Unknown error'));
  },
  (error) => {
    // 网络错误
    if (error.response?.status === 401) {
      window.location.href = getLoginUrl();
    }
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access forbidden'));
    }
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }
    if (error.response?.status === 500) {
      return Promise.reject(new Error('Server error'));
    }
    return Promise.reject(error);
  }
);
```

### 页面级错误处理

```typescript
import { useOrderPage } from '@/hooks/useOrder';
import { Alert } from 'antd';

export function OrderList() {
  const { data, isLoading, error } = useOrderPage({...});

  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  return (
    // 页面内容
  );
}
```

---

## 常见问题

### Q1: 如何处理认证？

**A:** RESTful API使用Cookie进行认证，Axios已配置 `withCredentials: true`，会自动发送Cookie。

```typescript
// Axios会自动发送Cookie
const instance = axios.create({
  withCredentials: true,
});
```

### Q2: 如何处理分页？

**A:** 使用 `getPage` 辅助函数简化分页调用：

```typescript
// 自动处理pageNo和pageSize
const { data } = await getPage<Order>('/finance/order/page', 1, 10, {
  params: { shopId: 1 },
});
```

### Q3: 如何处理文件上传？

**A:** 使用FormData发送文件：

```typescript
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return post<string>('/finance/order/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
```

### Q4: 如何处理大量数据导出？

**A:** 使用Blob处理二进制数据：

```typescript
export const exportOrders = (shopId: number) => {
  return get<Blob>('/finance/order/export', {
    params: { shopId },
    responseType: 'blob',
  });
};

// 使用
const { mutateAsync } = useMutation({
  mutationFn: (shopId) => exportOrders(shopId),
  onSuccess: (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.xlsx';
    a.click();
  },
});
```

### Q5: 如何处理并发请求？

**A:** 使用 `Promise.all` 或 `Promise.allSettled`：

```typescript
import axios from 'axios';

// 并发请求
const [orders, cashflows, costs] = await Promise.all([
  getOrderPage({ pageNo: 1, pageSize: 10 }),
  getCashflowPage({ pageNo: 1, pageSize: 10 }),
  getProductCostPage({ pageNo: 1, pageSize: 10 }),
]);
```

---

## 迁移检查清单

### 前期准备

- [ ] 备份现有代码
- [ ] 创建新分支 `feature/restful-api-migration`
- [ ] 配置Java后端API地址
- [ ] 配置Axios请求工具

### 开发阶段

- [ ] 创建API模块（order.ts, cashflow.ts等）
- [ ] 创建React Query Hooks
- [ ] 迁移订单管理页面
- [ ] 迁移资金流水页面
- [ ] 迁移商品成本页面
- [ ] 迁移其他页面

### 测试阶段

- [ ] 单元测试 - API模块
- [ ] 单元测试 - Hooks
- [ ] 集成测试 - 页面功能
- [ ] 端到端测试 - 完整流程
- [ ] 性能测试 - 响应时间
- [ ] 兼容性测试 - 浏览器兼容性

### 部署阶段

- [ ] 代码审查
- [ ] 合并到主分支
- [ ] 更新文档
- [ ] 发布新版本
- [ ] 监控线上问题

---

## 总结

通过本指南，你可以完整地将闪电帐PRO租户端从tRPC迁移到RESTful API。迁移过程中要注意：

1. **逐步迁移** - 不要一次性迁移所有模块
2. **充分测试** - 每个模块迁移后都要进行测试
3. **保持兼容** - 迁移期间可以同时支持两种方式
4. **更新文档** - 及时更新相关文档

祝迁移顺利！
