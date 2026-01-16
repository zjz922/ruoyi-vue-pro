# 总账管理模块 Java API 接口规范

> 本文档定义了总账管理分组下所有模块的按钮功能对应的Java后端API接口规范
> 遵循阿里编码规范，按照RuoYi框架结构设计

---

## 目录

1. [经营概览模块](#1-经营概览模块)
2. [财务核算模块](#2-财务核算模块)
3. [资金管理模块](#3-资金管理模块)
4. [库存成本模块](#4-库存成本模块)
5. [经营分析模块](#5-经营分析模块)
6. [费用中心模块](#6-费用中心模块)
7. [税务管理模块](#7-税务管理模块)

---

## 1. 经营概览模块

### 1.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 刷新 | 刷新经营数据 | GET /api/ledger/dashboard/refresh |
| 日期选择 | 切换统计日期范围 | GET /api/ledger/dashboard/overview |
| 筛选 | 按条件筛选数据 | GET /api/ledger/dashboard/overview |
| 导出日报 | 导出经营日报Excel | GET /api/ledger/dashboard/export |
| 店铺切换 | 切换当前店铺 | POST /api/ledger/dashboard/switch-shop |

### 1.2 API接口定义

#### 1.2.1 获取经营概览数据

```
GET /api/ledger/dashboard/overview
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| dateRange | String | 否 | 日期范围：today/week/month/custom |
| startDate | String | 否 | 开始日期 yyyy-MM-dd |
| endDate | String | 否 | 结束日期 yyyy-MM-dd |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "kpi": {
      "totalRevenue": 285642.00,
      "revenueChange": 12.5,
      "totalOrders": 1256,
      "ordersChange": 8.3,
      "grossProfit": 87654.00,
      "profitChange": 15.2,
      "grossMargin": 30.7,
      "marginChange": 2.1
    },
    "trends": [
      { "date": "2026-01-05", "revenue": 42500, "orders": 185, "profit": 12800 }
    ],
    "expenseBreakdown": [
      { "category": "推广费用", "amount": 45800, "percent": 35.2 }
    ],
    "alerts": [
      { "type": "warning", "title": "库存预警", "desc": "SKU-2851库存不足", "time": "10分钟前" }
    ],
    "recentTransactions": [
      { "type": "income", "desc": "订单结算", "amount": 12500, "time": "10:23" }
    ]
  }
}
```

#### 1.2.2 导出经营日报

```
GET /api/ledger/dashboard/export
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| date | String | 是 | 日期 yyyy-MM-dd |
| format | String | 否 | 导出格式：excel/pdf，默认excel |

**响应**：文件流

---

## 2. 财务核算模块

### 2.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 月报/日报切换 | 切换报表类型 | GET /api/ledger/accounting/report |
| 日期选择 | 选择报表日期 | GET /api/ledger/accounting/report |
| 筛选 | 按条件筛选 | GET /api/ledger/accounting/report |
| 导出报表 | 导出财务报表 | GET /api/ledger/accounting/export |
| 自定义指标 | 配置显示指标 | POST /api/ledger/accounting/config |
| 刷新 | 刷新报表数据 | GET /api/ledger/accounting/refresh |
| 明细下钻 | 查看科目明细 | GET /api/ledger/accounting/drill-down |

### 2.2 API接口定义

#### 2.2.1 获取财务报表数据

```
GET /api/ledger/accounting/report
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| reportType | String | 是 | 报表类型：day/month |
| date | String | 是 | 日期 yyyy-MM-dd 或 yyyy-MM |
| accountingMethod | String | 否 | 核算方式：accrual/cash |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "dualTrack": {
      "accrual": {
        "revenue": 2856420,
        "cost": 1985680,
        "grossProfit": 870740,
        "operatingExpense": 442090,
        "netProfit": 428650
      },
      "cash": {
        "revenue": 2654800,
        "cost": 1856420,
        "grossProfit": 798380,
        "operatingExpense": 398500,
        "netProfit": 399880
      }
    },
    "incomeStatement": [
      { "item": "营业收入", "current": 2856420, "previous": 2654800, "change": 7.6 }
    ],
    "balanceSheet": {
      "assets": [],
      "liabilities": [],
      "equity": []
    },
    "cashFlowStatement": []
  }
}
```

#### 2.2.2 科目明细下钻

```
GET /api/ledger/accounting/drill-down
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| accountCode | String | 是 | 科目代码 |
| date | String | 是 | 日期 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "accountName": "营业收入",
    "total": 2856420,
    "details": [
      { "date": "2026-01-11", "desc": "订单收入", "debit": 0, "credit": 12500, "balance": 2856420 }
    ],
    "pagination": { "total": 100, "pageNum": 1, "pageSize": 20 }
  }
}
```

#### 2.2.3 导出财务报表

```
GET /api/ledger/accounting/export
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| reportType | String | 是 | 报表类型 |
| date | String | 是 | 日期 |
| format | String | 否 | 导出格式 |

---

## 3. 资金管理模块

### 3.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 同步全部账户 | 同步所有账户余额 | POST /api/ledger/funds/sync-all |
| 资金调拨 | 账户间资金调拨 | POST /api/ledger/funds/transfer |
| 发起提现 | 发起提现申请 | POST /api/ledger/funds/withdraw |
| 查看全部流水 | 查看资金流水列表 | GET /api/ledger/funds/transactions |
| 账户详情 | 查看账户详情 | GET /api/ledger/funds/account/{id} |

### 3.2 API接口定义

#### 3.2.1 获取资金总览

```
GET /api/ledger/funds/overview
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "totalBalance": 542000.00,
    "totalAvailable": 522000.00,
    "totalFrozen": 20000.00,
    "todayIn": 100800.00,
    "todayOut": 26000.00,
    "accounts": [
      {
        "id": 1,
        "name": "抖音店铺主账户",
        "type": "platform",
        "balance": 285000.00,
        "available": 265000.00,
        "frozen": 20000.00,
        "status": "normal"
      }
    ]
  }
}
```

#### 3.2.2 同步账户余额

```
POST /api/ledger/funds/sync-all
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "syncTime": "2026-01-11 12:30:00",
    "syncedAccounts": 4,
    "failedAccounts": 0
  }
}
```

#### 3.2.3 资金调拨

```
POST /api/ledger/funds/transfer
```

**请求体**：

```json
{
  "shopId": 1,
  "fromAccountId": 1,
  "toAccountId": 3,
  "amount": 50000.00,
  "remark": "日常资金调拨"
}
```

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "transferId": "TRF-20260111-001",
    "status": "processing",
    "estimatedTime": "2026-01-11 14:00:00"
  }
}
```

#### 3.2.4 发起提现

```
POST /api/ledger/funds/withdraw
```

**请求体**：

```json
{
  "shopId": 1,
  "fromAccountId": 1,
  "toAccountId": 3,
  "amount": 50000.00,
  "remark": "提现至对公账户"
}
```

#### 3.2.5 获取资金流水

```
GET /api/ledger/funds/transactions
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| accountId | Long | 否 | 账户ID |
| type | String | 否 | 类型：income/expense/transfer |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

---

## 4. 库存成本模块

### 4.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 计价设置 | 设置成本计价方式 | POST /api/ledger/inventory/costing-config |
| 同步库存 | 同步库存数据 | POST /api/ledger/inventory/sync |
| 导出报表 | 导出库存成本报表 | GET /api/ledger/inventory/export |
| 查看方案 | 查看优化建议详情 | GET /api/ledger/inventory/optimization/{id} |

### 4.2 API接口定义

#### 4.2.1 获取库存总览

```
GET /api/ledger/inventory/overview
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "totalValue": 892350,
    "totalSKU": 1256,
    "healthySKU": 985,
    "warningSKU": 186,
    "dangerSKU": 85,
    "turnoverDays": 28.5,
    "avgCost": 45.8,
    "costComposition": {
      "purchase": { "value": 756000, "percent": 84.7 },
      "freight": { "value": 68500, "percent": 7.7 },
      "storage": { "value": 42850, "percent": 4.8 },
      "other": { "value": 25000, "percent": 2.8 }
    },
    "ageDistribution": [
      { "range": "0-30天", "count": 658, "value": 425600, "percent": 47.7 }
    ]
  }
}
```

#### 4.2.2 获取SKU成本追踪

```
GET /api/ledger/inventory/sku-cost
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| keyword | String | 否 | 搜索关键词 |
| costTrend | String | 否 | 成本趋势：up/down/stable |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [
      {
        "sku": "SKU-2851",
        "name": "夏季连衣裙-蓝色M",
        "purchaseCost": 35.00,
        "freightCost": 2.50,
        "storageCost": 1.20,
        "totalCost": 38.70,
        "sellingPrice": 89.00,
        "grossMargin": 56.5,
        "stock": 256,
        "costTrend": "up",
        "costChange": 3.2
      }
    ],
    "pagination": { "total": 100, "pageNum": 1, "pageSize": 20 }
  }
}
```

#### 4.2.3 设置成本计价方式

```
POST /api/ledger/inventory/costing-config
```

**请求体**：

```json
{
  "shopId": 1,
  "costingMethod": "weighted_average",
  "effectiveDate": "2026-02-01"
}
```

#### 4.2.4 同步库存数据

```
POST /api/ledger/inventory/sync
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| source | String | 否 | 数据源：doudian/jushuitan |

#### 4.2.5 获取周转优化建议

```
GET /api/ledger/inventory/optimization
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "suggestions": [
      {
        "id": 1,
        "type": "滞销清理",
        "title": "85个SKU库龄超90天",
        "desc": "建议进行促销清理，释放资金约¥6.7万",
        "impact": "high",
        "expectedSaving": 67450,
        "action": "查看方案"
      }
    ]
  }
}
```

---

## 5. 经营分析模块

### 5.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 日期选择 | 选择分析日期范围 | GET /api/ledger/analysis/roi |
| 筛选 | 按条件筛选 | GET /api/ledger/analysis/roi |
| 导出分析 | 导出分析报告 | GET /api/ledger/analysis/export |

### 5.2 API接口定义

#### 5.2.1 获取ROI分析数据

```
GET /api/ledger/analysis/roi
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| dateRange | String | 否 | 日期范围 |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "overview": {
      "overallROI": 285.6,
      "adROI": 3.2,
      "productROI": 4.8,
      "channelROI": 2.9,
      "targetROI": 3.0
    },
    "channelROI": [
      { "channel": "抖音直播", "investment": 125000, "revenue": 456000, "roi": 3.65, "trend": "up" }
    ],
    "roiTrend": [
      { "date": "01-05", "roi": 2.85, "target": 3.0 }
    ]
  }
}
```

#### 5.2.2 获取盈亏平衡分析

```
GET /api/ledger/analysis/break-even
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 否 | 月份 yyyy-MM |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "fixedCost": 125000,
    "variableCostRate": 0.65,
    "sellingPrice": 100,
    "breakEvenPoint": 357143,
    "currentSales": 485620,
    "safetyMargin": 26.5,
    "cvpChartData": [
      { "sales": 0, "totalCost": 125000, "revenue": 0 }
    ]
  }
}
```

#### 5.2.3 获取利润贡献分析

```
GET /api/ledger/analysis/profit-contribution
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| dimension | String | 否 | 维度：product/channel/category |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "productContribution": [
      { "product": "连衣裙系列", "revenue": 185600, "cost": 112500, "profit": 73100, "margin": 39.4 }
    ],
    "profitStructure": [
      { "name": "毛利润", "value": 285640, "percent": 100 }
    ]
  }
}
```

---

## 6. 费用中心模块

### 6.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 日期选择 | 选择费用统计日期 | GET /api/ledger/expense/overview |
| 预算设置 | 设置费用预算 | POST /api/ledger/expense/budget |
| 导出报表 | 导出费用报表 | GET /api/ledger/expense/export |
| 录入费用 | 手动录入费用 | POST /api/ledger/expense/create |
| 确认异常 | 确认异常费用 | POST /api/ledger/expense/confirm-anomaly |
| 审批费用 | 审批待审批费用 | POST /api/ledger/expense/approve |

### 6.2 API接口定义

#### 6.2.1 获取费用总览

```
GET /api/ledger/expense/overview
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 否 | 月份 yyyy-MM |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "totalExpense": 285640,
    "budgetTotal": 320000,
    "budgetUsed": 89.3,
    "monthOverMonth": -5.2,
    "abnormalCount": 3,
    "pendingApproval": 8,
    "categories": [
      { "category": "推广费用", "amount": 156800, "budget": 200000, "percent": 54.9 }
    ]
  }
}
```

#### 6.2.2 获取多维度费用分摊

```
GET /api/ledger/expense/allocation
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| dimension | String | 是 | 维度：shop/category/channel |
| month | String | 否 | 月份 |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "dimension": "shop",
    "allocations": [
      { "name": "旗舰店", "allocated": 125800, "percent": 44.0, "orders": 3256, "perOrder": 38.6 }
    ]
  }
}
```

#### 6.2.3 设置费用预算

```
POST /api/ledger/expense/budget
```

**请求体**：

```json
{
  "shopId": 1,
  "month": "2026-02",
  "budgets": [
    { "category": "推广费用", "amount": 200000 },
    { "category": "物流费用", "amount": 50000 }
  ]
}
```

#### 6.2.4 录入费用

```
POST /api/ledger/expense/create
```

**请求体**：

```json
{
  "shopId": 1,
  "category": "推广费用",
  "amount": 15800,
  "desc": "巨量千川投放-女装",
  "date": "2026-01-11",
  "channel": "抖音直播",
  "attachments": []
}
```

#### 6.2.5 获取异常费用列表

```
GET /api/ledger/expense/anomalies
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| status | String | 否 | 状态：pending/confirmed/ignored |

#### 6.2.6 确认异常费用

```
POST /api/ledger/expense/confirm-anomaly
```

**请求体**：

```json
{
  "anomalyId": 1,
  "action": "confirm",
  "reason": "双十二大促期间加大投放"
}
```

#### 6.2.7 审批费用

```
POST /api/ledger/expense/approve
```

**请求体**：

```json
{
  "expenseIds": [1, 2, 3],
  "action": "approve",
  "remark": "审批通过"
}
```

---

## 7. 税务管理模块

### 7.1 模块按钮功能清单

| 按钮名称 | 功能描述 | API接口 |
|---------|---------|---------|
| 日期选择 | 选择税务统计日期 | GET /api/ledger/tax/overview |
| 预警设置 | 设置税务预警规则 | POST /api/ledger/tax/alert-config |
| 税务报表 | 生成税务报表 | GET /api/ledger/tax/report |
| 查看详情 | 查看风险预警详情 | GET /api/ledger/tax/risk/{id} |
| 忽略预警 | 忽略风险预警 | POST /api/ledger/tax/ignore-risk |

### 7.2 API接口定义

#### 7.2.1 获取税务总览

```
GET /api/ledger/tax/overview
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 否 | 月份 yyyy-MM |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "comprehensiveTaxRate": 6.8,
    "targetTaxRate": 7.0,
    "totalTaxAmount": 185620,
    "monthOverMonth": 0.3,
    "riskLevel": "low",
    "pendingDeclarations": 2,
    "taxComposition": [
      { "name": "增值税", "amount": 125800, "rate": 4.2, "percent": 67.8 }
    ],
    "taxRateTrend": [
      { "month": "7月", "rate": 6.2, "target": 7.0 }
    ]
  }
}
```

#### 7.2.2 获取风险预警列表

```
GET /api/ledger/tax/risks
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| status | String | 否 | 状态：pending/resolved/ignored |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "risks": [
      {
        "id": "RISK001",
        "type": "warning",
        "title": "增值税税负率偏低",
        "desc": "当前增值税税负率4.2%，低于行业平均5.5%",
        "time": "2小时前",
        "status": "pending"
      }
    ]
  }
}
```

#### 7.2.3 获取申报日历

```
GET /api/ledger/tax/declarations
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| year | Integer | 否 | 年份 |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "declarations": [
      { "tax": "增值税", "period": "2026年1月", "deadline": "2026-02-15", "status": "pending", "amount": 42500 }
    ]
  }
}
```

#### 7.2.4 设置税务预警规则

```
POST /api/ledger/tax/alert-config
```

**请求体**：

```json
{
  "shopId": 1,
  "rules": [
    { "type": "tax_rate_low", "threshold": 5.0, "enabled": true },
    { "type": "invoice_expire", "days": 15, "enabled": true }
  ]
}
```

#### 7.2.5 生成税务报表

```
GET /api/ledger/tax/report
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| reportType | String | 是 | 报表类型：monthly/quarterly/annual |
| period | String | 是 | 期间 |
| format | String | 否 | 导出格式 |

#### 7.2.6 获取发票统计

```
GET /api/ledger/tax/invoice-stats
```

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 否 | 月份 |

**响应数据**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "outputTotal": 2856000,
    "outputCount": 1256,
    "inputTotal": 2125000,
    "inputCount": 856,
    "deductible": 1985000,
    "unverified": 140000
  }
}
```

---

## RuoYi框架类结构设计

### Controller层

```
com.doudian.finance.controller.ledger
├── DashboardController.java      // 经营概览
├── AccountingController.java     // 财务核算
├── FundsController.java          // 资金管理
├── InventoryController.java      // 库存成本
├── AnalysisController.java       // 经营分析
├── ExpenseController.java        // 费用中心
└── TaxController.java            // 税务管理
```

### Service层

```
com.doudian.finance.service.ledger
├── IDashboardService.java
├── IAccountingService.java
├── IFundsService.java
├── IInventoryService.java
├── IAnalysisService.java
├── IExpenseService.java
├── ITaxService.java
└── impl/
    ├── DashboardServiceImpl.java
    ├── AccountingServiceImpl.java
    ├── FundsServiceImpl.java
    ├── InventoryServiceImpl.java
    ├── AnalysisServiceImpl.java
    ├── ExpenseServiceImpl.java
    └── TaxServiceImpl.java
```

### Domain层

```
com.doudian.finance.domain.ledger
├── dto/
│   ├── DashboardOverviewDTO.java
│   ├── AccountingReportDTO.java
│   ├── FundsOverviewDTO.java
│   ├── InventoryOverviewDTO.java
│   ├── RoiAnalysisDTO.java
│   ├── ExpenseOverviewDTO.java
│   └── TaxOverviewDTO.java
├── vo/
│   ├── DashboardKpiVO.java
│   ├── IncomeStatementVO.java
│   ├── AccountVO.java
│   ├── SkuCostVO.java
│   ├── ChannelRoiVO.java
│   ├── ExpenseCategoryVO.java
│   └── TaxCompositionVO.java
└── entity/
    ├── FinancialAccount.java
    ├── FinancialTransaction.java
    ├── InventoryCost.java
    ├── ExpenseRecord.java
    └── TaxDeclaration.java
```

### Mapper层

```
com.doudian.finance.mapper.ledger
├── FinancialAccountMapper.java
├── FinancialTransactionMapper.java
├── InventoryCostMapper.java
├── ExpenseRecordMapper.java
└── TaxDeclarationMapper.java
```

---

## 通用响应格式

所有API统一使用以下响应格式：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

错误响应：

```json
{
  "code": 500,
  "msg": "系统错误",
  "data": null
}
```

常用错误码：

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 系统错误 |

---

## 版本记录

| 版本 | 日期 | 说明 |
|-----|------|------|
| 1.0.0 | 2026-01-16 | 初始版本，定义总账管理模块全部API |
