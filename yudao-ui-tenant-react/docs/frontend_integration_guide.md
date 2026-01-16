# 前端勾稽仪表板集成指南

## 概述

本指南说明如何将勾稽仪表板和差异详情页集成到现有的React前端应用中。

## 集成步骤

### 1. 复制前端组件文件

#### 勾稽仪表板组件
```bash
cp client/src/pages/ReconciliationDashboard.tsx client/src/pages/
```

#### 差异详情页组件
```bash
cp client/src/pages/ReconciliationDifferences.tsx client/src/pages/
```

#### 数据验证工具库
```bash
cp client/src/lib/reconciliation-validator.ts client/src/lib/
```

### 2. 更新路由配置

在 `client/src/routes.tsx` 中添加路由配置：

```typescript
import ReconciliationDashboard from '@/pages/ReconciliationDashboard';
import ReconciliationDifferences from '@/pages/ReconciliationDifferences';

export const routes = [
  // ... 其他路由
  {
    path: '/reconciliation',
    element: <ReconciliationDashboard />,
    label: '勾稽仪表板'
  },
  {
    path: '/reconciliation/differences',
    element: <ReconciliationDifferences />,
    label: '差异详情'
  }
];
```

### 3. 更新导航菜单

在 `client/src/components/AppLayout.tsx` 中添加菜单项：

```typescript
const menuItems = [
  // ... 其他菜单项
  {
    label: '数据勾稽',
    icon: <CheckCircleIcon />,
    submenu: [
      {
        label: '勾稽仪表板',
        href: '/reconciliation'
      },
      {
        label: '差异详情',
        href: '/reconciliation/differences'
      }
    ]
  }
];
```

### 4. 配置API接口

在 `client/src/api/reconciliation.ts` 中创建API调用函数：

```typescript
import { trpc } from '@/utils/trpc';

export const reconciliationApi = {
  // 获取勾稽汇总
  getSummary: async (tenantId: string, startDate: string, endDate: string) => {
    return trpc.finance.reconciliation.getSummary.query({
      tenantId,
      startDate,
      endDate
    });
  },

  // 获取勾稽差异列表
  getDifferences: async (tenantId: string, params: any) => {
    return trpc.finance.reconciliation.getDifferences.query({
      tenantId,
      ...params
    });
  },

  // 获取勾稽报告
  getReport: async (tenantId: string, reportType: string) => {
    return trpc.finance.reconciliation.getReport.query({
      tenantId,
      reportType
    });
  },

  // 执行勾稽验证
  executeReconciliation: async (tenantId: string, reconciliationType: string) => {
    return trpc.finance.reconciliation.executeReconciliation.mutate({
      tenantId,
      reconciliationType
    });
  }
};
```

### 5. 集成到现有页面

#### 在财务核算页面中添加勾稽链接

```typescript
// client/src/pages/FinancialAccounting.tsx
import { Link } from 'react-router-dom';

export default function FinancialAccounting() {
  return (
    <div>
      {/* ... 现有内容 */}
      <Link to="/reconciliation" className="btn btn-primary">
        查看数据勾稽
      </Link>
    </div>
  );
}
```

#### 在订单管理页面中添加勾稽链接

```typescript
// client/src/pages/OrderManagement.tsx
import { Link } from 'react-router-dom';

export default function OrderManagement() {
  return (
    <div>
      {/* ... 现有内容 */}
      <Link to="/reconciliation/differences" className="btn btn-secondary">
        查看订单勾稽差异
      </Link>
    </div>
  );
}
```

### 6. 配置样式

确保Tailwind CSS已配置，勾稽组件使用以下样式类：

```css
/* 勾稽仪表板样式 */
.reconciliation-dashboard {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

.reconciliation-card {
  @apply bg-white rounded-lg shadow-md p-4;
}

.reconciliation-chart {
  @apply bg-white rounded-lg shadow-md p-4 mt-4;
}

/* 差异详情页样式 */
.differences-table {
  @apply w-full border-collapse;
}

.differences-row {
  @apply border-b hover:bg-gray-50;
}

.differences-cell {
  @apply px-4 py-2;
}
```

## 功能说明

### 勾稽仪表板 (ReconciliationDashboard)

**主要功能：**
- 显示4个KPI卡片（总勾稽率、成本勾稽率、库存勾稽率、推广费勾稽率）
- 显示3个差异统计卡片（严重差异、警告差异、提示差异）
- 显示差异详情表格（支持筛选、排序、分页）
- 显示各维度勾稽率趋势图表

**KPI指标说明：**
- **总勾稽率** - 所有维度勾稽成功的比例，目标 >= 99.5%
- **成本勾稽率** - 订单成本与配置成本匹配的比例，目标 >= 99%
- **库存勾稽率** - 订单库存充足的比例，目标 >= 100%
- **推广费勾稽率** - 推广费与平台数据匹配的比例，目标 >= 98%

**差异等级说明：**
- **严重** - 差异超过容差上限的10%，需立即处理
- **警告** - 差异在容差范围内但接近上限，需关注
- **提示** - 差异轻微，可不处理

### 差异详情页 (ReconciliationDifferences)

**主要功能：**
- 显示所有勾稽差异的详细信息
- 支持按维度、等级、状态筛选
- 支持批量处理差异
- 支持导出差异报告

**表格字段说明：**
- **差异ID** - 差异的唯一标识
- **差异类型** - 订单-成本、订单-库存、订单-推广费、订单-入库单
- **差异金额** - 差异的金额或数量
- **差异率** - 差异占比
- **差异等级** - 严重、警告、提示
- **状态** - 未处理、已处理、已忽略
- **处理人** - 处理此差异的用户
- **处理时间** - 处理的时间
- **备注** - 处理备注

## 数据流程

```
┌─────────────────────────────────────────────────────────┐
│                  前端勾稽仪表板                          │
│  (ReconciliationDashboard.tsx)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  tRPC API调用                           │
│  (reconciliation.getSummary, getDifferences等)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              后端ReconciliationService                  │
│  (ReconciliationServiceImpl.java)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              数据库查询 (SQL)                           │
│  (OrderMapper, DailyStatsMapper)                        │
└─────────────────────────────────────────────────────────┘
```

## 常见问题

### Q1: 如何自定义勾稽容差值？

在后端配置文件中修改：

```yaml
finance:
  reconciliation:
    tolerance:
      cost: 5.0           # 成本容差 5%
      promotion: 2.0      # 推广费容差 2%
      inventory: 0.0      # 库存容差 0%
```

### Q2: 如何导出勾稽报告？

在差异详情页中点击"导出报告"按钮，选择导出格式（Excel/PDF）。

### Q3: 如何处理勾稽差异？

1. 在差异详情页中选择需要处理的差异
2. 点击"处理"按钮
3. 选择处理方式（解决/忽略）
4. 填写处理备注
5. 提交处理

### Q4: 如何查看勾稽历史记录？

在勾稽仪表板中点击"查看历史"按钮，可以查看过去的勾稽报告。

## 性能优化建议

1. **使用缓存** - 缓存勾稽结果，避免频繁计算
2. **分页加载** - 差异详情表格使用分页，避免一次加载过多数据
3. **异步加载** - 使用异步加载图表数据，提高页面加载速度
4. **索引优化** - 在数据库中添加索引，加快查询速度

## 监控告警

配置告警规则，当勾稽率低于目标值时发送通知：

```yaml
finance:
  reconciliation:
    alert:
      enabled: true
      critical-threshold: 10.0    # 严重告警阈值 10%
      warning-threshold: 5.0      # 警告告警阈值 5%
      notification-channels:
        - EMAIL
        - SMS
        - DINGTALK
```

## 支持

如有问题或建议，请联系系统管理员。
