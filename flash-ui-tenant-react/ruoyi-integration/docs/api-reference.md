# 闪电账PRO API接口文档

## 一、接口概述

本文档描述了闪电账PRO系统整合到RuoYi-Vue-Pro框架后的RESTful API接口规范。所有接口遵循RuoYi-Vue-Pro的统一响应格式和认证机制。

### 1.1 基础信息

| 项目 | 说明 |
|------|------|
| 基础路径 | `/admin-api/finance/` (管理后台) 或 `/app-api/finance/` (租户端) |
| 认证方式 | JWT Token，通过 `Authorization: Bearer {token}` 请求头传递 |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

### 1.2 统一响应格式

```json
{
  "code": 0,           // 状态码，0表示成功，非0表示失败
  "msg": "success",    // 提示信息
  "data": {}           // 响应数据
}
```

### 1.3 分页响应格式

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [],        // 数据列表
    "total": 100       // 总记录数
  }
}
```

## 二、商品成本管理

### 2.1 获取商品成本分页列表

**请求**

```
GET /admin-api/finance/product-cost/page
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码，默认1 |
| pageSize | Integer | 否 | 每页条数，默认10 |
| productId | String | 否 | 商品号（模糊查询） |
| title | String | 否 | 商品标题（模糊查询） |
| sku | String | 否 | SKU编码（模糊查询） |
| shopName | String | 否 | 店铺名称 |
| status | Integer | 否 | 状态：0有效，1删除 |

**响应示例**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "productId": "3701234567890",
        "sku": "0",
        "title": "滋栈 红枣枸杞茶 150g",
        "cost": 10.00,
        "merchantCode": "ZZ001",
        "price": 29.90,
        "customName": null,
        "stock": 100,
        "status": 0,
        "effectiveDate": "2025-01-01 00:00:00",
        "shopName": "滋栈官方旗舰店",
        "createTime": "2025-01-01 10:00:00",
        "updateTime": "2025-01-14 15:30:00"
      }
    ],
    "total": 72
  }
}
```

### 2.2 获取商品成本详情

**请求**

```
GET /admin-api/finance/product-cost/get?id={id}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 商品成本ID |

### 2.3 创建商品成本

**请求**

```
POST /admin-api/finance/product-cost/create
Content-Type: application/json
```

**请求体**

```json
{
  "productId": "3701234567890",
  "sku": "0",
  "title": "滋栈 红枣枸杞茶 150g",
  "cost": 10.00,
  "merchantCode": "ZZ001",
  "price": 29.90,
  "stock": 100,
  "shopName": "滋栈官方旗舰店"
}
```

### 2.4 更新商品成本

**请求**

```
PUT /admin-api/finance/product-cost/update
Content-Type: application/json
```

**请求体**

```json
{
  "id": 1,
  "cost": 12.00,
  "reason": "供应商调价"
}
```

### 2.5 删除商品成本

**请求**

```
DELETE /admin-api/finance/product-cost/delete?id={id}
```

### 2.6 批量导入商品成本

**请求**

```
POST /admin-api/finance/product-cost/import
Content-Type: multipart/form-data
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | Excel文件 |

**响应示例**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "createCount": 10,
    "updateCount": 5,
    "failCount": 0,
    "failMsg": ""
  }
}
```

### 2.7 获取成本变更历史

**请求**

```
GET /admin-api/finance/product-cost/history?productCostId={productCostId}
```

### 2.8 获取店铺名称列表

**请求**

```
GET /admin-api/finance/product-cost/shop-names
```

## 三、订单管理

### 3.1 获取订单分页列表

**请求**

```
GET /admin-api/finance/order/page
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码，默认1 |
| pageSize | Integer | 否 | 每页条数，默认10 |
| mainOrderNo | String | 否 | 主订单编号（模糊查询） |
| subOrderNo | String | 否 | 子订单编号（模糊查询） |
| productName | String | 否 | 商品名称（模糊查询） |
| receiver | String | 否 | 收件人（模糊查询） |
| status | String | 否 | 订单状态 |
| province | String | 否 | 省份 |
| shopName | String | 否 | 店铺名称 |
| orderTime | String[] | 否 | 下单时间范围 |

**响应示例**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "mainOrderNo": "7012345678901234567",
        "subOrderNo": "7012345678901234567A",
        "productName": "滋栈 红枣枸杞茶 150g",
        "productSpec": "150g/盒",
        "quantity": 2,
        "sku": "ZZ001",
        "unitPrice": 29.90,
        "payAmount": 59.80,
        "freight": 0.00,
        "totalDiscount": 10.00,
        "receiver": "张**",
        "province": "广东省",
        "city": "深圳市",
        "orderTime": "2025-04-15 10:30:00",
        "status": "已完成",
        "shopName": "滋栈官方旗舰店"
      }
    ],
    "total": 18700
  }
}
```

### 3.2 获取订单详情

**请求**

```
GET /admin-api/finance/order/get?id={id}
```

### 3.3 获取订单统计数据

**请求**

```
GET /admin-api/finance/order/stats
```

**响应示例**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "totalCount": 18700,
    "shippedCount": 14487,
    "totalAmount": 619571.24
  }
}
```

### 3.4 创建订单

**请求**

```
POST /admin-api/finance/order/create
Content-Type: application/json
```

### 3.5 更新订单

**请求**

```
PUT /admin-api/finance/order/update
Content-Type: application/json
```

### 3.6 删除订单

**请求**

```
DELETE /admin-api/finance/order/delete?id={id}
```

### 3.7 批量导入订单

**请求**

```
POST /admin-api/finance/order/import
Content-Type: multipart/form-data
```

### 3.8 获取省份列表

**请求**

```
GET /admin-api/finance/order/provinces
```

### 3.9 获取订单状态列表

**请求**

```
GET /admin-api/finance/order/statuses
```

## 四、抖店API

### 4.1 检查API配置状态

**请求**

```
GET /admin-api/finance/doudian/config/check
```

**响应示例**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "configured": true,
    "appKey": "701234****",
    "availability": {
      "order": { "available": true, "description": "订单查询" },
      "product": { "available": true, "description": "商品查询" },
      "settle": { "available": true, "description": "结算账单" },
      "commission": { "available": true, "description": "达人佣金" },
      "insurance": { "available": true, "description": "保险查询" },
      "afterSale": { "available": true, "description": "售后查询" }
    }
  }
}
```

### 4.2 同步订单

**请求**

```
POST /admin-api/finance/doudian/order/sync
Content-Type: application/json
```

**请求体**

```json
{
  "accessToken": "your_access_token",
  "startTime": "2025-04-01 00:00:00",
  "endTime": "2025-04-30 23:59:59",
  "page": 1,
  "size": 50
}
```

**响应示例**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": true,
    "syncCount": 50,
    "totalCount": 1200,
    "hasMore": true
  }
}
```

### 4.3 获取订单详情

**请求**

```
GET /admin-api/finance/doudian/order/detail?accessToken={token}&shopOrderId={orderId}
```

### 4.4 同步商品

**请求**

```
POST /admin-api/finance/doudian/product/sync
Content-Type: application/json
```

### 4.5 获取商品详情

**请求**

```
GET /admin-api/finance/doudian/product/detail?accessToken={token}&productId={productId}
```

### 4.6 获取结算账单

**请求**

```
GET /admin-api/finance/doudian/settle/bill
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| accessToken | String | 是 | 访问令牌 |
| startTime | String | 是 | 开始时间 |
| endTime | String | 是 | 结束时间 |
| page | Integer | 否 | 页码 |
| size | Integer | 否 | 每页条数 |

### 4.7 获取资金流水

**请求**

```
GET /admin-api/finance/doudian/account/flow
```

### 4.8 获取达人佣金

**请求**

```
GET /admin-api/finance/doudian/commission/list
```

### 4.9 获取保险详情

**请求**

```
GET /admin-api/finance/doudian/insurance/detail?accessToken={token}&orderId={orderId}
```

### 4.10 获取售后列表

**请求**

```
GET /admin-api/finance/doudian/aftersale/list
```

### 4.11 获取售后详情

**请求**

```
GET /admin-api/finance/doudian/aftersale/detail?accessToken={token}&afterSaleId={afterSaleId}
```

## 五、错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，请先登录 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001001001 | 商品成本不存在 |
| 1001001002 | 商品成本已存在 |
| 1001002001 | 订单不存在 |
| 1001002002 | 订单编号已存在 |
| 1001003001 | 抖店配置不存在 |
| 1001003002 | 抖店API调用失败 |

## 六、权限标识

| 权限标识 | 说明 |
|----------|------|
| finance:product-cost:query | 查询商品成本 |
| finance:product-cost:create | 创建商品成本 |
| finance:product-cost:update | 更新商品成本 |
| finance:product-cost:delete | 删除商品成本 |
| finance:product-cost:export | 导出商品成本 |
| finance:product-cost:import | 导入商品成本 |
| finance:order:query | 查询订单 |
| finance:order:create | 创建订单 |
| finance:order:update | 更新订单 |
| finance:order:delete | 删除订单 |
| finance:order:export | 导出订单 |
| finance:order:import | 导入订单 |
| finance:doudian:query | 查询抖店数据 |
| finance:doudian:sync | 同步抖店数据 |
| finance:doudian:config | 配置抖店API |
