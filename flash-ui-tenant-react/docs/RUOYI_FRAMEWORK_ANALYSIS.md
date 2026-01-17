# RuoYi-Vue-Pro 框架分析文档

## 📋 框架概述

RuoYi-Vue-Pro 是一个基于 Spring Boot + Vue3 的企业级开源框架，采用前后端分离架构，支持多租户、权限管理、数据权限等功能。

---

## 🏗️ 框架架构

### 整体架构
```
┌─────────────────────────────────────────────────────┐
│                   前端层 (flash-ui)                   │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │ Vue3 管理端  │ Vue2 管理端  │ UniApp 移动端   │ │
│  └──────────────┴──────────────┴──────────────────┘ │
└─────────────────────────────────────────────────────┘
                         ↓ HTTP/REST API
┌─────────────────────────────────────────────────────┐
│                   后端层 (Java)                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  flash-module-* (业务模块)                    │  │
│  │  ├─ system (系统管理)                         │  │
│  │  ├─ infra (基础设施)                          │  │
│  │  ├─ erp (ERP系统)                            │  │
│  │  ├─ crm (CRM系统)                            │  │
│  │  ├─ mall (商城系统)                          │  │
│  │  ├─ pay (支付系统)                           │  │
│  │  ├─ mp (微信公众号)                          │  │
│  │  ├─ bpm (流程管理)                           │  │
│  │  ├─ report (报表)                            │  │
│  │  ├─ ai (AI功能)                              │  │
│  │  ├─ iot (物联网)                             │  │
│  │  ├─ member (会员管理)                        │  │
│  │  └─ finance (财务管理) ← 新增模块             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   数据库层                           │
│  MySQL / TiDB / PostgreSQL                          │
└─────────────────────────────────────────────────────┘
```

---

## 📦 核心模块详解

### 1. **flash-module-system** (系统管理模块)
**功能：** 提供系统基础功能支撑
- **用户管理** - 用户创建、编辑、删除、角色分配
- **部门管理** - 组织结构管理
- **角色管理** - 角色创建、权限分配
- **菜单管理** - 系统菜单、权限配置
- **权限管理** - 细粒度权限控制
- **字典管理** - 数据字典维护
- **参数管理** - 系统参数配置
- **通知公告** - 系统通知发布
- **操作日志** - 操作审计日志
- **登录日志** - 用户登录记录

**依赖关系：** 基础模块，被所有业务模块依赖

---

### 2. **flash-module-infra** (基础设施模块)
**功能：** 提供通用的技术支撑
- **文件管理** - 文件上传、下载、存储
- **代码生成** - 自动生成代码
- **API文档** - Swagger/OpenAPI 文档
- **定时任务** - 任务调度、执行
- **数据库监控** - 数据库性能监控
- **缓存管理** - Redis 缓存管理
- **配置管理** - 动态配置
- **日志管理** - 系统日志记录

**依赖关系：** 基础模块，被所有业务模块依赖

---

### 3. **flash-module-erp** (ERP系统模块)
**功能：** 企业资源规划系统
- **产品管理**
  - 商品分类、商品信息、计量单位
- **采购管理**
  - 供应商管理、采购订单、采购入库、采购退货
- **销售管理**
  - 客户管理、销售订单、销售出库、销售退货
- **库存管理**
  - 仓库管理、库存查询、库存盘点、库存移动、库存出入记录
- **财务管理**
  - 收款单、付款单、账户管理
- **统计分析**
  - 采购统计、销售统计

**依赖关系：** 依赖 system、infra

---

### 4. **flash-module-crm** (CRM系统模块)
**功能：** 客户关系管理系统
- 客户管理、联系人管理、商机管理、合同管理、订单管理
- 销售漏斗、销售预测、客户分析

**依赖关系：** 依赖 system、infra

---

### 5. **flash-module-mall** (商城系统模块)
**功能：** 电商商城系统
- 商品管理、分类管理、品牌管理
- 订单管理、购物车、收藏
- 优惠券、营销活动
- 评价管理

**依赖关系：** 依赖 system、infra、pay

---

### 6. **flash-module-pay** (支付系统模块)
**功能：** 支付业务模块
- 商户管理、应用管理
- 支付接口、退款管理
- 支付渠道配置（支付宝、微信等）
- 交易记录、对账

**依赖关系：** 依赖 system、infra

---

### 7. **flash-module-mp** (微信公众号模块)
**功能：** 微信生态集成
- 公众号账号管理
- 菜单管理、粉丝管理、标签管理
- 消息管理、自动回复
- 素材管理、模板通知
- 运营数据统计

**依赖关系：** 依赖 system、infra

---

### 8. **flash-module-bpm** (流程管理模块)
**功能：** 业务流程管理
- 流程定义、流程部署
- 流程实例、任务管理
- 流程审批、流程监控
- 流程统计

**依赖关系：** 依赖 system、infra

---

### 9. **flash-module-report** (报表模块)
**功能：** 数据可视化报表
- 基于「积木报表」实现
- 打印设计、报表设计、图形设计、大屏设计
- 数据源配置、动态报表

**依赖关系：** 依赖 system、infra

---

### 10. **flash-module-ai** (AI功能模块)
**功能：** 人工智能功能集成
- 大模型集成（ChatGPT、Claude等）
- 文本生成、图像生成
- 数据分析、智能推荐

**依赖关系：** 依赖 system、infra

---

### 11. **flash-module-iot** (物联网模块)
**功能：** 物联网设备管理
- 设备管理、设备分组
- 设备通信、数据采集
- 告警管理、规则引擎

**依赖关系：** 依赖 system、infra

---

### 12. **flash-module-member** (会员管理模块)
**功能：** 会员体系管理
- 会员注册、会员等级
- 积分管理、优惠券
- 会员标签、会员分析

**依赖关系：** 依赖 system、infra

---

### 13. **flash-module-finance** (财务管理模块) ⭐ 新增
**功能：** 闪电帐PRO 财务系统
- 订单管理、资金流水、商品成本
- 抖店配置、数据同步
- 对账管理、财务分析

**依赖关系：** 依赖 system、infra

---

## 🎯 模块依赖关系

```
┌─────────────────────────────────────────────────────┐
│  system (系统管理)  ←  所有模块都依赖               │
│  infra (基础设施)   ←  所有模块都依赖               │
└─────────────────────────────────────────────────────┘
           ↑
    ┌──────┴──────┬──────────┬──────────┬──────────┐
    │             │          │          │          │
   erp          crm        mall       pay         mp
    │             │          │          │          │
    └──────┬──────┴──────────┴──────────┴──────────┘
           │
      bpm  report  ai  iot  member  finance
```

---

## 📁 项目结构

### 后端项目结构
```
flash-module-finance/
├── src/main/java/cn/iocoder/flash/module/finance/
│   ├── controller/
│   │   └── admin/
│   │       ├── order/              # 订单管理
│   │       ├── cashflow/           # 资金流水
│   │       └── productcost/        # 商品成本
│   ├── service/                    # 业务逻辑层
│   ├── dal/                        # 数据访问层
│   │   ├── dataobject/             # Entity 类
│   │   └── mysql/                  # Mapper 接口
│   ├── enums/                      # 枚举类
│   ├── convert/                    # 数据转换
│   └── framework/                  # 框架配置
├── src/main/resources/
│   ├── mapper/                     # MyBatis XML
│   └── application-finance.yml     # 配置文件
└── pom.xml
```

### 前端项目结构 (Vue3)
```
flash-ui-admin-vue3/
├── src/
│   ├── api/                        # API 调用层
│   │   └── finance/                # 财务模块 API
│   ├── views/                      # 页面组件
│   │   └── finance/                # 财务模块页面
│   ├── components/                 # 通用组件
│   ├── router/                     # 路由配置
│   ├── store/                      # 状态管理
│   └── utils/                      # 工具函数
├── package.json
└── vite.config.js
```

---

## 🔧 标准开发流程

### 1. 后端开发流程

```
1. 创建 Entity (DO)
   └─ src/main/java/cn/iocoder/flash/module/finance/dal/dataobject/

2. 创建 Mapper 接口
   └─ src/main/java/cn/iocoder/flash/module/finance/dal/mysql/

3. 创建 Service 接口和实现
   └─ src/main/java/cn/iocoder/flash/module/finance/service/

4. 创建 VO 类 (Request/Response)
   └─ src/main/java/cn/iocoder/flash/module/finance/controller/admin/*/vo/

5. 创建 Controller
   └─ src/main/java/cn/iocoder/flash/module/finance/controller/admin/

6. 编写 SQL 脚本
   └─ sql/mysql/

7. 测试 API
```

### 2. 前端开发流程

```
1. 创建 API 模块
   └─ src/api/finance/

2. 创建页面组件
   └─ src/views/finance/

3. 配置路由
   └─ src/router/

4. 编写业务逻辑

5. 测试页面
```

---

## 🔐 核心特性

### 1. 多租户支持
- 通过 `@TenantId` 注解自动隔离数据
- 租户信息从 JWT Token 中获取
- 所有查询自动添加租户过滤条件

### 2. 权限管理
- 基于角色的访问控制 (RBAC)
- 细粒度权限控制 (菜单、按钮、数据)
- `@PreAuthorize` 注解进行权限验证

### 3. 数据权限
- 按部门、用户等维度进行数据隔离
- 支持自定义数据权限规则
- 通过 `@DataPermission` 注解实现

### 4. 审计日志
- 自动记录操作日志
- 支持操作审计、登录审计
- 便于追溯和合规

### 5. 缓存管理
- 基于 Redis 的缓存
- 支持缓存预热、缓存更新
- 提高系统性能

---

## 📝 命名规范

### Java 类命名
- **Entity (DO)** - `OrderDO`, `CashflowDO`
- **VO (Request)** - `OrderCreateReqVO`, `OrderUpdateReqVO`, `OrderPageReqVO`
- **VO (Response)** - `OrderRespVO`
- **Service 接口** - `OrderService`
- **Service 实现** - `OrderServiceImpl`
- **Mapper 接口** - `OrderMapper`
- **Controller** - `OrderController`
- **Enum** - `OrderStatusEnum`
- **Convert** - `OrderConvert`

### 数据库表命名
- 表名使用蛇形命名法：`finance_orders`, `finance_cashflow`
- 字段名使用蛇形命名法：`order_no`, `pay_amount`
- 主键：`id`
- 租户字段：`tenant_id`
- 时间字段：`create_time`, `update_time`
- 逻辑删除：`del_flag` (0=未删除, 1=已删除)

### API 路由命名
- 基础路由：`/finance/order`
- 分页查询：`GET /finance/order/page`
- 单个查询：`GET /finance/order/{id}`
- 创建：`POST /finance/order`
- 更新：`PUT /finance/order`
- 删除：`DELETE /finance/order?id={id}`
- 自定义操作：`PUT /finance/order/{id}/confirm`

---

## 🚀 快速开始

### 1. 添加财务模块到 pom.xml
```xml
<module>flash-module-finance</module>
```

### 2. 创建数据库表
```bash
执行 sql/mysql/finance_schema.sql
```

### 3. 启动后端服务
```bash
mvn clean install
mvn spring-boot:run
```

### 4. 启动前端服务
```bash
cd flash-ui-admin-vue3
npm install
npm run dev
```

### 5. 访问系统
```
http://localhost:5173
```

---

## 📚 相关资源

- **官方文档** - https://doc.iocoder.cn/
- **GitHub** - https://github.com/flashcode/flash-vue-pro
- **Gitee** - https://gitee.com/flashcode/flash-vue-pro
- **社区论坛** - https://bbs.iocoder.cn/

---

## 🎓 学习路径

1. **了解框架架构** - 理解模块划分和依赖关系
2. **学习系统模块** - 掌握权限、用户、角色等基础功能
3. **学习 ERP 模块** - 理解复杂业务模块的实现方式
4. **开发财务模块** - 基于框架规范开发新功能
5. **前端开发** - 学习 Vue3 + Element Plus 的使用

---

## 📌 重要提示

1. **遵循框架规范** - 严格按照框架的代码结构和命名规范开发
2. **多租户隔离** - 所有数据操作必须考虑租户隔离
3. **权限验证** - 所有 API 都需要进行权限验证
4. **代码注释** - 关键业务逻辑需要添加详细注释
5. **单元测试** - 重要业务逻辑需要编写单元测试
6. **API 文档** - 使用 Swagger 注解生成 API 文档

---

**最后更新时间：** 2024-01-16
**框架版本：** RuoYi-Vue-Pro (Latest)
