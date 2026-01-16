# 闪电帐PRO 缺失功能分析报告

**文档版本**：v1.0  
**创建日期**：2025-01-16  
**作者**：Manus AI  
**适用项目**：闪电帐PRO SAAS系统

---

> **重要提示**：本文档详细分析了租户端模块的数据读取来源，以及管理员端、Java后端和数据库层面还缺少的业务功能、接口和表结构。

---

## 目录

1. [租户端数据读取来源分析](#一租户端数据读取来源分析)
2. [Java后端缺失功能分析](#二java后端缺失功能分析)
3. [管理员端缺失功能分析](#三管理员端缺失功能分析)
4. [数据库缺失表结构分析](#四数据库缺失表结构分析)
5. [API接口缺失分析](#五api接口缺失分析)
6. [开发优先级建议](#六开发优先级建议)

---

## 一、租户端数据读取来源分析

### 1.1 当前数据流架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           租户端数据读取来源                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  React租户端                                                                │
│       │                                                                     │
│       ├──→ tRPC调用 ──→ Node.js中间层 ──→ 本地数据库（Drizzle ORM）          │
│       │                      │                                              │
│       │                      └──→ 第三方API（抖店/千川/聚水潭）               │
│       │                                                                     │
│       └──→ RESTful API ──→ Java后端（RuoYi框架）──→ MySQL数据库              │
│                                  │                                          │
│                                  └──→ 第三方API（抖店/千川/聚水潭）           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 各模块数据来源详细分析

| 模块 | 当前数据来源 | 目标数据来源 | 迁移状态 |
|------|------------|------------|---------|
| **经营概览** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |
| **订单管理** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |
| **总账管理** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |
| **出纳管理** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |
| **数据同步** | Node.js中间层 + 第三方API | Java后端 + 第三方API | ⏳ 待迁移 |
| **授权管理** | Node.js中间层 + 抖店OAuth | Java后端 + 抖店OAuth | ⏳ 待迁移 |
| **单据中心** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |
| **数据对账** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |
| **成本配置** | Node.js中间层 + tRPC | Java后端 + RESTful | ⏳ 待迁移 |

### 1.3 租户端Node.js中间层Router分析

| Router文件 | 文件大小 | 功能描述 | 对应Java Controller |
|-----------|---------|---------|-------------------|
| `dashboardRouter.ts` | 6.3KB | 经营概览数据 | ❌ **缺失** |
| `orderRouter.ts` | 6.4KB | 订单管理CRUD | ✅ OrderController |
| `orderSyncRouter.ts` | 0KB | 订单同步（空文件） | ❌ **缺失** |
| `ledgerRouter.ts` | 31.5KB | 总账管理 | ❌ **缺失** |
| `cashierRouter.ts` | 34.9KB | 出纳管理 | ❌ **缺失** |
| `cashflowRouter.ts` | 11KB | 资金流水CRUD | ✅ CashflowController |
| `costUpdateRouter.ts` | 4.2KB | 成本更新 | ❌ **缺失** |
| `productCostRouter.ts` | 3KB | 商品成本CRUD | ✅ ProductCostController |
| `doudianRouter.ts` | 13.1KB | 抖店授权/API | ❌ **缺失** |
| `qianchuanRouter.ts` | 6.2KB | 千川同步 | ❌ **缺失** |
| `jstRouter.ts` | 8.7KB | 聚水潭同步 | ❌ **缺失** |
| `documentRouter.ts` | 0KB | 单据中心（空文件） | ❌ **缺失** |
| `reconciliationRouter.ts` | 2.2KB | 数据对账 | ✅ ReconciliationController（基础） |

---

## 二、Java后端缺失功能分析

### 2.1 已有的Java后端代码

#### 2.1.1 Entity (DO) - 5个
| Entity | 文件路径 | 状态 |
|--------|---------|------|
| OrderDO | `dal/dataobject/OrderDO.java` | ✅ 已有 |
| CashflowDO | `dal/dataobject/CashflowDO.java` | ✅ 已有 |
| ProductCostDO | `dal/dataobject/ProductCostDO.java` | ✅ 已有 |
| DoudianConfigDO | `dal/dataobject/DoudianConfigDO.java` | ✅ 已有 |
| SyncLogDO | `dal/dataobject/SyncLogDO.java` | ✅ 已有 |

#### 2.1.2 Controller - 7个
| Controller | 文件路径 | 状态 |
|-----------|---------|------|
| OrderController | `controller/admin/order/` | ✅ 已有 |
| CashflowController | `controller/admin/cashflow/` | ✅ 已有 |
| ProductCostController | `controller/admin/productcost/` | ✅ 已有 |
| DoudianConfigController | `controller/admin/doudianconfig/` | ✅ 已有 |
| SyncLogController | `controller/admin/synclog/` | ✅ 已有 |
| ReconciliationController | `controller/admin/reconciliation/` | ✅ 已有（基础） |
| ReportController | `controller/admin/report/` | ✅ 已有（基础） |

#### 2.1.3 Service - 13个文件
| Service | 状态 | 实现完整度 |
|---------|------|-----------|
| OrderService | ✅ 已有 | 80% |
| CashflowService | ✅ 已有 | 80% |
| ProductCostService | ✅ 已有 | 80% |
| DoudianConfigService | ✅ 已有 | 70% |
| SyncLogService | ✅ 已有 | 70% |
| DoudianService | ✅ 已有（接口） | 30% - 缺实现 |
| ReconciliationService | ✅ 已有（接口） | 20% - 缺实现 |
| ReportService | ✅ 已有（接口） | 20% - 缺实现 |

### 2.2 缺失的Java后端代码

#### 2.2.1 缺失的Entity (DO)

| Entity | 描述 | 优先级 |
|--------|------|-------|
| **QianchuanConfigDO** | 千川配置实体 | P1 |
| **JstConfigDO** | 聚水潭配置实体 | P1 |
| **ReconciliationDiffDO** | 对账差异实体 | P1 |
| **CostAdjustmentDO** | 成本调整记录实体 | P2 |
| **FinanceReportDO** | 财务报表实体 | P2 |
| **DocumentOrderMappingDO** | 单据订单关联实体 | P2 |
| **ReconciliationLogDO** | 对账日志实体 | P2 |
| **ReconciliationExceptionDO** | 对账异常实体 | P2 |
| **DoudianAuthTokenDO** | 抖店授权Token实体 | P1 |
| **DoudianShopDO** | 抖店店铺信息实体 | P1 |

#### 2.2.2 缺失的Service

| Service | 描述 | 优先级 |
|---------|------|-------|
| **DashboardService** | 经营概览数据服务 | P1 |
| **LedgerService** | 总账管理服务 | P1 |
| **CashierService** | 出纳管理服务 | P1 |
| **QianchuanService** | 千川API集成服务 | P1 |
| **JstService** | 聚水潭API集成服务 | P1 |
| **DoudianAuthService** | 抖店OAuth授权服务 | P1 |
| **OrderSyncService** | 订单同步服务 | P1 |
| **CostUpdateService** | 成本更新服务 | P2 |
| **DocumentService** | 单据中心服务 | P2 |
| **AlertService** | 预警通知服务 | P2 |

#### 2.2.3 缺失的Controller

| Controller | 描述 | 优先级 |
|-----------|------|-------|
| **DashboardController** | 经营概览API | P1 |
| **LedgerController** | 总账管理API | P1 |
| **CashierController** | 出纳管理API | P1 |
| **QianchuanController** | 千川同步API | P1 |
| **JstController** | 聚水潭同步API | P1 |
| **DoudianAuthController** | 抖店授权API | P1 |
| **OrderSyncController** | 订单同步API | P1 |
| **CostUpdateController** | 成本更新API | P2 |
| **DocumentController** | 单据中心API | P2 |
| **AlertController** | 预警通知API | P2 |

### 2.3 缺失的Service实现详情

#### 2.3.1 DashboardService（经营概览）

```java
public interface DashboardService {
    // 获取经营概览数据
    DashboardOverviewVO getOverview(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取销售趋势
    List<SalesTrendVO> getSalesTrend(Long shopId, String period);
    
    // 获取商品销售排行
    List<ProductRankVO> getProductRank(Long shopId, Integer limit);
    
    // 获取订单状态统计
    OrderStatusStatVO getOrderStatusStat(Long shopId);
    
    // 获取资金概览
    FundOverviewVO getFundOverview(Long shopId);
    
    // 获取利润分析
    ProfitAnalysisVO getProfitAnalysis(Long shopId, LocalDate startDate, LocalDate endDate);
}
```

#### 2.3.2 LedgerService（总账管理）

```java
public interface LedgerService {
    // 获取总账列表
    PageResult<LedgerVO> getLedgerPage(LedgerPageReqVO reqVO);
    
    // 获取财务核算数据
    AccountingVO getAccounting(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取资金流入流出
    FundsFlowVO getFundsFlow(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取库存成本
    InventoryCostVO getInventoryCost(Long shopId);
    
    // 获取销售分析
    SalesAnalysisVO getSalesAnalysis(Long shopId, String dimension);
    
    // 获取费用统计
    ExpenseStatVO getExpenseStat(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取税务统计
    TaxStatVO getTaxStat(Long shopId, LocalDate startDate, LocalDate endDate);
}
```

#### 2.3.3 CashierService（出纳管理）

```java
public interface CashierService {
    // 获取出纳工作台数据
    CashierDashboardVO getDashboard(Long shopId);
    
    // 获取待处理事项
    List<PendingTaskVO> getPendingTasks(Long shopId);
    
    // 获取渠道列表
    List<ChannelVO> getChannels(Long shopId);
    
    // 配置渠道
    void configChannel(ChannelConfigReqVO reqVO);
    
    // 执行平台对账
    ReconciliationResultVO executeReconciliation(Long shopId, LocalDate date, String platform);
    
    // 获取差异列表
    PageResult<DifferenceVO> getDifferences(DifferencePageReqVO reqVO);
    
    // 处理差异
    void handleDifference(Long diffId, String handleType, String remark);
    
    // 生成日报
    DailyReportVO generateDailyReport(Long shopId, LocalDate date);
    
    // 生成月报
    MonthlyReportVO generateMonthlyReport(Long shopId, Integer year, Integer month);
    
    // 获取店铺统计
    ShopStatVO getShopStat(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取预警列表
    List<AlertVO> getAlerts(Long shopId);
    
    // 配置预警规则
    void configAlertRule(AlertRuleConfigReqVO reqVO);
}
```

#### 2.3.4 DoudianAuthService（抖店授权）

```java
public interface DoudianAuthService {
    // 获取授权URL
    String getAuthUrl(Long userId, String redirectUri);
    
    // 处理授权回调
    DoudianAuthTokenDO handleCallback(String code, Long userId);
    
    // 刷新Token
    DoudianAuthTokenDO refreshToken(Long tokenId);
    
    // 获取用户的授权店铺列表
    List<DoudianShopDO> getAuthorizedShops(Long userId);
    
    // 检查授权状态
    AuthStatusVO checkAuthStatus(Long shopId);
    
    // 撤销授权
    void revokeAuth(Long shopId);
}
```

#### 2.3.5 QianchuanService（千川集成）

```java
public interface QianchuanService {
    // 获取授权URL
    String getAuthUrl(Long userId, String redirectUri);
    
    // 处理授权回调
    void handleCallback(String code, Long userId);
    
    // 同步推广数据
    SyncResultVO syncPromotionData(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取推广费用
    List<PromotionCostVO> getPromotionCosts(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 获取推广效果统计
    PromotionStatVO getPromotionStat(Long shopId, LocalDate date);
}
```

#### 2.3.6 JstService（聚水潭集成）

```java
public interface JstService {
    // 配置API连接
    void configApi(JstConfigReqVO reqVO);
    
    // 测试API连接
    boolean testConnection(Long configId);
    
    // 同步入库单
    SyncResultVO syncInboundOrders(Long shopId, LocalDate startDate, LocalDate endDate);
    
    // 同步库存数据
    SyncResultVO syncInventory(Long shopId);
    
    // 获取入库单列表
    PageResult<InboundOrderVO> getInboundOrders(InboundOrderPageReqVO reqVO);
    
    // 更新商品成本（根据入库单）
    void updateProductCostFromInbound(Long inboundOrderId);
}
```

---

## 三、管理员端缺失功能分析

### 3.1 管理员端模块清单

根据租户端的12个业务模块，管理员端需要开发以下功能：

| 模块 | 子模块 | 功能描述 | 优先级 | 状态 |
|------|-------|---------|-------|------|
| **系统管理** | - | 复用RuoYi框架 | - | ✅ 已有 |
| **财务管理** | 订单管理 | 全平台订单查看、数据修正 | P1 | ❌ 缺失 |
| | 资金流水 | 全平台流水查看、审核 | P1 | ❌ 缺失 |
| | 对账管理 | 对账规则配置、差异处理 | P1 | ❌ 缺失 |
| | 成本管理 | 成本配置、调整记录 | P2 | ❌ 缺失 |
| | 财务报表 | 报表生成、导出 | P2 | ⏳ 部分 |
| | 财务配置 | 全局财务参数配置 | P2 | ❌ 缺失 |
| **平台管理** | 抖店配置 | 抖店API配置、授权管理 | P1 | ❌ 缺失 |
| | 千川配置 | 千川API配置、授权管理 | P1 | ❌ 缺失 |
| | 聚水潭配置 | 聚水潭API配置 | P1 | ❌ 缺失 |
| | 同步任务 | 同步任务监控、重试 | P2 | ❌ 缺失 |
| **监控管理** | 系统监控 | 系统运行状态监控 | P2 | ✅ 已有 |
| | 租户监控 | 租户数据统计、使用情况 | P2 | ❌ 缺失 |
| | 同步监控 | 数据同步状态监控 | P2 | ❌ 缺失 |
| | 预警管理 | 预警规则配置、通知管理 | P2 | ❌ 缺失 |
| **帮助管理** | 文档管理 | 帮助文档编辑 | P3 | ❌ 缺失 |

### 3.2 管理员端页面清单

#### 3.2.1 财务管理模块页面

```
views/finance/
├── dashboard/                    # 财务总览
│   └── index.vue                 # 平台财务数据统计
├── order/                        # 订单管理
│   ├── index.vue                 # 订单列表
│   ├── OrderDetail.vue           # 订单详情
│   └── OrderForm.vue             # 订单编辑
├── cashflow/                     # 资金流水
│   ├── index.vue                 # 流水列表
│   ├── CashflowDetail.vue        # 流水详情
│   └── CashflowForm.vue          # 流水编辑
├── reconciliation/               # 对账管理
│   ├── index.vue                 # 对账列表
│   ├── ReconciliationRule.vue    # 对账规则配置
│   └── DifferenceList.vue        # 差异列表
├── productcost/                  # 成本管理
│   ├── index.vue                 # 成本列表
│   ├── ProductCostForm.vue       # 成本编辑
│   └── CostAdjustment.vue        # 成本调整记录
├── report/                       # 财务报表
│   ├── index.vue                 # 报表总览
│   ├── daily.vue                 # 日报表
│   ├── weekly.vue                # 周报表
│   └── monthly.vue               # 月报表
└── config/                       # 财务配置
    └── index.vue                 # 全局配置
```

#### 3.2.2 平台管理模块页面

```
views/platform/
├── doudian/                      # 抖店管理
│   ├── index.vue                 # 配置列表
│   ├── DoudianConfigForm.vue     # 配置编辑
│   └── AuthManage.vue            # 授权管理
├── qianchuan/                    # 千川管理
│   ├── index.vue                 # 配置列表
│   └── QianchuanConfigForm.vue   # 配置编辑
├── jst/                          # 聚水潭管理
│   ├── index.vue                 # 配置列表
│   └── JstConfigForm.vue         # 配置编辑
└── sync/                         # 同步任务
    ├── index.vue                 # 任务列表
    ├── SyncLogDetail.vue         # 日志详情
    └── SyncConfig.vue            # 同步配置
```

#### 3.2.3 监控管理模块页面

```
views/monitor/
├── tenant/                       # 租户监控
│   ├── index.vue                 # 租户统计
│   └── TenantDetail.vue          # 租户详情
├── sync/                         # 同步监控
│   └── index.vue                 # 同步状态
└── alert/                        # 预警管理
    ├── index.vue                 # 预警列表
    └── AlertRuleForm.vue         # 规则配置
```

### 3.3 管理员端API模块

```
api/finance/
├── dashboard.ts                  # 财务总览API
├── order.ts                      # 订单管理API
├── cashflow.ts                   # 资金流水API
├── reconciliation.ts             # 对账管理API
├── productcost.ts                # 成本管理API
├── report.ts                     # 财务报表API
└── config.ts                     # 财务配置API

api/platform/
├── doudian.ts                    # 抖店管理API
├── qianchuan.ts                  # 千川管理API
├── jst.ts                        # 聚水潭管理API
└── sync.ts                       # 同步任务API

api/monitor/
├── tenant.ts                     # 租户监控API
├── sync.ts                       # 同步监控API
└── alert.ts                      # 预警管理API
```

---

## 四、数据库缺失表结构分析

### 4.1 已有的数据库表

#### 4.1.1 Java后端SQL脚本中的表（10个）

| 表名 | 描述 | 状态 |
|-----|------|------|
| `finance_orders` | 订单表 | ✅ 已有 |
| `finance_cashflow` | 资金流水表 | ✅ 已有 |
| `finance_product_cost` | 商品成本表 | ✅ 已有 |
| `finance_doudian_config` | 抖店配置表 | ✅ 已有 |
| `finance_sync_log` | 数据同步日志表 | ✅ 已有 |
| `finance_qianchuan_config` | 千川配置表 | ✅ 已有 |
| `finance_jst_config` | 聚水潭配置表 | ✅ 已有 |
| `finance_reconciliation_diff` | 对账差异表 | ✅ 已有 |
| `finance_cost_adjustment` | 成本调整记录表 | ✅ 已有 |
| `finance_report` | 财务报表表 | ✅ 已有 |

#### 4.1.2 租户端Drizzle Schema中的表（10个）

| 表名 | 描述 | 是否需要迁移到Java |
|-----|------|------------------|
| `users` | 用户表 | ❌ 使用RuoYi框架 |
| `doudian_auth_tokens` | 抖店授权Token表 | ✅ 需要 |
| `doudian_shops` | 抖店店铺信息表 | ✅ 需要 |
| `document_order_mapping` | 单据订单关联表 | ✅ 需要 |
| `reconciliation_logs` | 对账日志表 | ✅ 需要 |
| `reconciliation_exceptions` | 对账异常表 | ✅ 需要 |
| `sync_logs` | 数据同步日志表 | ✅ 已有（finance_sync_log） |

### 4.2 缺失的数据库表

| 表名 | 描述 | 优先级 | 对应Entity |
|-----|------|-------|-----------|
| **finance_doudian_auth_token** | 抖店授权Token表 | P1 | DoudianAuthTokenDO |
| **finance_doudian_shop** | 抖店店铺信息表 | P1 | DoudianShopDO |
| **finance_document_mapping** | 单据订单关联表 | P2 | DocumentOrderMappingDO |
| **finance_reconciliation_log** | 对账日志表 | P2 | ReconciliationLogDO |
| **finance_reconciliation_exception** | 对账异常表 | P2 | ReconciliationExceptionDO |
| **finance_alert_rule** | 预警规则表 | P2 | AlertRuleDO |
| **finance_alert_record** | 预警记录表 | P2 | AlertRecordDO |
| **finance_channel** | 渠道配置表 | P2 | ChannelDO |
| **finance_daily_stat** | 每日统计表 | P2 | DailyStatDO |

### 4.3 缺失表的SQL定义

```sql
-- ========================================
-- 缺失的数据库表定义
-- ========================================

-- 抖店授权Token表
CREATE TABLE IF NOT EXISTS `finance_doudian_auth_token` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Token ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `shop_id` VARCHAR(64) NOT NULL COMMENT '店铺ID',
    `shop_name` VARCHAR(128) COMMENT '店铺名称',
    `access_token` TEXT NOT NULL COMMENT 'Access Token',
    `refresh_token` TEXT COMMENT 'Refresh Token',
    `access_token_expires_at` DATETIME NOT NULL COMMENT 'Access Token过期时间',
    `refresh_token_expires_at` DATETIME COMMENT 'Refresh Token过期时间',
    `scope` TEXT COMMENT '授权范围',
    `auth_status` TINYINT NOT NULL DEFAULT 1 COMMENT '授权状态(0未授权,1已授权,2已过期,3已失效)',
    `last_sync_at` DATETIME COMMENT '最后同步时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_shop_id` (`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='抖店授权Token表';

-- 抖店店铺信息表
CREATE TABLE IF NOT EXISTS `finance_doudian_shop` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '店铺ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` VARCHAR(64) NOT NULL COMMENT '抖店店铺ID',
    `shop_name` VARCHAR(128) COMMENT '店铺名称',
    `shop_logo` TEXT COMMENT '店铺Logo',
    `shop_type` VARCHAR(32) COMMENT '店铺类型',
    `shop_status` VARCHAR(32) COMMENT '店铺状态',
    `user_id` BIGINT NOT NULL COMMENT '关联用户ID',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shop_id` (`shop_id`, `tenant_id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='抖店店铺信息表';

-- 单据订单关联表
CREATE TABLE IF NOT EXISTS `finance_document_mapping` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '关联ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `document_id` BIGINT NOT NULL COMMENT '单据ID',
    `order_id` BIGINT NOT NULL COMMENT '订单ID',
    `document_type` VARCHAR(50) NOT NULL COMMENT '单据类型',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    KEY `idx_document_id` (`document_id`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_tenant_shop` (`tenant_id`, `shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单据订单关联表';

-- 对账日志表
CREATE TABLE IF NOT EXISTS `finance_reconciliation_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `check_type` VARCHAR(32) NOT NULL COMMENT '检查类型(realtime/daily/monthly)',
    `check_date` DATE NOT NULL COMMENT '检查日期',
    `status` VARCHAR(32) NOT NULL COMMENT '检查状态(passed/failed)',
    `details` TEXT COMMENT '检查详情(JSON)',
    `error_message` TEXT COMMENT '错误信息',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_shop` (`tenant_id`, `shop_id`),
    KEY `idx_check_date` (`check_date`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对账日志表';

-- 对账异常表
CREATE TABLE IF NOT EXISTS `finance_reconciliation_exception` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '异常ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `exception_type` VARCHAR(50) NOT NULL COMMENT '异常类型',
    `order_id` BIGINT COMMENT '订单ID',
    `expected_value` DECIMAL(15, 2) COMMENT '期望值',
    `actual_value` DECIMAL(15, 2) COMMENT '实际值',
    `difference` DECIMAL(15, 2) COMMENT '差异',
    `status` VARCHAR(32) DEFAULT 'pending' COMMENT '异常状态(pending/resolved)',
    `resolved_by` BIGINT COMMENT '解决人ID',
    `resolved_at` DATETIME COMMENT '解决时间',
    `remark` TEXT COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_shop` (`tenant_id`, `shop_id`),
    KEY `idx_status` (`status`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对账异常表';

-- 预警规则表
CREATE TABLE IF NOT EXISTS `finance_alert_rule` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '规则ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT COMMENT '店铺ID(NULL表示全局)',
    `rule_name` VARCHAR(100) NOT NULL COMMENT '规则名称',
    `rule_type` VARCHAR(50) NOT NULL COMMENT '规则类型',
    `condition_config` TEXT NOT NULL COMMENT '条件配置(JSON)',
    `notify_config` TEXT COMMENT '通知配置(JSON)',
    `enabled` TINYINT DEFAULT 1 COMMENT '是否启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` VARCHAR(64) COMMENT '创建人',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_rule_type` (`rule_type`),
    KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警规则表';

-- 预警记录表
CREATE TABLE IF NOT EXISTS `finance_alert_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT COMMENT '店铺ID',
    `rule_id` BIGINT NOT NULL COMMENT '规则ID',
    `alert_type` VARCHAR(50) NOT NULL COMMENT '预警类型',
    `alert_level` VARCHAR(20) NOT NULL COMMENT '预警级别(info/warning/error)',
    `alert_content` TEXT NOT NULL COMMENT '预警内容',
    `trigger_value` VARCHAR(100) COMMENT '触发值',
    `threshold_value` VARCHAR(100) COMMENT '阈值',
    `status` VARCHAR(32) DEFAULT 'unread' COMMENT '状态(unread/read/processed)',
    `processed_by` BIGINT COMMENT '处理人ID',
    `processed_at` DATETIME COMMENT '处理时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_rule_id` (`rule_id`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警记录表';

-- 渠道配置表
CREATE TABLE IF NOT EXISTS `finance_channel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '渠道ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `channel_code` VARCHAR(50) NOT NULL COMMENT '渠道编码',
    `channel_name` VARCHAR(100) NOT NULL COMMENT '渠道名称',
    `channel_type` VARCHAR(50) COMMENT '渠道类型',
    `config` TEXT COMMENT '配置信息(JSON)',
    `enabled` TINYINT DEFAULT 1 COMMENT '是否启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_channel` (`tenant_id`, `shop_id`, `channel_code`),
    KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='渠道配置表';

-- 每日统计表
CREATE TABLE IF NOT EXISTS `finance_daily_stat` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '统计ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    `order_count` INT DEFAULT 0 COMMENT '订单数',
    `order_amount` DECIMAL(15, 2) DEFAULT 0 COMMENT '订单金额',
    `refund_count` INT DEFAULT 0 COMMENT '退款数',
    `refund_amount` DECIMAL(15, 2) DEFAULT 0 COMMENT '退款金额',
    `income_amount` DECIMAL(15, 2) DEFAULT 0 COMMENT '收入金额',
    `expense_amount` DECIMAL(15, 2) DEFAULT 0 COMMENT '支出金额',
    `profit_amount` DECIMAL(15, 2) DEFAULT 0 COMMENT '利润金额',
    `promotion_cost` DECIMAL(15, 2) DEFAULT 0 COMMENT '推广费用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_stat` (`tenant_id`, `shop_id`, `stat_date`),
    KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日统计表';
```

---

## 五、API接口缺失分析

### 5.1 已有的API接口

#### 5.1.1 Java后端已有接口

| Controller | 接口数量 | 接口列表 |
|-----------|---------|---------|
| OrderController | 5个 | create, update, delete, get, page |
| CashflowController | 5个 | create, update, delete, get, page |
| ProductCostController | 5个 | create, update, delete, get, page |
| DoudianConfigController | 5个 | create, update, delete, get, page |
| SyncLogController | 3个 | get, page, delete |
| ReconciliationController | 4个 | execute, getDiffs, handleDiff, page |
| ReportController | 4个 | getDaily, getWeekly, getMonthly, export |

### 5.2 缺失的API接口

#### 5.2.1 经营概览API（DashboardController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| getOverview | GET | /admin-api/finance/dashboard/overview | 获取经营概览 |
| getSalesTrend | GET | /admin-api/finance/dashboard/sales-trend | 获取销售趋势 |
| getProductRank | GET | /admin-api/finance/dashboard/product-rank | 获取商品排行 |
| getOrderStatusStat | GET | /admin-api/finance/dashboard/order-stat | 获取订单统计 |
| getFundOverview | GET | /admin-api/finance/dashboard/fund-overview | 获取资金概览 |
| getProfitAnalysis | GET | /admin-api/finance/dashboard/profit | 获取利润分析 |

#### 5.2.2 总账管理API（LedgerController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| getLedgerPage | GET | /admin-api/finance/ledger/page | 获取总账列表 |
| getAccounting | GET | /admin-api/finance/ledger/accounting | 获取财务核算 |
| getFundsFlow | GET | /admin-api/finance/ledger/funds-flow | 获取资金流入流出 |
| getInventoryCost | GET | /admin-api/finance/ledger/inventory-cost | 获取库存成本 |
| getSalesAnalysis | GET | /admin-api/finance/ledger/sales-analysis | 获取销售分析 |
| getExpenseStat | GET | /admin-api/finance/ledger/expense-stat | 获取费用统计 |
| getTaxStat | GET | /admin-api/finance/ledger/tax-stat | 获取税务统计 |

#### 5.2.3 出纳管理API（CashierController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| getDashboard | GET | /admin-api/finance/cashier/dashboard | 获取出纳工作台 |
| getPendingTasks | GET | /admin-api/finance/cashier/pending-tasks | 获取待处理事项 |
| getChannels | GET | /admin-api/finance/cashier/channels | 获取渠道列表 |
| configChannel | POST | /admin-api/finance/cashier/channel/config | 配置渠道 |
| executeReconciliation | POST | /admin-api/finance/cashier/reconciliation/execute | 执行对账 |
| getDifferences | GET | /admin-api/finance/cashier/differences | 获取差异列表 |
| handleDifference | POST | /admin-api/finance/cashier/difference/handle | 处理差异 |
| generateDailyReport | POST | /admin-api/finance/cashier/report/daily | 生成日报 |
| generateMonthlyReport | POST | /admin-api/finance/cashier/report/monthly | 生成月报 |
| getShopStat | GET | /admin-api/finance/cashier/shop-stat | 获取店铺统计 |
| getAlerts | GET | /admin-api/finance/cashier/alerts | 获取预警列表 |
| configAlertRule | POST | /admin-api/finance/cashier/alert-rule/config | 配置预警规则 |

#### 5.2.4 抖店授权API（DoudianAuthController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| getAuthUrl | GET | /admin-api/finance/doudian/auth-url | 获取授权URL |
| handleCallback | GET | /admin-api/finance/doudian/callback | 处理授权回调 |
| refreshToken | POST | /admin-api/finance/doudian/refresh-token | 刷新Token |
| getAuthorizedShops | GET | /admin-api/finance/doudian/shops | 获取授权店铺 |
| checkAuthStatus | GET | /admin-api/finance/doudian/auth-status | 检查授权状态 |
| revokeAuth | POST | /admin-api/finance/doudian/revoke | 撤销授权 |

#### 5.2.5 千川API（QianchuanController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| getAuthUrl | GET | /admin-api/finance/qianchuan/auth-url | 获取授权URL |
| handleCallback | GET | /admin-api/finance/qianchuan/callback | 处理授权回调 |
| syncPromotionData | POST | /admin-api/finance/qianchuan/sync | 同步推广数据 |
| getPromotionCosts | GET | /admin-api/finance/qianchuan/costs | 获取推广费用 |
| getPromotionStat | GET | /admin-api/finance/qianchuan/stat | 获取推广统计 |

#### 5.2.6 聚水潭API（JstController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| configApi | POST | /admin-api/finance/jst/config | 配置API连接 |
| testConnection | POST | /admin-api/finance/jst/test | 测试API连接 |
| syncInboundOrders | POST | /admin-api/finance/jst/sync/inbound | 同步入库单 |
| syncInventory | POST | /admin-api/finance/jst/sync/inventory | 同步库存 |
| getInboundOrders | GET | /admin-api/finance/jst/inbound/page | 获取入库单列表 |
| updateCostFromInbound | POST | /admin-api/finance/jst/cost/update | 更新成本 |

#### 5.2.7 订单同步API（OrderSyncController）

| 接口 | 方法 | 路径 | 描述 |
|-----|------|-----|------|
| syncOrders | POST | /admin-api/finance/order-sync/sync | 同步订单 |
| getSyncStatus | GET | /admin-api/finance/order-sync/status | 获取同步状态 |
| getSyncLogs | GET | /admin-api/finance/order-sync/logs | 获取同步日志 |
| retrySyncTask | POST | /admin-api/finance/order-sync/retry | 重试同步任务 |

---

## 六、开发优先级建议

### 6.1 P1 优先级（核心功能）

| 序号 | 模块 | 工作内容 | 预计工时 |
|-----|------|---------|---------|
| 1 | Java后端 | 完成DoudianAuthService实现 | 2天 |
| 2 | Java后端 | 完成DashboardService实现 | 2天 |
| 3 | Java后端 | 完成LedgerService实现 | 3天 |
| 4 | Java后端 | 完成CashierService实现 | 3天 |
| 5 | Java后端 | 完成QianchuanService实现 | 2天 |
| 6 | Java后端 | 完成JstService实现 | 2天 |
| 7 | 数据库 | 创建缺失的核心表 | 1天 |
| 8 | 管理员端 | 财务管理模块页面 | 5天 |
| 9 | 管理员端 | 平台管理模块页面 | 3天 |

**P1总计：约23天**

### 6.2 P2 优先级（重要功能）

| 序号 | 模块 | 工作内容 | 预计工时 |
|-----|------|---------|---------|
| 1 | Java后端 | 完成AlertService实现 | 2天 |
| 2 | Java后端 | 完成DocumentService实现 | 2天 |
| 3 | Java后端 | 完成CostUpdateService实现 | 1天 |
| 4 | 数据库 | 创建预警和渠道相关表 | 1天 |
| 5 | 管理员端 | 监控管理模块页面 | 3天 |
| 6 | 租户端 | 完成tRPC到RESTful迁移 | 5天 |

**P2总计：约14天**

### 6.3 P3 优先级（辅助功能）

| 序号 | 模块 | 工作内容 | 预计工时 |
|-----|------|---------|---------|
| 1 | 管理员端 | 帮助文档管理页面 | 2天 |
| 2 | 测试 | 单元测试和集成测试 | 5天 |
| 3 | 文档 | API文档和用户手册 | 3天 |

**P3总计：约10天**

### 6.4 总体开发计划

```
阶段1（P1）：核心功能开发 - 约23天
    ├── Week 1-2: Java后端Service实现
    ├── Week 3: 数据库表创建和测试
    └── Week 4-5: 管理员端页面开发

阶段2（P2）：重要功能开发 - 约14天
    ├── Week 6: Java后端补充功能
    ├── Week 7: 监控管理模块
    └── Week 8: 租户端迁移

阶段3（P3）：辅助功能和测试 - 约10天
    ├── Week 9: 帮助文档和测试
    └── Week 10: 文档完善和上线准备

总计：约47天（约10周）
```

---

## 附录：文件清单

### A.1 需要新增的Java文件

```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/
├── dal/dataobject/
│   ├── DoudianAuthTokenDO.java          # 新增
│   ├── DoudianShopDO.java               # 新增
│   ├── DocumentOrderMappingDO.java      # 新增
│   ├── ReconciliationLogDO.java         # 新增
│   ├── ReconciliationExceptionDO.java   # 新增
│   ├── AlertRuleDO.java                 # 新增
│   ├── AlertRecordDO.java               # 新增
│   ├── ChannelDO.java                   # 新增
│   └── DailyStatDO.java                 # 新增
├── dal/mysql/
│   ├── DoudianAuthTokenMapper.java      # 新增
│   ├── DoudianShopMapper.java           # 新增
│   ├── DocumentOrderMappingMapper.java  # 新增
│   ├── ReconciliationLogMapper.java     # 新增
│   ├── ReconciliationExceptionMapper.java # 新增
│   ├── AlertRuleMapper.java             # 新增
│   ├── AlertRecordMapper.java           # 新增
│   ├── ChannelMapper.java               # 新增
│   └── DailyStatMapper.java             # 新增
├── service/
│   ├── DashboardService.java            # 新增
│   ├── DashboardServiceImpl.java        # 新增
│   ├── LedgerService.java               # 新增
│   ├── LedgerServiceImpl.java           # 新增
│   ├── CashierService.java              # 新增
│   ├── CashierServiceImpl.java          # 新增
│   ├── DoudianAuthService.java          # 新增
│   ├── DoudianAuthServiceImpl.java      # 新增
│   ├── DoudianServiceImpl.java          # 新增（实现）
│   ├── QianchuanService.java            # 新增
│   ├── QianchuanServiceImpl.java        # 新增
│   ├── JstService.java                  # 新增
│   ├── JstServiceImpl.java              # 新增
│   ├── OrderSyncService.java            # 新增
│   ├── OrderSyncServiceImpl.java        # 新增
│   ├── AlertService.java                # 新增
│   ├── AlertServiceImpl.java            # 新增
│   ├── DocumentService.java             # 新增
│   ├── DocumentServiceImpl.java         # 新增
│   ├── CostUpdateService.java           # 新增
│   ├── CostUpdateServiceImpl.java       # 新增
│   ├── ReconciliationServiceImpl.java   # 新增（实现）
│   └── ReportServiceImpl.java           # 新增（实现）
└── controller/admin/
    ├── dashboard/
    │   ├── DashboardController.java     # 新增
    │   └── vo/                          # 新增
    ├── ledger/
    │   ├── LedgerController.java        # 新增
    │   └── vo/                          # 新增
    ├── cashier/
    │   ├── CashierController.java       # 新增
    │   └── vo/                          # 新增
    ├── doudianauth/
    │   ├── DoudianAuthController.java   # 新增
    │   └── vo/                          # 新增
    ├── qianchuan/
    │   ├── QianchuanController.java     # 新增
    │   └── vo/                          # 新增
    ├── jst/
    │   ├── JstController.java           # 新增
    │   └── vo/                          # 新增
    ├── ordersync/
    │   ├── OrderSyncController.java     # 新增
    │   └── vo/                          # 新增
    └── alert/
        ├── AlertController.java         # 新增
        └── vo/                          # 新增
```

### A.2 需要新增的Vue3文件

```
ruoyi-admin-vue3/src/
├── api/finance/
│   ├── dashboard.ts                     # 新增
│   ├── ledger.ts                        # 新增
│   ├── cashier.ts                       # 新增
│   ├── doudianauth.ts                   # 新增
│   ├── qianchuan.ts                     # 新增
│   ├── jst.ts                           # 新增
│   ├── ordersync.ts                     # 新增
│   └── alert.ts                         # 新增
├── api/platform/
│   ├── doudian.ts                       # 新增
│   ├── qianchuan.ts                     # 新增
│   ├── jst.ts                           # 新增
│   └── sync.ts                          # 新增
├── api/monitor/
│   ├── tenant.ts                        # 新增
│   ├── sync.ts                          # 新增
│   └── alert.ts                         # 新增
└── views/finance/
    ├── dashboard/index.vue              # 新增
    ├── order/                           # 新增
    ├── cashflow/                        # 新增
    ├── reconciliation/                  # 新增
    ├── productcost/                     # 新增
    ├── report/                          # 已有部分
    └── config/                          # 新增
```

---

**文档结束**

> 本文档将持续更新，随着开发进度的推进，会标注已完成的功能和新发现的缺失项。
