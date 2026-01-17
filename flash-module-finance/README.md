# flash-module-finance 财务管理模块

## 📋 模块概述

`flash-module-finance` 是闪电帐PRO财务管理系统的核心模块，基于RuoYi-Vue-Pro框架开发，提供完整的财务数据管理、同步、对账等功能。

该模块集成了抖店、千川、聚水潭等第三方平台的API，实现了订单管理、资金流水、商品成本等财务核心功能。

---

## 🎯 核心功能

### 1. 订单管理 (Order Management)
- **订单创建** - 支持手动创建和自动同步
- **订单查询** - 按店铺、订单号、状态等多维度查询
- **订单更新** - 支持订单状态、收货信息等更新
- **订单删除** - 逻辑删除，保留审计信息
- **订单统计** - 订单数量、金额等统计分析

**相关表：** `finance_orders`
**相关API：** `/finance/order`

---

### 2. 资金流水 (Cashflow Management)
- **流水记录** - 记录所有资金进出
- **流水查询** - 按交易类型、时间范围等查询
- **流水确认** - 确认流水状态
- **对账管理** - 与第三方平台对账
- **流水统计** - 收支统计、趋势分析

**相关表：** `finance_cashflow`
**相关API：** `/finance/cashflow`

---

### 3. 商品成本 (Product Cost Management)
- **成本管理** - 维护商品成本信息
- **成本查询** - 按商品、SKU查询成本
- **成本更新** - 支持多种成本计算方法
- **库存管理** - 库存数量跟踪
- **成本分析** - 成本趋势、毛利分析

**相关表：** `finance_product_cost`
**相关API：** `/finance/product-cost`

---

### 4. 抖店配置 (Doudian Configuration)
- **账号配置** - 管理抖店App Key/Secret
- **授权管理** - OAuth授权、Token管理
- **配置查询** - 查看配置信息
- **配置更新** - 更新授权信息
- **多店铺支持** - 支持多个抖店账号

**相关表：** `finance_doudian_config`
**相关API：** `/finance/doudian-config`

---

### 5. 数据同步 (Data Synchronization)
- **订单同步** - 从抖店同步订单数据
- **流水同步** - 从抖店同步资金流水
- **成本同步** - 从聚水潭同步商品成本
- **同步日志** - 记录所有同步操作
- **同步监控** - 实时监控同步状态

**相关表：** `finance_sync_log`
**相关API：** `/finance/sync-log`

---

## 📁 项目结构

```
flash-module-finance/
├── src/main/java/cn/iocoder/flash/module/finance/
│   ├── controller/
│   │   └── admin/
│   │       ├── order/                    # 订单管理
│   │       │   └── vo/
│   │       ├── cashflow/                 # 资金流水
│   │       │   └── vo/
│   │       ├── productcost/              # 商品成本
│   │       │   └── vo/
│   │       ├── doudianconfig/            # 抖店配置
│   │       │   └── vo/
│   │       └── synclog/                  # 同步日志
│   │           └── vo/
│   ├── service/
│   │   ├── OrderService.java
│   │   ├── OrderServiceImpl.java
│   │   ├── CashflowService.java
│   │   ├── CashflowServiceImpl.java
│   │   ├── ProductCostService.java
│   │   ├── ProductCostServiceImpl.java
│   │   ├── DoudianConfigService.java
│   │   ├── DoudianConfigServiceImpl.java
│   │   ├── SyncLogService.java
│   │   └── SyncLogServiceImpl.java
│   ├── dal/
│   │   ├── dataobject/
│   │   │   ├── OrderDO.java
│   │   │   ├── CashflowDO.java
│   │   │   ├── ProductCostDO.java
│   │   │   ├── DoudianConfigDO.java
│   │   │   └── SyncLogDO.java
│   │   └── mysql/
│   │       ├── OrderMapper.java
│   │       ├── CashflowMapper.java
│   │       ├── ProductCostMapper.java
│   │       ├── DoudianConfigMapper.java
│   │       └── SyncLogMapper.java
│   ├── enums/
│   │   ├── OrderStatusEnum.java
│   │   ├── SyncStatusEnum.java
│   │   ├── TradeTypeEnum.java
│   │   └── AuthStatusEnum.java
│   ├── convert/
│   │   └── OrderConvert.java
│   └── framework/
│       └── config/
├── src/main/resources/
│   ├── mapper/finance/                   # MyBatis XML映射
│   ├── application-finance.yml           # 配置文件
│   └── sql/
│       └── finance_schema.sql            # 数据库脚本
├── pom.xml
└── README.md
```

---

## 🔧 开发规范

### 命名规范

#### Java类命名
- **Entity (DO)** - `OrderDO`, `CashflowDO`
- **VO (Request)** - `OrderCreateReqVO`, `OrderUpdateReqVO`, `OrderPageReqVO`
- **VO (Response)** - `OrderRespVO`
- **Service接口** - `OrderService`
- **Service实现** - `OrderServiceImpl`
- **Mapper接口** - `OrderMapper`
- **Controller** - `OrderController`
- **Enum** - `OrderStatusEnum`
- **Convert** - `OrderConvert`

#### 数据库表命名
- 表名使用蛇形命名法：`finance_orders`, `finance_cashflow`
- 字段名使用蛇形命名法：`order_no`, `pay_amount`
- 主键：`id`
- 租户字段：`tenant_id`
- 时间字段：`create_time`, `update_time`
- 逻辑删除：`del_flag` (0=未删除, 1=已删除)

#### API路由命名
- 基础路由：`/finance/order`
- 分页查询：`GET /finance/order/page`
- 单个查询：`GET /finance/order/{id}`
- 创建：`POST /finance/order`
- 更新：`PUT /finance/order`
- 删除：`DELETE /finance/order?id={id}`
- 自定义操作：`PUT /finance/order/{id}/confirm`

### 代码规范

1. **遵循阿里代码规范** - 严格按照《阿里巴巴Java开发手册》规范编写代码
2. **注释规范** - 关键业务逻辑需要添加详细注释
3. **异常处理** - 使用自定义异常，提供清晰的错误信息
4. **日志记录** - 使用SLF4J记录重要操作
5. **单元测试** - 重要业务逻辑需要编写单元测试

---

## 📚 API文档

### 订单管理API

#### 创建订单
```
POST /finance/order
Content-Type: application/json

{
  "shopId": 1,
  "orderNo": "DD20240116001",
  "productTitle": "商品名称",
  "quantity": 1,
  "unitPrice": 99.99,
  "payAmount": 99.99,
  "status": "pending_payment",
  "platform": "doudian"
}
```

#### 获取订单分页
```
GET /finance/order/page?pageNo=1&pageSize=10&shopId=1&status=paid
```

#### 更新订单
```
PUT /finance/order
Content-Type: application/json

{
  "id": 1,
  "status": "shipped",
  "receiverName": "张三"
}
```

### 资金流水API

#### 创建流水
```
POST /finance/cashflow
Content-Type: application/json

{
  "shopId": 1,
  "flowNo": "CF20240116001",
  "tradeType": "income",
  "amount": 1000.00,
  "channel": "alipay",
  "tradeTime": "2024-01-16T10:00:00"
}
```

#### 获取流水分页
```
GET /finance/cashflow/page?pageNo=1&pageSize=10&shopId=1&tradeType=income
```

#### 确认流水
```
PUT /finance/cashflow/{id}/confirm
```

### 商品成本API

#### 创建成本
```
POST /finance/product-cost
Content-Type: application/json

{
  "shopId": 1,
  "productId": "PROD001",
  "productName": "商品名称",
  "cost": 50.00,
  "salePrice": 99.99,
  "stock": 100
}
```

#### 获取成本分页
```
GET /finance/product-cost/page?pageNo=1&pageSize=10&shopId=1
```

---

## 🚀 快速开始

### 1. 数据库初始化

执行SQL脚本创建表：
```bash
mysql -u root -p < sql/mysql/finance_schema.sql
```

### 2. 启动应用

```bash
mvn clean install
mvn spring-boot:run
```

### 3. 访问API

```
http://localhost:8080/doc.html
```

---

## 🔐 权限管理

模块使用基于角色的权限控制（RBAC），所有API都需要进行权限验证。

### 权限列表

| 权限代码 | 权限名称 | 说明 |
|---------|--------|------|
| `finance:order:query` | 订单查询 | 查看订单信息 |
| `finance:order:create` | 订单创建 | 创建新订单 |
| `finance:order:update` | 订单更新 | 修改订单信息 |
| `finance:order:delete` | 订单删除 | 删除订单 |
| `finance:cashflow:query` | 流水查询 | 查看资金流水 |
| `finance:cashflow:create` | 流水创建 | 创建流水记录 |
| `finance:cashflow:confirm` | 流水确认 | 确认流水 |
| `finance:productCost:query` | 成本查询 | 查看商品成本 |
| `finance:productCost:create` | 成本创建 | 创建成本信息 |
| `finance:doudianConfig:query` | 配置查询 | 查看抖店配置 |
| `finance:syncLog:query` | 日志查询 | 查看同步日志 |

---

## 📝 常见问题

### Q1: 如何集成新的第三方平台？

A: 按照以下步骤集成：
1. 创建新的Service接口和实现类
2. 创建相应的Entity和Mapper
3. 创建API Controller
4. 添加配置和权限

### Q2: 如何自定义成本计算方法？

A: 在 `ProductCostService` 中实现自定义的成本计算逻辑，支持以下方法：
- `weighted_average` - 加权平均法
- `latest` - 最新成本法
- `fifo` - 先进先出法

### Q3: 如何处理数据同步失败？

A: 系统会自动记录同步日志，包括错误信息。可以通过以下方式处理：
1. 查看同步日志了解失败原因
2. 修复问题后重新同步
3. 手动调整数据

---

## 🔗 相关资源

- [RuoYi-Vue-Pro官方文档](https://doc.iocoder.cn/)
- [闪电帐PRO项目文档](../docs/)
- [API规范文档](../docs/JAVA_API_SPECIFICATION.md)

---

## 📞 技术支持

如有问题，请联系技术团队或提交Issue。

---

**最后更新时间：** 2024-01-16
**模块版本：** 1.0.0
**作者：** 闪电账PRO开发团队
