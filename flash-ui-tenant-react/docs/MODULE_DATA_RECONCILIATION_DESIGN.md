# 6个模块数据勾稽关系设计文档

**文档版本**：v1.0  
**创建日期**：2025-01-16  
**适用项目**：闪电帐PRO SAAS系统

---

## 一、概述

本文档定义了财务核算、资金管理、库存成本、经营分析、费用中心、税务管理6个模块与抖店订单API、千川推广API、聚水潭ERP API的数据勾稽关系。所有模块数据来源均通过API接口调用获取。

---

## 二、数据源定义

### 2.1 抖店订单API数据

| 数据字段 | 字段说明 | 数据类型 | 来源接口 |
|---------|---------|---------|---------|
| order_id | 订单ID | string | order.searchList |
| order_amount | 订单金额 | decimal | order.orderDetail |
| payment_amount | 实付金额 | decimal | order.orderDetail |
| refund_amount | 退款金额 | decimal | order.orderDetail |
| commission_amount | 达人佣金 | decimal | buyin.douKeSettleBillList |
| service_fee | 平台服务费 | decimal | order.getSettleBillDetailV3 |
| insurance_fee | 保险费 | decimal | order.insurance |
| shipping_fee | 快递费 | decimal | order.orderDetail |
| after_sale_amount | 售后赔付 | decimal | afterSale.List |

### 2.2 千川推广API数据

| 数据字段 | 字段说明 | 数据类型 | 来源接口 |
|---------|---------|---------|---------|
| cost | 消耗金额 | decimal | report.advertiser.get |
| show_cnt | 展示数 | integer | report.advertiser.get |
| click_cnt | 点击数 | integer | report.advertiser.get |
| convert_cnt | 转化数 | integer | report.advertiser.get |
| pay_order_count | 成交订单数 | integer | report.advertiser.get |
| pay_order_amount | 成交金额 | decimal | report.advertiser.get |

### 2.3 聚水潭ERP API数据

| 数据字段 | 字段说明 | 数据类型 | 来源接口 |
|---------|---------|---------|---------|
| po_id | 入库单号 | string | purchasein.query |
| sku_id | SKU编码 | string | purchasein.query |
| qty | 入库数量 | integer | purchasein.query |
| cost_price | 采购单价 | decimal | purchasein.query |
| total_amount | 入库总额 | decimal | purchasein.query |
| warehouse_id | 仓库ID | string | purchasein.query |
| supplier_id | 供应商ID | string | purchasein.query |

---

## 三、模块数据勾稽关系

### 3.1 财务核算模块（Accounting）

**功能定位**：收入确认、成本核算、利润分析

**数据勾稽关系**：

| 核算指标 | 计算公式 | 数据来源 |
|---------|---------|---------|
| 销售收入 | SUM(payment_amount) | 抖店订单API |
| 退款金额 | SUM(refund_amount) | 抖店订单API |
| 净销售额 | 销售收入 - 退款金额 | 计算字段 |
| 商品成本 | SUM(cost_price * qty) | 聚水潭ERP API |
| 达人佣金 | SUM(commission_amount) | 抖店订单API |
| 平台服务费 | SUM(service_fee) | 抖店订单API |
| 推广费用 | SUM(cost) | 千川推广API |
| 快递费用 | SUM(shipping_fee) | 抖店订单API |
| 保险费用 | SUM(insurance_fee) | 抖店订单API |
| 售后赔付 | SUM(after_sale_amount) | 抖店订单API |
| 毛利润 | 净销售额 - 商品成本 | 计算字段 |
| 净利润 | 毛利润 - 达人佣金 - 平台服务费 - 推广费用 - 快递费用 - 保险费用 - 售后赔付 | 计算字段 |

**API接口设计**：

```typescript
// GET /api/finance/accounting/overview
interface AccountingOverviewRequest {
  shopId: string;
  startDate: string;
  endDate: string;
}

interface AccountingOverviewResponse {
  salesRevenue: number;      // 销售收入（抖店）
  refundAmount: number;      // 退款金额（抖店）
  netSales: number;          // 净销售额
  productCost: number;       // 商品成本（聚水潭）
  commissionFee: number;     // 达人佣金（抖店）
  serviceFee: number;        // 平台服务费（抖店）
  promotionCost: number;     // 推广费用（千川）
  shippingFee: number;       // 快递费用（抖店）
  insuranceFee: number;      // 保险费用（抖店）
  afterSaleCost: number;     // 售后赔付（抖店）
  grossProfit: number;       // 毛利润
  netProfit: number;         // 净利润
  grossProfitRate: number;   // 毛利率
  netProfitRate: number;     // 净利率
  dataSource: {
    doudian: { syncTime: string; recordCount: number };
    qianchuan: { syncTime: string; recordCount: number };
    jst: { syncTime: string; recordCount: number };
  };
}
```

---

### 3.2 资金管理模块（Funds）

**功能定位**：资金流入流出、余额管理、资金调拨

**数据勾稽关系**：

| 资金指标 | 计算公式 | 数据来源 |
|---------|---------|---------|
| 订单收入 | SUM(payment_amount) | 抖店订单API |
| 退款支出 | SUM(refund_amount) | 抖店订单API |
| 推广支出 | SUM(cost) | 千川推广API |
| 采购支出 | SUM(total_amount) | 聚水潭ERP API |
| 佣金支出 | SUM(commission_amount) | 抖店订单API |
| 服务费支出 | SUM(service_fee) | 抖店订单API |
| 快递费支出 | SUM(shipping_fee) | 抖店订单API |
| 资金净流入 | 订单收入 - 退款支出 - 推广支出 - 采购支出 - 佣金支出 - 服务费支出 - 快递费支出 | 计算字段 |

**API接口设计**：

```typescript
// GET /api/finance/funds/overview
interface FundsOverviewRequest {
  shopId: string;
  startDate: string;
  endDate: string;
}

interface FundsOverviewResponse {
  inflow: {
    orderIncome: number;     // 订单收入（抖店）
    otherIncome: number;     // 其他收入
    totalInflow: number;     // 总流入
  };
  outflow: {
    refundExpense: number;   // 退款支出（抖店）
    promotionExpense: number; // 推广支出（千川）
    purchaseExpense: number; // 采购支出（聚水潭）
    commissionExpense: number; // 佣金支出（抖店）
    serviceFeeExpense: number; // 服务费支出（抖店）
    shippingExpense: number; // 快递费支出（抖店）
    totalOutflow: number;    // 总流出
  };
  netCashflow: number;       // 资金净流入
  balance: {
    doudianBalance: number;  // 抖店余额
    qianchuanBalance: number; // 千川余额
    totalBalance: number;    // 总余额
  };
  dataSource: {
    doudian: { syncTime: string; recordCount: number };
    qianchuan: { syncTime: string; recordCount: number };
    jst: { syncTime: string; recordCount: number };
  };
}
```

---

### 3.3 库存成本模块（Inventory）

**功能定位**：SKU成本追踪、成本波动预警、周转分析

**数据勾稽关系**：

| 库存指标 | 计算公式 | 数据来源 |
|---------|---------|---------|
| 入库数量 | SUM(qty) | 聚水潭ERP API |
| 入库金额 | SUM(total_amount) | 聚水潭ERP API |
| 平均成本 | 入库金额 / 入库数量 | 计算字段 |
| 销售数量 | COUNT(order_id) | 抖店订单API |
| 销售成本 | 销售数量 * 平均成本 | 计算字段 |
| 库存周转率 | 销售成本 / 平均库存 | 计算字段 |
| 库存周转天数 | 365 / 库存周转率 | 计算字段 |

**API接口设计**：

```typescript
// GET /api/finance/inventory/overview
interface InventoryOverviewRequest {
  shopId: string;
  startDate: string;
  endDate: string;
  skuId?: string;
}

interface InventoryOverviewResponse {
  summary: {
    totalSku: number;        // SKU总数
    totalInboundQty: number; // 入库总数量（聚水潭）
    totalInboundAmount: number; // 入库总金额（聚水潭）
    totalSalesQty: number;   // 销售总数量（抖店）
    totalSalesCost: number;  // 销售成本
    avgCost: number;         // 平均成本
    turnoverRate: number;    // 库存周转率
    turnoverDays: number;    // 库存周转天数
  };
  skuList: Array<{
    skuId: string;
    skuName: string;
    inboundQty: number;      // 入库数量（聚水潭）
    inboundAmount: number;   // 入库金额（聚水潭）
    salesQty: number;        // 销售数量（抖店）
    avgCost: number;         // 平均成本
    currentStock: number;    // 当前库存
    costChange: number;      // 成本变动率
  }>;
  dataSource: {
    doudian: { syncTime: string; recordCount: number };
    jst: { syncTime: string; recordCount: number };
  };
}
```

---

### 3.4 经营分析模块（Analysis）

**功能定位**：ROI分析、盈亏平衡、趋势分析

**数据勾稽关系**：

| 分析指标 | 计算公式 | 数据来源 |
|---------|---------|---------|
| 推广ROI | 成交金额 / 推广费用 | 千川推广API |
| 订单ROI | 净利润 / 总投入 | 综合计算 |
| 点击率 | 点击数 / 展示数 | 千川推广API |
| 转化率 | 转化数 / 点击数 | 千川推广API |
| 客单价 | 销售收入 / 订单数 | 抖店订单API |
| 盈亏平衡点 | 固定成本 / (1 - 变动成本率) | 综合计算 |
| 利润趋势 | 按日/周/月汇总 | 综合计算 |

**API接口设计**：

```typescript
// GET /api/finance/analysis/overview
interface AnalysisOverviewRequest {
  shopId: string;
  startDate: string;
  endDate: string;
  dimension: 'day' | 'week' | 'month';
}

interface AnalysisOverviewResponse {
  roi: {
    promotionROI: number;    // 推广ROI（千川）
    orderROI: number;        // 订单ROI
    totalInvestment: number; // 总投入
    totalReturn: number;     // 总回报
  };
  conversion: {
    showCount: number;       // 展示数（千川）
    clickCount: number;      // 点击数（千川）
    convertCount: number;    // 转化数（千川）
    clickRate: number;       // 点击率
    convertRate: number;     // 转化率
  };
  orderMetrics: {
    orderCount: number;      // 订单数（抖店）
    avgOrderValue: number;   // 客单价
    repeatRate: number;      // 复购率
  };
  breakeven: {
    fixedCost: number;       // 固定成本
    variableCostRate: number; // 变动成本率
    breakevenPoint: number;  // 盈亏平衡点
    currentStatus: 'profit' | 'loss' | 'breakeven';
  };
  trends: Array<{
    date: string;
    revenue: number;         // 收入（抖店）
    cost: number;            // 成本（聚水潭+千川）
    profit: number;          // 利润
    promotionCost: number;   // 推广费（千川）
  }>;
  dataSource: {
    doudian: { syncTime: string; recordCount: number };
    qianchuan: { syncTime: string; recordCount: number };
    jst: { syncTime: string; recordCount: number };
  };
}
```

---

### 3.5 费用中心模块（Expense）

**功能定位**：多维度费用分摊、预算预警、费用分析

**数据勾稽关系**：

| 费用类型 | 计算公式 | 数据来源 |
|---------|---------|---------|
| 推广费用 | SUM(cost) | 千川推广API |
| 达人佣金 | SUM(commission_amount) | 抖店订单API |
| 平台服务费 | SUM(service_fee) | 抖店订单API |
| 快递费用 | SUM(shipping_fee) | 抖店订单API |
| 保险费用 | SUM(insurance_fee) | 抖店订单API |
| 售后赔付 | SUM(after_sale_amount) | 抖店订单API |
| 采购费用 | SUM(total_amount) | 聚水潭ERP API |
| 仓储费用 | 按仓库计算 | 聚水潭ERP API |
| 总费用 | 各项费用之和 | 综合计算 |
| 费用率 | 总费用 / 销售收入 | 综合计算 |

**API接口设计**：

```typescript
// GET /api/finance/expense/overview
interface ExpenseOverviewRequest {
  shopId: string;
  startDate: string;
  endDate: string;
  category?: string;
}

interface ExpenseOverviewResponse {
  summary: {
    totalExpense: number;    // 总费用
    totalRevenue: number;    // 总收入（抖店）
    expenseRate: number;     // 费用率
  };
  breakdown: {
    promotionFee: number;    // 推广费用（千川）
    commissionFee: number;   // 达人佣金（抖店）
    serviceFee: number;      // 平台服务费（抖店）
    shippingFee: number;     // 快递费用（抖店）
    insuranceFee: number;    // 保险费用（抖店）
    afterSaleFee: number;    // 售后赔付（抖店）
    purchaseFee: number;     // 采购费用（聚水潭）
    storageFee: number;      // 仓储费用（聚水潭）
    otherFee: number;        // 其他费用
  };
  trends: Array<{
    date: string;
    promotionFee: number;    // 推广费用（千川）
    commissionFee: number;   // 达人佣金（抖店）
    serviceFee: number;      // 平台服务费（抖店）
    shippingFee: number;     // 快递费用（抖店）
    totalFee: number;        // 总费用
  }>;
  budget: {
    totalBudget: number;     // 总预算
    usedBudget: number;      // 已用预算
    remainingBudget: number; // 剩余预算
    usageRate: number;       // 使用率
    alertLevel: 'normal' | 'warning' | 'danger';
  };
  dataSource: {
    doudian: { syncTime: string; recordCount: number };
    qianchuan: { syncTime: string; recordCount: number };
    jst: { syncTime: string; recordCount: number };
  };
}
```

---

### 3.6 税务管理模块（Tax）

**功能定位**：税负率分析、风险预警、税务报表

**数据勾稽关系**：

| 税务指标 | 计算公式 | 数据来源 |
|---------|---------|---------|
| 销售收入 | SUM(payment_amount) | 抖店订单API |
| 销项税额 | 销售收入 * 税率 / (1 + 税率) | 计算字段 |
| 采购金额 | SUM(total_amount) | 聚水潭ERP API |
| 进项税额 | 采购金额 * 税率 / (1 + 税率) | 计算字段 |
| 应纳税额 | 销项税额 - 进项税额 | 计算字段 |
| 税负率 | 应纳税额 / 销售收入 | 计算字段 |

**API接口设计**：

```typescript
// GET /api/finance/tax/overview
interface TaxOverviewRequest {
  shopId: string;
  startDate: string;
  endDate: string;
  taxRate?: number;
}

interface TaxOverviewResponse {
  summary: {
    salesRevenue: number;    // 销售收入（抖店）
    outputTax: number;       // 销项税额
    purchaseAmount: number;  // 采购金额（聚水潭）
    inputTax: number;        // 进项税额
    taxPayable: number;      // 应纳税额
    taxBurdenRate: number;   // 税负率
  };
  breakdown: {
    vatOutput: number;       // 增值税销项
    vatInput: number;        // 增值税进项
    vatPayable: number;      // 增值税应纳
    additionalTax: number;   // 附加税
    incomeTax: number;       // 所得税
    totalTax: number;        // 税费合计
  };
  trends: Array<{
    month: string;
    salesRevenue: number;    // 销售收入（抖店）
    purchaseAmount: number;  // 采购金额（聚水潭）
    taxPayable: number;      // 应纳税额
    taxBurdenRate: number;   // 税负率
  }>;
  alert: {
    taxBurdenAlert: boolean; // 税负率预警
    invoiceAlert: boolean;   // 发票预警
    alertLevel: 'normal' | 'warning' | 'danger';
    alertMessage: string;
  };
  dataSource: {
    doudian: { syncTime: string; recordCount: number };
    jst: { syncTime: string; recordCount: number };
  };
}
```

---

## 四、数据勾稽验证规则

### 4.1 跨模块数据一致性验证

| 验证规则 | 验证内容 | 容差范围 |
|---------|---------|---------|
| 收入一致性 | 财务核算.销售收入 = 资金管理.订单收入 = 经营分析.总收入 | 0.01元 |
| 成本一致性 | 财务核算.商品成本 = 库存成本.销售成本 | 0.01元 |
| 费用一致性 | 财务核算.推广费用 = 费用中心.推广费用 = 经营分析.推广费用 | 0.01元 |
| 利润一致性 | 财务核算.净利润 = 经营分析.利润 | 0.01元 |

### 4.2 数据源同步验证

| 验证规则 | 验证内容 | 处理方式 |
|---------|---------|---------|
| 抖店数据完整性 | 订单数据是否完整同步 | 缺失则重新同步 |
| 千川数据完整性 | 推广数据是否完整同步 | 缺失则重新同步 |
| 聚水潭数据完整性 | 入库数据是否完整同步 | 缺失则重新同步 |
| 数据时效性 | 数据同步时间是否在24小时内 | 超时则触发同步 |

---

## 五、API调用流程

### 5.1 数据获取流程

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端页面请求                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Node.js中间层路由                           │
│  (accountingRouter / fundsRouter / inventoryRouter / ...)       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据勾稽服务层                              │
│                  (dataReconciliationService)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   抖店API客户端   │  │  千川API客户端   │  │ 聚水潭API客户端  │
│  (doudianApi)   │  │ (qianchuanApi)  │  │    (jstApi)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
            │                   │                   │
            ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   抖店开放平台    │  │   巨量千川API    │  │   聚水潭ERP     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 5.2 数据缓存策略

| 数据类型 | 缓存时间 | 刷新策略 |
|---------|---------|---------|
| 订单数据 | 5分钟 | 定时刷新 + 手动刷新 |
| 推广数据 | 15分钟 | 定时刷新 |
| 入库数据 | 30分钟 | 定时刷新 |
| 汇总数据 | 1小时 | 定时刷新 |

---

## 六、错误处理

### 6.1 API调用失败处理

| 错误类型 | 处理方式 |
|---------|---------|
| 网络超时 | 重试3次，间隔5秒 |
| 认证失败 | 刷新Token后重试 |
| 数据为空 | 返回默认值，标记数据状态 |
| 服务不可用 | 使用缓存数据，标记数据时效 |

### 6.2 数据异常处理

| 异常类型 | 处理方式 |
|---------|---------|
| 数据不一致 | 记录差异日志，触发告警 |
| 数据缺失 | 标记缺失字段，显示提示 |
| 计算异常 | 返回null，显示"数据异常" |

---

**文档结束**
