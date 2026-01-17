# 出纳管理模块 Java API 接口规范文档

## 文档信息

| 项目 | 说明 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2025-01-16 |
| 作者 | Manus AI |
| 适用范围 | 闪电账PRO - 出纳管理分组 |

---

## 1. 概述

本文档定义了出纳管理分组下8个模块的Java后端API接口规范，包括出纳工作台、资金流水、渠道管理、平台对账、差异分析、资金日报、资金月报、店铺统计。所有接口遵循阿里编码规范，按照RuoYi框架结构设计。

### 1.1 数据勾稽关系

出纳管理模块与以下外部数据源建立勾稽关联：

| 数据源 | 勾稽模块 | 勾稽字段 | 说明 |
|--------|----------|----------|------|
| 抖店订单API | 资金流水、平台对账 | order_id, payment_amount, refund_amount | 订单收款、退款数据同步 |
| 千川推广API | 资金流水、差异分析 | campaign_id, cost, rebate | 推广费支出、返点数据 |
| 聚水潭ERP | 资金流水、渠道管理 | purchase_id, supplier_id, payment_amount | 采购付款、供应商账户 |

### 1.2 RuoYi框架类结构

```
com.ruoyi.finance.cashier
├── controller
│   ├── CashierDashboardController.java      # 出纳工作台控制器
│   ├── CashflowController.java              # 资金流水控制器
│   ├── ChannelController.java               # 渠道管理控制器
│   ├── ReconciliationController.java        # 平台对账控制器
│   ├── DifferenceController.java            # 差异分析控制器
│   ├── DailyReportController.java           # 资金日报控制器
│   ├── MonthlyReportController.java         # 资金月报控制器
│   └── ShopReportController.java            # 店铺统计控制器
├── service
│   ├── ICashierDashboardService.java
│   ├── ICashflowService.java
│   ├── IChannelService.java
│   ├── IReconciliationService.java
│   ├── IDifferenceService.java
│   ├── IDailyReportService.java
│   ├── IMonthlyReportService.java
│   └── IShopReportService.java
├── service.impl
│   └── [对应Service实现类]
├── domain
│   ├── Cashflow.java                        # 资金流水实体
│   ├── Channel.java                         # 渠道实体
│   ├── Reconciliation.java                  # 对账记录实体
│   ├── Difference.java                      # 差异记录实体
│   └── [其他实体类]
├── mapper
│   └── [对应Mapper接口]
└── vo
    └── [视图对象类]
```

---

## 2. 出纳工作台模块 (CashierDashboard)

### 2.1 获取工作台概览数据

**接口路径**: `GET /api/cashier/dashboard/overview`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| date | String | 否 | 日期，默认今天，格式：yyyy-MM-dd |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "todayIncome": 15000.00,
    "todayExpense": 8500.00,
    "totalBalance": 186500.00,
    "reconciliationRate": 92.5,
    "incomeChange": 12.5,
    "expenseChange": 3.2,
    "balanceChange": 5.8,
    "pendingTasks": 3,
    "pendingAlerts": 2,
    "dataSource": {
      "doudianOrders": true,
      "qianchuanCost": true,
      "jushuitanErp": true
    }
  }
}
```

### 2.2 获取资金流动趋势

**接口路径**: `GET /api/cashier/dashboard/trend`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| days | Integer | 否 | 天数，默认7天 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "trendData": [
      {
        "date": "2025-01-10",
        "income": 12500.00,
        "expense": 6800.00,
        "doudianIncome": 10000.00,
        "qianchuanCost": 3500.00,
        "jushuitanPayment": 2000.00
      }
    ]
  }
}
```

### 2.3 获取待办任务列表

**接口路径**: `GET /api/cashier/dashboard/tasks`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "核对差异订单",
        "description": "3笔待处理差异订单",
        "action": "去处理",
        "actionUrl": "/cashier/differences",
        "priority": "high",
        "relatedOrders": ["DD20250115001", "DD20250115002"]
      }
    ]
  }
}
```

### 2.4 刷新工作台数据

**接口路径**: `POST /api/cashier/dashboard/refresh`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| syncDoudian | Boolean | 否 | 是否同步抖店数据 |
| syncQianchuan | Boolean | 否 | 是否同步千川数据 |
| syncJushuitan | Boolean | 否 | 是否同步聚水潭数据 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "刷新成功",
  "data": {
    "syncResults": {
      "doudian": { "success": true, "count": 150, "lastSyncTime": "2025-01-16 10:30:00" },
      "qianchuan": { "success": true, "count": 25, "lastSyncTime": "2025-01-16 10:30:00" },
      "jushuitan": { "success": true, "count": 30, "lastSyncTime": "2025-01-16 10:30:00" }
    }
  }
}
```

---

## 3. 资金流水模块 (Cashflow)

### 3.1 获取资金流水列表

**接口路径**: `GET /api/cashier/cashflow/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| channel | String | 否 | 渠道筛选 |
| type | String | 否 | 类型筛选（income/expense） |
| status | String | 否 | 状态筛选 |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |
| keyword | String | 否 | 关键词搜索 |
| pageNum | Integer | 否 | 页码，默认1 |
| pageSize | Integer | 否 | 每页条数，默认20 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 156,
    "rows": [
      {
        "id": 1,
        "flowNo": "CF20250116001",
        "channel": "抖音支付",
        "type": "income",
        "typeName": "订单收款",
        "amount": 1280.00,
        "balance": 186500.00,
        "orderNo": "DD20250116001",
        "transactionTime": "2025-01-16 08:30:00",
        "status": "confirmed",
        "remark": "抖店订单收款",
        "dataSource": "doudian",
        "relatedDoudianOrderId": "5012345678901234567"
      }
    ],
    "stats": {
      "totalIncome": 15000.00,
      "totalExpense": 8500.00,
      "netFlow": 6500.00
    }
  }
}
```

### 3.2 新增资金流水

**接口路径**: `POST /api/cashier/cashflow/add`

**请求参数**:

```json
{
  "shopId": 1,
  "channel": "银行转账",
  "type": "income",
  "typeName": "其他收入",
  "amount": 5000.00,
  "transactionDate": "2025-01-16",
  "transactionTime": "14:30:00",
  "orderNo": "",
  "remark": "供应商返点",
  "relatedJushuitanId": "JST20250116001"
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "新增成功",
  "data": {
    "id": 157,
    "flowNo": "CF20250116157"
  }
}
```

### 3.3 批量导入资金流水

**接口路径**: `POST /api/cashier/cashflow/import`

**请求参数**: multipart/form-data

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| file | File | 是 | Excel文件 |
| source | String | 否 | 数据来源（doudian/qianchuan/jushuitan/manual） |

**响应数据**:

```json
{
  "code": 200,
  "msg": "导入成功",
  "data": {
    "successCount": 45,
    "failCount": 2,
    "failDetails": [
      { "row": 12, "reason": "金额格式错误" },
      { "row": 28, "reason": "渠道不存在" }
    ]
  }
}
```

### 3.4 导出资金流水

**接口路径**: `GET /api/cashier/cashflow/export`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| format | String | 否 | 导出格式（excel/pdf），默认excel |

**响应**: 文件流

### 3.5 确认/作废资金流水

**接口路径**: `PUT /api/cashier/cashflow/updateStatus`

**请求参数**:

```json
{
  "ids": [1, 2, 3],
  "status": "confirmed",
  "remark": "批量确认"
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "updatedCount": 3
  }
}
```

---

## 4. 渠道管理模块 (Channel)

### 4.1 获取渠道列表

**接口路径**: `GET /api/cashier/channel/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| type | String | 否 | 渠道类型筛选 |
| status | String | 否 | 状态筛选 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "channels": [
      {
        "id": 1,
        "name": "抖音支付",
        "type": "电商平台",
        "balance": 58200.00,
        "todayIncome": 12500.00,
        "todayExpense": 3200.00,
        "status": "normal",
        "lastSyncTime": "2025-01-16 14:30:00",
        "linkedDoudianShopId": "12345678",
        "linkedQianchuanAccountId": "QC123456"
      }
    ],
    "summary": {
      "totalBalance": 286500.00,
      "totalChannels": 5,
      "activeChannels": 4
    }
  }
}
```

### 4.2 新增渠道

**接口路径**: `POST /api/cashier/channel/add`

**请求参数**:

```json
{
  "shopId": 1,
  "name": "工商银行对公账户",
  "type": "银行",
  "accountNo": "6222021234567890123",
  "initialBalance": 100000.00,
  "linkedJushuitanSupplierId": "SUP001",
  "remark": "主要采购付款账户"
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "新增成功",
  "data": {
    "id": 6
  }
}
```

### 4.3 同步渠道余额

**接口路径**: `POST /api/cashier/channel/syncBalance`

**请求参数**:

```json
{
  "channelIds": [1, 2, 3],
  "syncDoudian": true,
  "syncQianchuan": true,
  "syncJushuitan": true
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "同步成功",
  "data": {
    "syncResults": [
      {
        "channelId": 1,
        "channelName": "抖音支付",
        "previousBalance": 55000.00,
        "currentBalance": 58200.00,
        "difference": 3200.00,
        "syncSource": "doudian"
      }
    ]
  }
}
```

### 4.4 编辑渠道

**接口路径**: `PUT /api/cashier/channel/edit`

**请求参数**:

```json
{
  "id": 1,
  "name": "抖音支付（主账户）",
  "remark": "更新备注"
}
```

### 4.5 启用/禁用渠道

**接口路径**: `PUT /api/cashier/channel/updateStatus`

**请求参数**:

```json
{
  "id": 1,
  "status": "disabled"
}
```

---

## 5. 平台对账模块 (Reconciliation)

### 5.1 获取对账列表

**接口路径**: `GET /api/cashier/reconciliation/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| platform | String | 否 | 平台筛选 |
| status | String | 否 | 状态筛选（matched/difference/pending） |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 256,
    "rows": [
      {
        "id": 1,
        "orderNo": "DD20250116001",
        "doudianOrderId": "5012345678901234567",
        "platformAmount": 1000.00,
        "actualAmount": 980.00,
        "difference": -20.00,
        "differenceReason": "平台手续费",
        "status": "difference",
        "platform": "抖音",
        "orderDate": "2025-01-16",
        "reconciliationTime": "2025-01-16 15:00:00"
      }
    ],
    "stats": {
      "totalOrders": 256,
      "matchedOrders": 220,
      "differenceOrders": 36,
      "matchRate": 85.9,
      "totalDifference": -1580.00
    }
  }
}
```

### 5.2 发起对账

**接口路径**: `POST /api/cashier/reconciliation/start`

**请求参数**:

```json
{
  "shopId": 1,
  "platform": "抖音",
  "startDate": "2025-01-15",
  "endDate": "2025-01-16",
  "syncFromDoudian": true,
  "autoMatch": true
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "对账任务已启动",
  "data": {
    "taskId": "RECON20250116001",
    "status": "processing",
    "estimatedTime": 30
  }
}
```

### 5.3 导出对账单

**接口路径**: `GET /api/cashier/reconciliation/export`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| platform | String | 否 | 平台筛选 |
| format | String | 否 | 导出格式 |

**响应**: 文件流

### 5.4 标记已核对

**接口路径**: `PUT /api/cashier/reconciliation/markVerified`

**请求参数**:

```json
{
  "ids": [1, 2, 3],
  "verifyRemark": "已人工核对确认"
}
```

### 5.5 查看差异详情

**接口路径**: `GET /api/cashier/reconciliation/differenceDetail`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 对账记录ID |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "reconciliation": {
      "id": 1,
      "orderNo": "DD20250116001",
      "platformAmount": 1000.00,
      "actualAmount": 980.00,
      "difference": -20.00
    },
    "doudianOrder": {
      "orderId": "5012345678901234567",
      "payAmount": 1000.00,
      "platformFee": 20.00,
      "settlementAmount": 980.00
    },
    "qianchuanCost": {
      "campaignId": "QC123456",
      "cost": 0.00,
      "rebate": 0.00
    },
    "differenceBreakdown": [
      { "item": "平台技术服务费", "amount": -20.00 }
    ]
  }
}
```

---

## 6. 差异分析模块 (Difference)

### 6.1 获取差异列表

**接口路径**: `GET /api/cashier/difference/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| platform | String | 否 | 平台筛选 |
| reason | String | 否 | 差异原因筛选 |
| status | String | 否 | 处理状态筛选 |
| minAmount | BigDecimal | 否 | 最小差异金额 |
| maxAmount | BigDecimal | 否 | 最大差异金额 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页条数 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 83,
    "rows": [
      {
        "id": 1,
        "orderNo": "DD20250116001",
        "platform": "抖音",
        "differenceAmount": -520.00,
        "reason": "推广费扣除",
        "reasonDetail": "千川推广费结算差异",
        "duration": "3天",
        "status": "pending",
        "handler": null,
        "createTime": "2025-01-13 10:00:00",
        "relatedQianchuanCampaignId": "QC789012"
      }
    ],
    "stats": {
      "totalDifference": -15800.00,
      "pendingCount": 38,
      "processingCount": 25,
      "resolvedCount": 85
    }
  }
}
```

### 6.2 处理差异

**接口路径**: `POST /api/cashier/difference/handle`

**请求参数**:

```json
{
  "id": 1,
  "handleType": "adjust",
  "adjustAmount": -520.00,
  "handleRemark": "确认为千川推广费扣除，已调整",
  "relatedCashflowId": 157
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "处理成功",
  "data": {
    "id": 1,
    "status": "resolved",
    "handleTime": "2025-01-16 15:30:00"
  }
}
```

### 6.3 批量处理差异

**接口路径**: `POST /api/cashier/difference/batchHandle`

**请求参数**:

```json
{
  "ids": [1, 2, 3],
  "handleType": "ignore",
  "handleRemark": "批量忽略小额差异"
}
```

### 6.4 导出差异报表

**接口路径**: `GET /api/cashier/difference/export`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| format | String | 否 | 导出格式 |

**响应**: 文件流

### 6.5 获取差异统计分析

**接口路径**: `GET /api/cashier/difference/analysis`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| dimension | String | 否 | 分析维度（platform/shop/channel） |
| days | Integer | 否 | 统计天数 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "trendData": [
      { "date": "2025-01-10", "count": 12, "amount": 1580.00 }
    ],
    "reasonDistribution": [
      { "reason": "平台手续费", "count": 35, "amount": 4500.00, "percentage": 35 }
    ],
    "platformComparison": [
      { "platform": "抖音", "pending": 15, "resolved": 45, "totalAmount": 8500.00 }
    ],
    "topDifferences": [
      {
        "rank": 1,
        "orderNo": "DD20250115008",
        "amount": -520.00,
        "reason": "推广费扣除",
        "relatedQianchuanCampaignId": "QC789012"
      }
    ]
  }
}
```

---

## 7. 资金日报模块 (DailyReport)

### 7.1 获取日报数据

**接口路径**: `GET /api/cashier/dailyReport/data`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| date | String | 是 | 报告日期，格式：yyyy-MM-dd |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "reportDate": "2025-01-16",
    "summary": {
      "totalIncome": 13999.00,
      "totalExpense": 7080.00,
      "netFlow": 6919.00,
      "openingBalance": 179581.00,
      "closingBalance": 186500.00
    },
    "incomeDetails": [
      {
        "time": "08:30",
        "channel": "抖音支付",
        "type": "商品销售",
        "orderNo": "DD20250116001",
        "amount": 1280.00,
        "status": "confirmed",
        "doudianOrderId": "5012345678901234567"
      }
    ],
    "expenseDetails": [
      {
        "time": "09:00",
        "channel": "抖音支付",
        "type": "平台扣款",
        "summary": "技术服务费",
        "amount": 520.00,
        "status": "confirmed"
      }
    ],
    "incomeBySource": [
      { "source": "抖店订单", "amount": 10000.00, "percentage": 71.4 },
      { "source": "千川返点", "amount": 500.00, "percentage": 3.6 },
      { "source": "聚水潭退款", "amount": 1000.00, "percentage": 7.1 }
    ],
    "expenseByType": [
      { "type": "推广费用", "amount": 3500.00, "percentage": 49.4, "qianchuanCost": 3500.00 },
      { "type": "采购付款", "amount": 2000.00, "percentage": 28.2, "jushuitanPayment": 2000.00 }
    ],
    "reconciliationStatus": {
      "totalOrders": 45,
      "matchedOrders": 42,
      "differenceOrders": 3,
      "matchRate": 93.3
    }
  }
}
```

### 7.2 生成日报

**接口路径**: `POST /api/cashier/dailyReport/generate`

**请求参数**:

```json
{
  "shopId": 1,
  "date": "2025-01-16",
  "template": "standard",
  "includeCharts": true,
  "syncLatestData": true
}
```

**响应数据**:

```json
{
  "code": 200,
  "msg": "生成成功",
  "data": {
    "reportId": "DR20250116001",
    "generateTime": "2025-01-16 16:00:00"
  }
}
```

### 7.3 导出日报

**接口路径**: `GET /api/cashier/dailyReport/export`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| date | String | 是 | 报告日期 |
| format | String | 否 | 导出格式（excel/pdf） |

**响应**: 文件流

### 7.4 发送日报

**接口路径**: `POST /api/cashier/dailyReport/send`

**请求参数**:

```json
{
  "shopId": 1,
  "date": "2025-01-16",
  "recipients": ["finance@company.com", "manager@company.com"],
  "sendType": "email",
  "includeAttachment": true
}
```

---

## 8. 资金月报模块 (MonthlyReport)

### 8.1 获取月报数据

**接口路径**: `GET /api/cashier/monthlyReport/data`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 是 | 报告月份，格式：yyyy-MM |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "reportMonth": "2025-01",
    "summary": {
      "totalIncome": 320000.00,
      "totalExpense": 120000.00,
      "netFlow": 200000.00,
      "avgDailyIncome": 10322.58,
      "avgDailyExpense": 3870.97,
      "incomeGrowth": 15.2,
      "expenseGrowth": 8.5
    },
    "trendData": [
      {
        "day": "01",
        "income": 12500.00,
        "expense": 4500.00,
        "balance": 8000.00,
        "doudianIncome": 10000.00,
        "qianchuanCost": 2500.00
      }
    ],
    "incomeStructure": [
      { "source": "抖店订单收入", "amount": 280000.00, "percentage": 87.5 },
      { "source": "千川返点", "amount": 15000.00, "percentage": 4.7 },
      { "source": "聚水潭退款", "amount": 10000.00, "percentage": 3.1 }
    ],
    "expenseStructure": [
      { "type": "千川推广费", "amount": 45000.00, "percentage": 37.5 },
      { "type": "聚水潭采购", "amount": 35000.00, "percentage": 29.2 }
    ],
    "channelComparison": [
      { "channel": "抖音支付", "income": 125000.00, "expense": 45000.00 }
    ],
    "differenceStats": [
      { "reason": "平台手续费", "count": 85, "amount": 12500.00 }
    ],
    "forecast": {
      "nextMonthIncome": 350000.00,
      "nextMonthExpense": 130000.00,
      "confidence": 85
    }
  }
}
```

### 8.2 生成月报

**接口路径**: `POST /api/cashier/monthlyReport/generate`

**请求参数**:

```json
{
  "shopId": 1,
  "month": "2025-01",
  "template": "detailed",
  "includeCharts": true,
  "includeForecast": true
}
```

### 8.3 导出月报

**接口路径**: `GET /api/cashier/monthlyReport/export`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 是 | 报告月份 |
| format | String | 否 | 导出格式 |

**响应**: 文件流

### 8.4 月度对比分析

**接口路径**: `GET /api/cashier/monthlyReport/compare`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| month1 | String | 是 | 对比月份1 |
| month2 | String | 是 | 对比月份2 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "comparison": {
      "income": { "month1": 280000.00, "month2": 320000.00, "change": 14.3 },
      "expense": { "month1": 110000.00, "month2": 120000.00, "change": 9.1 },
      "netFlow": { "month1": 170000.00, "month2": 200000.00, "change": 17.6 }
    },
    "channelComparison": [
      {
        "channel": "抖音支付",
        "month1Income": 100000.00,
        "month2Income": 125000.00,
        "incomeChange": 25.0
      }
    ]
  }
}
```

---

## 9. 店铺统计模块 (ShopReport)

### 9.1 获取店铺统计列表

**接口路径**: `GET /api/cashier/shopReport/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 否 | 店铺ID，不传则返回所有店铺 |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "shops": [
      {
        "id": 1,
        "name": "抖音旗舰店",
        "platform": "抖音",
        "doudianShopId": "12345678",
        "income": 125000.00,
        "expense": 45000.00,
        "netProfit": 80000.00,
        "orders": 1580,
        "avgOrderAmount": 79.11,
        "growth": 12.5,
        "status": "normal",
        "qianchuanCost": 25000.00,
        "jushuitanPurchase": 15000.00
      }
    ],
    "summary": {
      "totalIncome": 320000.00,
      "totalExpense": 120000.00,
      "totalNetProfit": 200000.00,
      "totalOrders": 3930,
      "avgGrowth": 8.6
    }
  }
}
```

### 9.2 获取单店铺详情

**接口路径**: `GET /api/cashier/shopReport/detail`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "shop": {
      "id": 1,
      "name": "抖音旗舰店",
      "platform": "抖音",
      "doudianShopId": "12345678"
    },
    "stats": {
      "income": 125000.00,
      "expense": 45000.00,
      "netProfit": 80000.00,
      "orders": 1580,
      "avgOrderAmount": 79.11,
      "growth": 12.5
    },
    "trendData": [
      { "date": "2025-01-10", "income": 4500.00, "expense": 1600.00, "orders": 58 }
    ],
    "incomeBreakdown": [
      { "source": "抖店订单", "amount": 120000.00, "percentage": 96 },
      { "source": "千川返点", "amount": 5000.00, "percentage": 4 }
    ],
    "expenseBreakdown": [
      { "type": "千川推广", "amount": 25000.00, "percentage": 55.6 },
      { "type": "聚水潭采购", "amount": 15000.00, "percentage": 33.3 }
    ]
  }
}
```

### 9.3 导出店铺统计报表

**接口路径**: `GET /api/cashier/shopReport/export`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopIds | String | 否 | 店铺ID列表，逗号分隔 |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| format | String | 否 | 导出格式 |

**响应**: 文件流

### 9.4 店铺对比分析

**接口路径**: `GET /api/cashier/shopReport/compare`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopIds | String | 是 | 店铺ID列表，逗号分隔 |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |
| metrics | String | 否 | 对比指标（income,expense,orders,profit） |

**响应数据**:

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "comparison": [
      {
        "shopId": 1,
        "shopName": "抖音旗舰店",
        "income": 125000.00,
        "expense": 45000.00,
        "orders": 1580,
        "profit": 80000.00,
        "profitRate": 64.0,
        "rank": 1
      },
      {
        "shopId": 2,
        "shopName": "快手专营店",
        "income": 85000.00,
        "expense": 32000.00,
        "orders": 980,
        "profit": 53000.00,
        "profitRate": 62.4,
        "rank": 2
      }
    ],
    "charts": {
      "incomeComparison": [
        { "shop": "抖音旗舰店", "value": 125000.00 },
        { "shop": "快手专营店", "value": 85000.00 }
      ],
      "profitRateComparison": [
        { "shop": "抖音旗舰店", "value": 64.0 },
        { "shop": "快手专营店", "value": 62.4 }
      ]
    }
  }
}
```

---

## 10. 通用响应格式

### 10.1 成功响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": { ... }
}
```

### 10.2 错误响应

```json
{
  "code": 500,
  "msg": "操作失败：具体错误信息",
  "data": null
}
```

### 10.3 分页响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 100,
    "rows": [ ... ],
    "pageNum": 1,
    "pageSize": 20,
    "pages": 5
  }
}
```

---

## 11. 数据勾稽实现说明

### 11.1 抖店订单数据勾稽

在资金流水、平台对账模块中，通过以下字段与抖店订单建立关联：

| 本地字段 | 抖店字段 | 说明 |
|----------|----------|------|
| doudianOrderId | order_id | 抖店订单ID |
| paymentAmount | pay_amount | 实付金额 |
| refundAmount | refund_amount | 退款金额 |
| platformFee | platform_cost | 平台扣费 |
| settlementAmount | settlement_amount | 结算金额 |

### 11.2 千川推广数据勾稽

在资金流水、差异分析模块中，通过以下字段与千川数据建立关联：

| 本地字段 | 千川字段 | 说明 |
|----------|----------|------|
| qianchuanCampaignId | ad_id | 广告计划ID |
| qianchuanCost | stat_cost | 消耗金额 |
| qianchuanRebate | rebate_amount | 返点金额 |

### 11.3 聚水潭ERP数据勾稽

在资金流水、渠道管理模块中，通过以下字段与聚水潭数据建立关联：

| 本地字段 | 聚水潭字段 | 说明 |
|----------|------------|------|
| jushuitanPurchaseId | io_id | 入库单ID |
| jushuitanSupplierId | supplier_id | 供应商ID |
| jushuitanPaymentAmount | total_amount | 采购金额 |

---

## 12. 附录

### 12.1 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 12.2 渠道类型

| 类型 | 说明 |
|------|------|
| ecommerce | 电商平台（抖音、快手等） |
| payment | 第三方支付（支付宝、微信） |
| bank | 银行账户 |
| erp | ERP系统（聚水潭） |

### 12.3 流水类型

| 类型 | 说明 |
|------|------|
| order_income | 订单收款 |
| refund_return | 退款返还 |
| platform_fee | 平台扣款 |
| promotion_cost | 推广费用 |
| logistics_fee | 物流费用 |
| purchase_payment | 采购付款 |
| other | 其他 |
