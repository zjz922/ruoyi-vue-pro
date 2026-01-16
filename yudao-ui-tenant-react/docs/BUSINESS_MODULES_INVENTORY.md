# 闪电帐PRO 业务模块完整清单

本文档记录了闪电帐PRO系统的所有业务代码模块，包括租户端、Java后端和管理员端的功能划分。

---

## 一、租户端业务模块（React前端）

### 1. 经营概览模块
**文件位置**：`client/src/pages/Dashboard.tsx`
**功能描述**：
- 实时订单统计（今日、本周、本月）
- 销售额趋势图表
- 店铺概览卡片
- 关键指标展示

**关联API路由**：`server/dashboardRouter.ts`
**关联Hook**：`client/src/hooks/useDashboard.ts`

---

### 2. 订单管理模块
**文件位置**：`client/src/pages/OrderManagement.tsx`
**功能描述**：
- 订单列表展示（支持店铺过滤）
- 订单详情查看
- 订单状态筛选
- 订单导出

**子页面**：
- `OrderDetail.tsx` - 订单详情页面
- `OrderReconciliation.tsx` - 订单对账页面
- `OrderStatistics.tsx` - 订单统计页面
- `OrderThirtyDays.tsx` - 最近30天统计
- `OrderMonthlyStats.tsx` - 按月汇总
- `OrderYearlyStats.tsx` - 按年汇总

**关联API路由**：`server/orderRouter.ts`
**关联Hook**：无（直接调用API）
**关联Java后端**：
- `OrderController.java` - 订单控制器
- `OrderService.java` - 订单业务逻辑
- `OrderDAO.java` - 订单数据访问
- `OrderEntity.java` - 订单实体
- `OrderDTO.java` - 订单数据传输对象
- `OrderStatsVO.java` - 订单统计视图对象

---

### 3. 总账管理模块（7个子模块）
**文件位置**：`client/src/pages/` 下的相关页面
**功能描述**：财务核算和管理的核心模块

#### 3.1 经营概览
**文件**：`BusinessSummary.tsx`
**功能**：经营数据总览、关键指标展示

#### 3.2 财务核算
**文件**：`Accounting.tsx`
**功能**：财务报表、成本核算、利润分析

#### 3.3 资金管理
**文件**：`Funds.tsx`
**功能**：资金流入流出、余额管理

#### 3.4 库存成本
**文件**：`Inventory.tsx`
**功能**：库存成本配置、成本更新管理
**关联API路由**：`server/costUpdateRouter.ts`、`server/productCostRouter.ts`
**关联Service**：`server/costUpdateService.ts`

#### 3.5 经营分析
**文件**：`Analysis.tsx`
**功能**：销售分析、趋势分析、对比分析

#### 3.6 费用中心
**文件**：`Expense.tsx`
**功能**：费用统计、费用分类、费用预算

#### 3.7 税务管理
**文件**：`Tax.tsx`
**功能**：税务申报、税率配置、税务统计

**关联API路由**：`server/ledgerRouter.ts`
**关联Hook**：`client/src/hooks/useLedger.ts`

---

### 4. 出纳管理模块（8个子模块）
**文件位置**：`client/src/pages/cashier/` 目录
**功能描述**：资金管理和对账的核心模块

#### 4.1 出纳工作台
**文件**：`CashierDashboard.tsx`
**功能**：
- 待处理事项统计
- 资金流水概览
- 对账差异提示
- 快速操作按钮

#### 4.2 资金流水
**文件**：`CashierCashflow.tsx`
**功能**：
- 资金流水记录（新增、编辑、删除）
- 流水确认
- 流水导出
- 按渠道筛选

#### 4.3 渠道管理
**文件**：`CashierChannels.tsx`
**功能**：
- 资金渠道配置（新增、编辑、删除）
- 渠道启用/禁用
- 渠道同步
- 供应商关联

#### 4.4 平台对账
**文件**：`CashierReconciliation.tsx`
**功能**：
- 执行平台对账
- 对账结果展示
- 差异处理
- 对账报告导出

#### 4.5 差异分析
**文件**：`CashierDifferences.tsx`
**功能**：
- 对账差异列表
- 差异原因分析
- 差异处理（单条/批量）
- 差异报告导出

#### 4.6 资金日报
**文件**：`CashierDailyReport.tsx`
**功能**：
- 日报生成
- 日报查看（支持上/下一天导航）
- 日报导出（PDF/Excel）
- 日报打印

#### 4.7 资金月报
**文件**：`CashierMonthlyReport.tsx`
**功能**：
- 月报生成
- 月报查看（支持上/下一月导航）
- 快捷月份选择
- 月报导出（PDF/Excel）
- 月报打印

#### 4.8 店铺统计
**文件**：`CashierShopReport.tsx`
**功能**：
- 多店铺资金统计
- 周期选择（日/周/月/年）
- 店铺对比分析
- 统计报表导出

**关联API路由**：`server/cashierRouter.ts`
**关联Hook**：`client/src/hooks/useCashier.ts`
**关联Alert功能**：
- `CashierAlerts.tsx` - 预警通知展示
- `CashierAlertRules.tsx` - 预警规则配置

---

### 5. 数据同步模块
**文件位置**：`client/src/pages/` 下的相关页面
**功能描述**：第三方平台数据同步管理

#### 5.1 抖店数据同步
**文件**：`DoudianSync.tsx`
**功能**：
- 抖店订单同步
- 抖店商品同步
- 同步状态查看
- 同步日志查看

**关联API路由**：`server/orderSyncRouter.ts`
**关联Service**：`server/orderSync.ts`
**关联API客户端**：`server/doudianApi.ts`

#### 5.2 千川数据同步
**文件**：`QianchuanSync.tsx`
**功能**：
- 千川推广数据同步
- 推广费用同步
- 同步状态查看
- 同步日志查看

**关联API路由**：`server/qianchuanRouter.ts`
**关联Service**：`server/qianchuanSyncService.ts`
**关联API客户端**：`server/qianchuanApi.ts`

#### 5.3 聚水潭ERP同步
**文件**：`JstSync.tsx`
**功能**：
- 入库单同步
- 库存成本同步
- 同步状态查看
- 同步日志查看

**关联API路由**：`server/jstRouter.ts`
**关联Service**：`server/jstSyncService.ts`
**关联API客户端**：`server/jstApi.ts`

---

### 6. 授权管理模块
**文件位置**：`client/src/pages/DoudianAuthCallback.tsx`
**功能描述**：
- 抖店OAuth授权流程
- 授权回调处理
- Token存储管理

**关联API路由**：`server/doudianRouter.ts`
**关联Service**：`server/doudianAuthService.ts`
**关联Hook**：
- `client/src/hooks/useDoudianAuth.ts` - 授权状态管理
- `client/src/hooks/useShopSwitcher.ts` - 店铺切换

**关联组件**：
- `client/src/components/DoudianAuthPrompt.tsx` - 授权提示
- `client/src/components/ShopSwitcher.tsx` - 店铺切换下拉菜单

---

### 7. 单据中心模块
**文件位置**：`client/src/pages/DocumentCenter.tsx`
**功能描述**：
- 单据管理（订单、发货、收款等）
- 单据关联
- 单据导出

**子页面**：
- `DocumentLinking.tsx` - 单据关联管理

**关联API路由**：`server/documentRouter.ts`
**关联Java后端**：
- `DocumentEntity.java` - 单据实体

---

### 8. 数据对账模块
**文件位置**：`client/src/pages/ReconciliationDashboard.tsx`
**功能描述**：
- 多维度数据对账
- 对账差异展示
- 对账规则配置

**关联API路由**：`server/reconciliationRouter.ts`
**关联Service**：`server/reconciliation.ts`
**关联Java后端**：
- `ReconciliationController.java` - 对账控制器
- `ReconciliationService.java` - 对账业务逻辑
- `ReconciliationEntity.java` - 对账实体
- `ReconciliationDTO.java` - 对账数据传输对象

**关联组件**：
- `client/src/components/ReconciliationIndicator.tsx` - 对账状态指示器
- `client/src/components/ModuleReconciliationPanel.tsx` - 模块对账面板
- `client/src/components/ReconciliationStatus.tsx` - 对账状态显示

---

### 9. 成本配置模块
**文件位置**：`client/src/pages/CostConfig.tsx`
**功能描述**：
- 商品成本配置
- 成本更新历史
- 成本计算方法选择

**关联组件**：
- `client/src/components/CostInboundRelation.tsx` - 成本与入库关联

---

### 10. 财务指挥中心模块
**文件位置**：`client/src/pages/FinanceCommandCenter.tsx`
**功能描述**：
- 财务关键指标展示
- 实时数据监控
- 异常预警

---

### 11. 帮助中心模块
**文件位置**：`client/src/pages/HelpCenter.tsx`
**功能描述**：
- 帮助文档
- 常见问题
- 使用指南

---

### 12. 首页模块
**文件位置**：`client/src/pages/Home.tsx`
**功能描述**：
- 系统登录
- 系统首页
- 导航入口

---

## 二、后端API路由（Node.js中间层）

### 核心路由文件列表

| 路由文件 | 功能描述 | 关联业务模块 |
|---------|--------|-----------|
| `dashboardRouter.ts` | 经营概览数据API | 经营概览 |
| `orderRouter.ts` | 订单管理API | 订单管理 |
| `ledgerRouter.ts` | 总账管理API（7个子模块） | 总账管理 |
| `cashierRouter.ts` | 出纳管理API（8个子模块） | 出纳管理 |
| `cashflowRouter.ts` | 资金流水CRUD API | 出纳管理-资金流水 |
| `costUpdateRouter.ts` | 成本更新API | 总账管理-库存成本 |
| `productCostRouter.ts` | 商品成本API | 总账管理-库存成本 |
| `orderSyncRouter.ts` | 抖店数据同步API | 数据同步-抖店 |
| `qianchuanRouter.ts` | 千川数据同步API | 数据同步-千川 |
| `jstRouter.ts` | 聚水潭ERP同步API | 数据同步-聚水潭 |
| `doudianRouter.ts` | 抖店授权API | 授权管理 |
| `documentRouter.ts` | 单据中心API | 单据中心 |
| `reconciliationRouter.ts` | 数据对账API | 数据对账 |

### 核心Service文件列表

| Service文件 | 功能描述 |
|-----------|--------|
| `doudianAuthService.ts` | 抖店OAuth授权服务 |
| `doudianApi.ts` | 抖店API客户端 |
| `qianchuanApi.ts` | 千川API客户端 |
| `jstApi.ts` | 聚水潭ERP API客户端 |
| `orderSync.ts` | 订单同步服务 |
| `qianchuanSyncService.ts` | 千川数据同步服务 |
| `jstSyncService.ts` | 聚水潭ERP同步服务 |
| `costUpdateService.ts` | 成本更新服务 |
| `reconciliation.ts` | 数据对账服务 |
| `scheduler.ts` | 定时任务调度器 |

### 数据库相关文件

| 文件 | 功能描述 |
|-----|--------|
| `server/db.ts` | 数据库查询助手（Drizzle ORM） |
| `drizzle/schema.ts` | 数据库表定义 |
| `drizzle/relations.ts` | 表关系定义 |

---

## 三、Java后端业务模块

### 订单管理模块
**包路径**：`com.shandianzhang.controller` / `com.shandianzhang.service` / `com.shandianzhang.dao`

**核心类**：
- `OrderController.java` - 订单API控制器
- `OrderService.java` - 订单业务接口
- `OrderServiceImpl.java` - 订单业务实现
- `OrderDAO.java` - 订单数据访问对象

**数据模型**：
- `OrderEntity.java` - 订单数据库实体
- `OrderDTO.java` - 订单数据传输对象
- `OrderStatsVO.java` - 订单统计视图对象
- `PageResult.java` - 分页结果通用类

**主要功能**：
- 订单列表查询（支持店铺过滤）
- 订单详情查看
- 订单统计（按日期、按月、按年）
- 订单导出

---

### 数据对账模块
**包路径**：`com.shandianzhang.controller` / `com.shandianzhang.service`

**核心类**：
- `ReconciliationController.java` - 对账API控制器
- `ReconciliationService.java` - 对账业务接口
- `ReconciliationServiceImpl.java` - 对账业务实现

**数据模型**：
- `ReconciliationEntity.java` - 对账数据库实体
- `ReconciliationDTO.java` - 对账数据传输对象

**主要功能**：
- 执行平台对账
- 对账差异分析
- 对账结果查询

---

### 单据管理模块
**包路径**：`com.shandianzhang.model.entity`

**核心类**：
- `DocumentEntity.java` - 单据数据库实体

**主要功能**：
- 单据数据存储
- 单据关联管理

---

### 通用工具类
**包路径**：`com.shandianzhang.common`

**核心类**：
- `Result.java` - API统一返回结果类

---

## 四、管理员端模块规划（待实现）

根据租户端的功能，管理员端应包含以下模块：

### 1. 系统管理模块
- **租户管理** - 租户账户创建、启用/禁用、套餐管理
- **用户管理** - 租户用户账户管理、权限配置
- **角色权限** - 角色定义、权限分配、菜单配置
- **部门管理** - 组织结构管理
- **菜单管理** - 系统菜单配置

### 2. 数据监控模块
- **系统监控** - 系统运行状态、性能指标
- **API监控** - API调用统计、错误监控
- **数据同步监控** - 各平台数据同步状态
- **日志查询** - 系统操作日志、错误日志

### 3. 财务数据管理模块
- **订单数据管理** - 全平台订单数据查看、数据修正
- **对账数据管理** - 全平台对账差异查看、处理
- **成本数据管理** - 商品成本数据管理、历史记录
- **资金流水管理** - 全平台资金流水查看、审核

### 4. 第三方平台管理模块
- **抖店配置** - 抖店API配置、授权管理
- **千川配置** - 千川API配置、授权管理
- **聚水潭配置** - 聚水潭ERP配置、授权管理

### 5. 功能配置模块
- **对账规则配置** - 对账规则定义、差异处理规则
- **预警规则配置** - 预警条件设置、通知方式配置
- **成本计算方法** - 成本计算方法配置（加权平均、最新成本、先进先出）
- **报表模板配置** - 报表生成模板配置

### 6. 业务统计模块
- **租户业务统计** - 租户订单量、销售额、活跃度统计
- **平台数据统计** - 全平台订单、资金、成本统计
- **功能使用统计** - 功能使用频率、用户行为分析

### 7. 系统设置模块
- **基础配置** - 系统名称、logo、主题色等
- **邮件配置** - 邮件服务器配置
- **短信配置** - 短信服务配置
- **文件存储配置** - S3、本地存储配置

### 8. 审计管理模块
- **操作审计** - 用户操作记录、变更历史
- **数据审计** - 数据变更审计、追踪
- **安全审计** - 登录记录、异常操作检测

---

## 五、数据库表清单

### 租户端数据表
| 表名 | 描述 | 关联模块 |
|-----|-----|--------|
| `users` | 用户表 | 用户管理 |
| `doudian_auth_tokens` | 抖店授权Token表 | 授权管理 |
| `doudian_shops` | 抖店店铺表 | 授权管理 |
| `orders` | 订单表 | 订单管理 |
| `cashflow` | 资金流水表 | 出纳管理 |
| `product_costs` | 商品成本表 | 总账管理 |
| `cost_updates` | 成本更新历史表 | 总账管理 |
| `reconciliation_records` | 对账记录表 | 数据对账 |
| `sync_logs` | 数据同步日志表 | 数据同步 |

### Java后端数据表（待定）
| 表名 | 描述 | 关联模块 |
|-----|-----|--------|
| `orders` | 订单表 | 订单管理 |
| `reconciliation_records` | 对账记录表 | 数据对账 |
| `documents` | 单据表 | 单据管理 |

---

## 六、API接口规范文档

### 已完成的API规范文档
1. **JAVA_API_SPECIFICATION.md** - Java后端API总体规范
2. **LEDGER_MODULE_API_SPECIFICATION.md** - 总账管理模块API规范（42个接口）
3. **CASHIER_MODULE_API_SPECIFICATION.md** - 出纳管理模块API规范（55个接口）

### 待完成的API规范文档
1. 系统管理模块API规范（管理员端）
2. 数据监控模块API规范（管理员端）
3. 财务数据管理模块API规范（管理员端）
4. 第三方平台管理模块API规范（管理员端）

---

## 七、技术架构总结

### 三层架构
```
┌─────────────────────────────────────────────┐
│         租户端 (React + TypeScript)          │
│  - 页面展示                                  │
│  - 用户交互                                  │
│  - 数据展示                                  │
└─────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│    Node.js中间层 (tRPC + Express)           │
│  - API路由                                   │
│  - 业务逻辑                                  │
│  - 数据同步                                  │
│  - 第三方API调用                            │
└─────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│    Java后端 (RuoYi框架)                     │
│  - 数据库操作                                │
│  - 业务处理                                  │
│  - 数据持久化                                │
└─────────────────────────────────────────────┘
```

### 数据流向
1. **租户端** → 调用tRPC API
2. **Node.js中间层** → 调用Java后端API或第三方API
3. **Java后端** → 操作数据库
4. **第三方平台** → 抖店、千川、聚水潭等

---

## 八、后续工作计划

### 短期（1-2周）
1. ✅ 完成租户端所有业务模块的页面实现
2. ✅ 完成API路由和Hook的实现
3. ✅ 完成API规范文档编写
4. ⏳ 实现Java后端API接口（按规范）
5. ⏳ 配置JAVA_API_BASE_URL环境变量

### 中期（2-4周）
1. ⏳ 实现管理员端系统管理模块
2. ⏳ 实现管理员端数据监控模块
3. ⏳ 实现管理员端财务数据管理模块
4. ⏳ 编写管理员端API规范文档

### 长期（1-2个月）
1. ⏳ 完成管理员端所有模块
2. ⏳ 实现数据导出和报表生成功能
3. ⏳ 实现预警通知功能
4. ⏳ 性能优化和安全加固
5. ⏳ 系统测试和上线部署

---

## 附录：文件清单

### 租户端页面文件（40个）
```
client/src/pages/
├── Accounting.tsx
├── Analysis.tsx
├── BusinessSummary.tsx
├── ComponentShowcase.tsx
├── CostConfig.tsx
├── Dashboard.tsx
├── DocumentCenter.tsx
├── DocumentLinking.tsx
├── DoudianAuthCallback.tsx
├── DoudianSync.tsx
├── Expense.tsx
├── FinanceCommandCenter.tsx
├── Funds.tsx
├── HelpCenter.tsx
├── Home.tsx
├── Inventory.tsx
├── JstSync.tsx
├── NotFound.tsx
├── OrderDetail.tsx
├── OrderManagement.tsx
├── OrderMonthlyStats.tsx
├── OrderReconciliation.tsx
├── OrderStatistics.tsx
├── OrderThirtyDays.tsx
├── OrderYearlyStats.tsx
├── QianchuanSync.tsx
├── ReconciliationDashboard.tsx
├── Tax.tsx
└── cashier/
    ├── CashierAlertRules.tsx
    ├── CashierAlerts.tsx
    ├── CashierCashflow.tsx
    ├── CashierChannels.tsx
    ├── CashierDailyReport.tsx
    ├── CashierDashboard.tsx
    ├── CashierDifferences.tsx
    ├── CashierMonthlyReport.tsx
    ├── CashierReconciliation.tsx
    └── CashierShopReport.tsx
```

### 后端API路由文件（13个）
```
server/
├── dashboardRouter.ts
├── orderRouter.ts
├── ledgerRouter.ts
├── cashierRouter.ts
├── cashflowRouter.ts
├── costUpdateRouter.ts
├── productCostRouter.ts
├── orderSyncRouter.ts
├── qianchuanRouter.ts
├── jstRouter.ts
├── doudianRouter.ts
├── documentRouter.ts
└── reconciliationRouter.ts
```

### 后端Service文件（9个）
```
server/
├── doudianAuthService.ts
├── doudianApi.ts
├── qianchuanApi.ts
├── jstApi.ts
├── orderSync.ts
├── qianchuanSyncService.ts
├── jstSyncService.ts
├── costUpdateService.ts
└── reconciliation.ts
```

### Java后端文件（15个）
```
backend-java/src/main/java/com/shandianzhang/
├── common/
│   └── Result.java
├── controller/
│   ├── OrderController.java
│   └── ReconciliationController.java
├── dao/
│   └── OrderDAO.java
├── model/
│   ├── dto/
│   │   ├── OrderDTO.java
│   │   └── ReconciliationDTO.java
│   ├── entity/
│   │   ├── DocumentEntity.java
│   │   ├── OrderEntity.java
│   │   └── ReconciliationEntity.java
│   └── vo/
│       ├── OrderStatsVO.java
│       └── PageResult.java
└── service/
    ├── OrderService.java
    ├── ReconciliationService.java
    └── impl/
        ├── OrderServiceImpl.java
        └── ReconciliationServiceImpl.java
```

---

**文档更新时间**：2025年1月16日
**文档维护者**：Manus AI Agent
