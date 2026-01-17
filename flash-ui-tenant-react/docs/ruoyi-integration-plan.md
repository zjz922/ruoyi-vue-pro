# 闪电账PRO与RuoYi-Vue-Pro整合方案

## 一、整合架构设计

### 1.1 系统架构概述

整合后的系统采用前后端分离架构，分为三个主要部分：

| 组件 | 技术栈 | 说明 |
|------|--------|------|
| **管理后台（Admin）** | RuoYi-Vue-Pro (Vue3 + Element Plus) | 平台管理员使用，负责租户管理、系统配置、权限控制 |
| **租户端（Tenant）** | React + Tailwind CSS | 商家使用，当前闪电账PRO的前端界面 |
| **后端服务（Server）** | Spring Boot + MyBatis Plus | 统一API服务层，替代当前的Node.js tRPC服务 |

### 1.2 模块划分

按照RuoYi-Vue-Pro的模块化架构，新增 `flash-module-finance` 财务模块：

```
flash-module-finance/
├── controller/
│   ├── admin/           # 管理后台API（/admin-api/finance/）
│   │   ├── ProductCostController.java
│   │   ├── OrderController.java
│   │   └── DoudianController.java
│   └── app/             # 租户端API（/app-api/finance/）
│       ├── AppProductCostController.java
│       ├── AppOrderController.java
│       └── AppDoudianController.java
├── service/
│   ├── ProductCostService.java
│   ├── OrderService.java
│   └── DoudianService.java
├── dal/
│   ├── dataobject/      # DO实体类
│   ├── mysql/           # Mapper接口
│   └── redis/           # Redis缓存
└── convert/             # VO转换器
```

## 二、数据库表设计

### 2.1 租户端数据库表命名规范

按照RuoYi-Vue-Pro的多租户规范，所有租户端业务表需要：

1. **表名前缀**：使用 `finance_` 前缀区分财务模块
2. **租户字段**：添加 `tenant_id` 字段实现数据隔离
3. **通用字段**：包含 `creator`、`create_time`、`updater`、`update_time`、`deleted` 字段

### 2.2 数据库表清单

| 表名 | 说明 | 是否租户隔离 |
|------|------|-------------|
| `finance_product_cost` | 商品成本表 | ✓ |
| `finance_product_cost_history` | 商品成本历史表 | ✓ |
| `finance_order` | 订单表 | ✓ |
| `finance_order_fee` | 订单费用明细表（新增） | ✓ |
| `finance_doudian_config` | 抖店API配置表 | ✓ |
| `finance_sync_log` | 数据同步日志表 | ✓ |

### 2.3 字段映射关系

#### 商品成本表 (product_costs → finance_product_cost)

| 原字段 | 新字段 | 类型 | 说明 |
|--------|--------|------|------|
| id | id | bigint | 主键 |
| - | tenant_id | bigint | 租户ID（新增） |
| productId | product_id | varchar(64) | 商品号 |
| sku | sku | varchar(64) | SKU编码 |
| title | title | varchar(512) | 商品标题 |
| cost | cost | decimal(10,2) | 成本价 |
| merchantCode | merchant_code | varchar(64) | 商家编码 |
| price | price | decimal(10,2) | 售价 |
| customName | custom_name | varchar(255) | 自定义名称 |
| stock | stock | int | 库存数量 |
| status | status | tinyint | 状态 |
| effectiveDate | effective_date | datetime | 生效时间 |
| shopName | shop_name | varchar(128) | 店铺名称 |
| createdAt | create_time | datetime | 创建时间 |
| updatedAt | update_time | datetime | 更新时间 |
| - | creator | varchar(64) | 创建者（新增） |
| - | updater | varchar(64) | 更新者（新增） |
| - | deleted | bit | 删除标记（新增） |

#### 订单表 (orders → finance_order)

| 原字段 | 新字段 | 类型 | 说明 |
|--------|--------|------|------|
| id | id | bigint | 主键 |
| - | tenant_id | bigint | 租户ID（新增） |
| mainOrderNo | main_order_no | varchar(32) | 主订单编号 |
| subOrderNo | sub_order_no | varchar(32) | 子订单编号 |
| productName | product_name | varchar(512) | 商品名称 |
| productSpec | product_spec | varchar(255) | 商品规格 |
| quantity | quantity | int | 商品数量 |
| sku | sku | varchar(64) | 商家编码 |
| unitPrice | unit_price | decimal(10,2) | 商品单价 |
| payAmount | pay_amount | decimal(10,2) | 订单应付金额 |
| freight | freight | decimal(10,2) | 运费 |
| totalDiscount | total_discount | decimal(10,2) | 优惠总金额 |
| platformDiscount | platform_discount | decimal(10,2) | 平台优惠 |
| merchantDiscount | merchant_discount | decimal(10,2) | 商家优惠 |
| influencerDiscount | influencer_discount | decimal(10,2) | 达人优惠 |
| serviceFee | service_fee | decimal(10,2) | 服务费 |
| payMethod | pay_method | varchar(32) | 支付方式 |
| receiver | receiver | varchar(64) | 收件人 |
| receiverPhone | receiver_phone | varchar(32) | 收件人手机号 |
| province | province | varchar(32) | 省 |
| city | city | varchar(32) | 市 |
| district | district | varchar(32) | 区 |
| address | address | varchar(512) | 详细地址 |
| orderTime | order_time | datetime | 订单提交时间 |
| payTime | pay_time | datetime | 支付完成时间 |
| shipTime | ship_time | datetime | 发货时间 |
| completeTime | complete_time | datetime | 订单完成时间 |
| status | status | varchar(32) | 订单状态 |
| afterSaleStatus | after_sale_status | varchar(32) | 售后状态 |
| cancelReason | cancel_reason | varchar(512) | 取消原因 |
| appChannel | app_channel | varchar(32) | APP渠道 |
| trafficSource | traffic_source | varchar(64) | 流量来源 |
| orderType | order_type | varchar(32) | 订单类型 |
| influencerId | influencer_id | varchar(64) | 达人ID |
| influencerName | influencer_name | varchar(128) | 达人昵称 |
| flagColor | flag_color | varchar(16) | 旗帜颜色 |
| merchantRemark | merchant_remark | varchar(512) | 商家备注 |
| buyerMessage | buyer_message | varchar(512) | 买家留言 |
| shopName | shop_name | varchar(128) | 店铺名称 |
| deleted | deleted | bit | 删除状态 |
| createdAt | create_time | datetime | 创建时间 |
| updatedAt | update_time | datetime | 更新时间 |
| - | creator | varchar(64) | 创建者（新增） |
| - | updater | varchar(64) | 更新者（新增） |

## 三、API接口映射

### 3.1 商品成本API

| 原tRPC接口 | 新RESTful接口 | 方法 | 说明 |
|-----------|--------------|------|------|
| productCost.list | /app-api/finance/product-cost/page | GET | 分页查询商品成本 |
| productCost.getById | /app-api/finance/product-cost/get | GET | 获取商品成本详情 |
| productCost.create | /app-api/finance/product-cost/create | POST | 新增商品成本 |
| productCost.update | /app-api/finance/product-cost/update | PUT | 更新商品成本 |
| productCost.delete | /app-api/finance/product-cost/delete | DELETE | 删除商品成本 |
| productCost.batchImport | /app-api/finance/product-cost/import | POST | 批量导入商品成本 |
| productCost.getHistory | /app-api/finance/product-cost/history | GET | 获取成本变更历史 |
| productCost.getShopNames | /app-api/finance/product-cost/shop-names | GET | 获取店铺列表 |

### 3.2 订单管理API

| 原tRPC接口 | 新RESTful接口 | 方法 | 说明 |
|-----------|--------------|------|------|
| order.list | /app-api/finance/order/page | GET | 分页查询订单 |
| order.getById | /app-api/finance/order/get | GET | 获取订单详情 |
| order.stats | /app-api/finance/order/stats | GET | 获取订单统计 |
| order.create | /app-api/finance/order/create | POST | 新增订单 |
| order.update | /app-api/finance/order/update | PUT | 更新订单 |
| order.delete | /app-api/finance/order/delete | DELETE | 删除订单 |
| order.batchImport | /app-api/finance/order/import | POST | 批量导入订单 |

### 3.3 抖店API

| 原tRPC接口 | 新RESTful接口 | 方法 | 说明 |
|-----------|--------------|------|------|
| doudian.checkConfig | /app-api/finance/doudian/config/check | GET | 检查API配置 |
| doudian.syncOrders | /app-api/finance/doudian/order/sync | POST | 同步订单 |
| doudian.getOrderDetail | /app-api/finance/doudian/order/detail | GET | 获取订单详情 |
| doudian.syncProducts | /app-api/finance/doudian/product/sync | POST | 同步商品 |
| doudian.getProductDetail | /app-api/finance/doudian/product/detail | GET | 获取商品详情 |
| doudian.getSettleBill | /app-api/finance/doudian/settle/bill | GET | 获取结算账单 |
| doudian.getAccountFlow | /app-api/finance/doudian/account/flow | GET | 获取资金流水 |
| doudian.getCommission | /app-api/finance/doudian/commission/list | GET | 获取达人佣金 |
| doudian.getInsurance | /app-api/finance/doudian/insurance/detail | GET | 获取保险详情 |
| doudian.getAfterSaleList | /app-api/finance/doudian/aftersale/list | GET | 获取售后列表 |
| doudian.getAfterSaleDetail | /app-api/finance/doudian/aftersale/detail | GET | 获取售后详情 |

## 四、前端对接方案

### 4.1 API调用方式变更

原tRPC调用方式：
```typescript
const result = await trpc.productCost.list.query({ page: 1, pageSize: 20 });
```

新RESTful调用方式：
```typescript
const result = await axios.get('/app-api/finance/product-cost/page', {
  params: { pageNo: 1, pageSize: 20 }
});
```

### 4.2 响应格式统一

RuoYi-Vue-Pro统一响应格式：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [...],
    "total": 100
  }
}
```

### 4.3 认证方式变更

| 项目 | 原方式 | 新方式 |
|------|--------|--------|
| 认证方式 | Cookie Session | JWT Token |
| Token存储 | HttpOnly Cookie | LocalStorage |
| Token传递 | 自动携带Cookie | Authorization Header |

## 五、实施步骤

### 第一阶段：数据库迁移
1. 创建finance模块数据库表
2. 编写数据迁移脚本
3. 验证数据完整性

### 第二阶段：后端服务开发
1. 创建flash-module-finance模块
2. 实现DO实体类和Mapper
3. 实现Service业务逻辑
4. 实现Controller接口

### 第三阶段：前端适配
1. 封装新的API调用层
2. 修改认证逻辑
3. 适配响应格式

### 第四阶段：测试与上线
1. 接口联调测试
2. 数据一致性验证
3. 性能压测
4. 灰度发布

## 六、文件清单

整合完成后将提供以下文件：

| 文件 | 说明 |
|------|------|
| `sql/finance_schema.sql` | 数据库表结构SQL |
| `sql/finance_data_migration.sql` | 数据迁移SQL |
| `java/entity/*.java` | Java实体类 |
| `java/mapper/*.java` | MyBatis Mapper接口 |
| `java/mapper/*.xml` | MyBatis XML映射文件 |
| `java/service/*.java` | Service接口和实现 |
| `java/controller/*.java` | Controller控制器 |
| `java/vo/*.java` | VO请求/响应对象 |
| `docs/api-mapping.md` | API接口映射文档 |
