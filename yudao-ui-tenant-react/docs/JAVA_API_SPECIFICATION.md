# 后端Java API规范文档

## 概述

本文档定义了闪电账PRO订单管理分组模块的后端Java API规范。租户端（Node.js/React）通过调用这些API获取数据，所有数据库操作由后端Java服务实现。

### 架构说明

- **租户端（前端）**: Node.js / React，负责数据展示和用户交互
- **后端Java服务**: 负责所有数据库操作、勾稽逻辑、数据同步

### 通用规范

#### 请求格式

- **Content-Type**: `application/json`
- **字符编码**: `UTF-8`
- **认证方式**: Bearer Token（放在Authorization头中）

#### 响应格式

所有API响应遵循统一的JSON格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": 1705200000000
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 响应码，0表示成功，非0表示失败 |
| message | string | 响应消息 |
| data | object | 响应数据 |
| timestamp | number | 时间戳（毫秒） |

#### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 10001 | 参数错误 |
| 10002 | 认证失败 |
| 10003 | 权限不足 |
| 20001 | 数据库错误 |
| 20002 | 数据不存在 |
| 30001 | 外部API调用失败 |
| 40001 | 业务逻辑错误 |

---

## 一、勾稽检查API

### 1.1 执行实时勾稽检查

**接口地址**: `POST /api/reconciliation/realtime`

**请求参数**:

```json
{
  "tenantId": "string"
}
```

**响应数据**:

```json
{
  "id": "rec_20250114_001",
  "type": "realtime",
  "checkTime": "2025-01-14T10:00:00Z",
  "status": "success",
  "items": [
    {
      "name": "订单数量",
      "expected": 1000,
      "actual": 1000,
      "difference": 0,
      "differenceRate": 0,
      "status": "match",
      "tolerance": 0
    }
  ],
  "exceptionCount": 0,
  "summary": "所有检查项通过"
}
```

### 1.2 执行日结勾稽检查

**接口地址**: `POST /api/reconciliation/daily`

**请求参数**:

```json
{
  "tenantId": "string",
  "date": "2025-01-14"
}
```

### 1.3 执行月结勾稽检查

**接口地址**: `POST /api/reconciliation/monthly`

**请求参数**:

```json
{
  "tenantId": "string",
  "month": "2025-01"
}
```

### 1.4 获取待处理异常列表

**接口地址**: `GET /api/reconciliation/exceptions`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tenantId | string | 是 | 租户ID |
| status | string | 否 | 状态：pending/processing/resolved |
| pageNo | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |

### 1.5 解决异常

**接口地址**: `POST /api/reconciliation/exceptions/{exceptionId}/resolve`

**请求参数**:

```json
{
  "resolution": "已核实，金额差异为平台优惠导致"
}
```

---

## 二、订单同步API

### 2.1 从抖店同步订单

**接口地址**: `POST /api/order-sync/doudian`

**请求参数**:

```json
{
  "tenantId": "string",
  "startDate": "2025-01-01",
  "endDate": "2025-01-14"
}
```

**响应数据**:

```json
{
  "syncId": "sync_20250114_001",
  "syncTime": "2025-01-14T10:00:00Z",
  "status": "success",
  "addedCount": 100,
  "updatedCount": 50,
  "failedCount": 0,
  "errors": []
}
```

### 2.2 订单对账

**接口地址**: `POST /api/order-sync/compare`

**请求参数**:

```json
{
  "tenantId": "string",
  "startDate": "2025-01-01",
  "endDate": "2025-01-14"
}
```

### 2.3 获取同步日志

**接口地址**: `GET /api/order-sync/logs`

### 2.4 获取最后同步时间

**接口地址**: `GET /api/order-sync/last-sync-time`

---

## 三、单据管理API

### 3.1 获取单据列表

**接口地址**: `GET /api/documents`

### 3.2 获取单据详情

**接口地址**: `GET /api/documents/{documentId}`

### 3.3 获取单据关联的订单

**接口地址**: `GET /api/documents/{documentId}/orders`

### 3.4 关联订单到单据

**接口地址**: `POST /api/documents/{documentId}/link`

### 3.5 取消订单与单据的关联

**接口地址**: `DELETE /api/documents/{documentId}/orders/{orderId}`

### 3.6 更新单据状态

**接口地址**: `PUT /api/documents/{documentId}/status`

---

## 四、8个模块勾稽关系

### 4.1 模块关系

1. **订单管理 ↔ 订单统计** - 订单总数、销售额一致性
2. **订单统计 ↔ 订单明细** - 汇总金额、各类费用一致性
3. **订单明细 ↔ 最近30天明细** - 日度数据汇总一致性
4. **最近30天明细 ↔ 按月汇总** - 月度数据汇总一致性
5. **按月汇总 ↔ 按年汇总** - 年度数据汇总一致性
6. **成本配置 → 订单明细** - 商品成本关联、利润计算正确性
7. **单据中心 → 订单管理** - 单据与订单关联、金额一致性

### 4.2 勾稽规则

| 勾稽层级 | 检查内容 | 容差 | 频率 |
|---------|---------|------|------|
| 一级勾稽 | 订单数量、金额、状态 | 0/0.01元 | 实时 |
| 二级勾稽 | 各类费用、成本、利润 | 0.01元 | 日结 |
| 三级勾稽 | 日月年数据递推关系 | 0.01元 | 月结 |

---

## 五、实现建议

### 5.1 代码规范

遵循阿里巴巴Java开发手册：

1. 类名使用UpperCamelCase
2. 方法名使用lowerCamelCase
3. 常量使用UPPER_SNAKE_CASE
4. 类和方法必须有JavaDoc注释

### 5.2 项目结构

```
src/main/java/com/shandianzhang/
├── controller/           # 控制器层
├── service/              # 服务层
├── dao/                  # 数据访问层
├── model/                # 数据模型
├── config/               # 配置类
├── exception/            # 异常类
└── util/                 # 工具类
```

---

## 六、版本历史

| 版本 | 日期 | 作者 | 说明 |
|------|------|------|------|
| 1.0.0 | 2025-01-14 | 闪电账PRO | 初始版本 |


---

## 七、经营概览API（P0优化新增）

### 7.1 获取KPI概览数据

**接口路径**: `GET /api/dashboard/overview`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| shopId | string | 否 | 店铺ID，不传则查询所有店铺 |
| startDate | string | 是 | 开始日期，格式: YYYY-MM-DD |
| endDate | string | 是 | 结束日期，格式: YYYY-MM-DD |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalRevenue": 619571.24,
    "orderCount": 18700,
    "completedOrders": 14487,
    "refundAmount": 122352.74,
    "netSales": 497218.50,
    "grossProfit": 224323.50,
    "netProfit": -71813.30,
    "expenses": {
      "express": 46358.40,
      "commission": 43405.25,
      "service": 12392.43,
      "promotion": 191131.42,
      "insurance": 2049.57,
      "payout": 211.09,
      "other": 604.22
    },
    "ratios": {
      "refundRate": 19.75,
      "profitRate": -11.59,
      "completionRate": 77.47,
      "promotionRate": 30.85
    }
  }
}
```

### 7.2 获取趋势数据

**接口路径**: `GET /api/dashboard/trends`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| shopId | string | 否 | 店铺ID |
| startDate | string | 是 | 开始日期 |
| endDate | string | 是 | 结束日期 |
| granularity | string | 否 | 粒度: day/week/month，默认day |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "date": "2025-04-01",
      "salesAmount": 15234.50,
      "orderCount": 456,
      "refundAmount": 2345.00,
      "profitAmount": -1234.50
    }
  ]
}
```

### 7.3 获取费用构成

**接口路径**: `GET /api/dashboard/expense-breakdown`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| shopId | string | 否 | 店铺ID |
| startDate | string | 是 | 开始日期 |
| endDate | string | 是 | 结束日期 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "category": "推广费用", "amount": 191131.42, "percent": 64.5 },
    { "category": "物流费用", "amount": 46358.40, "percent": 15.6 },
    { "category": "达人佣金", "amount": 43405.25, "percent": 14.6 },
    { "category": "平台服务费", "amount": 12392.43, "percent": 4.2 },
    { "category": "保险费", "amount": 2049.57, "percent": 0.7 },
    { "category": "其他", "amount": 815.31, "percent": 0.4 }
  ]
}
```

---

## 八、资金流水API（P0优化新增）

### 8.1 获取流水列表

**接口路径**: `GET /api/cashflow/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| shopId | string | 否 | 店铺ID |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| channel | string | 否 | 渠道: doudian/alipay/wechat/bank/qianchuan/other |
| type | string | 否 | 类型: order_income/refund_out/platform_fee/... |
| status | string | 否 | 状态: pending/confirmed/cancelled |
| keyword | string | 否 | 关键词搜索（订单号/备注） |
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页条数，默认20 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "cf_001",
        "shopId": "shop_001",
        "transactionDate": "2025-04-30",
        "transactionTime": "14:30:00",
        "channel": "doudian",
        "channelName": "抖店支付",
        "type": "order_income",
        "typeName": "订单收入",
        "income": 1280.00,
        "expense": 0,
        "balance": 186500.00,
        "orderNo": "DD20250430001",
        "status": "confirmed",
        "statusName": "已确认",
        "remark": "抖音订单结算",
        "tags": ["日常", "订单"],
        "createdAt": "2025-04-30T14:30:00Z"
      }
    ],
    "total": 1256,
    "page": 1,
    "pageSize": 20,
    "totalPages": 63
  }
}
```

### 8.2 获取单条流水

**接口路径**: `GET /api/cashflow/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| id | string | 是 | 流水ID |

### 8.3 创建流水

**接口路径**: `POST /api/cashflow`

**请求体**:
```json
{
  "shopId": "shop_001",
  "transactionDate": "2025-04-30",
  "transactionTime": "14:30:00",
  "channel": "doudian",
  "type": "order_income",
  "income": 1280.00,
  "expense": 0,
  "orderNo": "DD20250430001",
  "remark": "抖音订单结算",
  "tags": ["日常", "订单"]
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "cf_001"
  }
}
```

### 8.4 更新流水

**接口路径**: `PUT /api/cashflow/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| id | string | 是 | 流水ID |

**请求体**:
```json
{
  "transactionDate": "2025-04-30",
  "transactionTime": "15:00:00",
  "channel": "doudian",
  "type": "order_income",
  "income": 1300.00,
  "remark": "修改后的备注"
}
```

### 8.5 删除流水

**接口路径**: `DELETE /api/cashflow/{id}`

### 8.6 确认流水

**接口路径**: `POST /api/cashflow/{id}/confirm`

### 8.7 批量确认流水

**接口路径**: `POST /api/cashflow/batch-confirm`

**请求体**:
```json
{
  "ids": ["cf_001", "cf_002", "cf_003"]
}
```

### 8.8 获取流水统计

**接口路径**: `GET /api/cashflow/stats`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|-----|-----|-----|
| shopId | string | 否 | 店铺ID |
| startDate | string | 是 | 开始日期 |
| endDate | string | 是 | 结束日期 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalIncome": 285000.00,
    "totalExpense": 156000.00,
    "netFlow": 129000.00,
    "transactionCount": 1256,
    "pendingCount": 45,
    "confirmedCount": 1211
  }
}
```

---

## 九、枚举定义（P0优化新增）

### 9.1 资金渠道

| 编码 | 名称 |
|-----|-----|
| doudian | 抖店支付 |
| alipay | 支付宝 |
| wechat | 微信支付 |
| bank | 银行转账 |
| qianchuan | 千川账户 |
| other | 其他 |

### 9.2 流水类型

| 编码 | 名称 |
|-----|-----|
| order_income | 订单收入 |
| refund_out | 退款支出 |
| platform_fee | 平台扣款 |
| promotion_fee | 推广费用 |
| withdrawal | 提现 |
| deposit | 充值 |
| transfer_in | 转入 |
| transfer_out | 转出 |
| settlement | 平台结算 |
| other | 其他 |

### 9.3 流水状态

| 编码 | 名称 |
|-----|-----|
| pending | 待确认 |
| confirmed | 已确认 |
| cancelled | 已取消 |

---

## 十、环境配置

前端需要配置Java API的基础URL：

```typescript
// 环境变量
JAVA_API_BASE_URL=http://localhost:8080
```

---

| 版本 | 日期 | 作者 | 说明 |
|------|------|------|------|
| 1.1.0 | 2025-01-15 | Manus AI | 新增经营概览API和资金流水API规范 |
