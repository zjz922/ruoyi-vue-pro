# 现有源码完整清单

## 一、项目架构概述

### 系统架构图
```
┌─────────────────────────────────────────────────────────┐
│                   租户端 (React前端)                     │
│  - 页面展示和交互                                        │
│  - 调用Java后端RESTful API                              │
│  - 支持多店铺切换                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│            Java后端 (RuoYi-Vue-Pro框架)                 │
│  - 所有API调用（抖店、千川、聚水潭）                    │
│  - 业务逻辑处理                                          │
│  - 数据库操作                                            │
│  - 多租户隔离                                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────┬──────────────────┬──────────────────┐
│   抖店API        │   千川API        │   聚水潭API      │
│  (订单、商品、   │  (推广数据、    │  (入库单、库存   │
│   资金流水等)    │   费用数据)      │   成本数据)      │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 二、Java后端源码清单

### 2.1 RuoYi框架集成位置

**路径**：`/home/ubuntu/doudian-finance-prototype/ruoyi-integration/`

**包含两个版本**：
- `java/` - 基础版本（3个Controller、5个Entity、2个Mapper、3个Service）
- `java-complete/` - 完整版本（1个Controller、7个Entity、2个Mapper、1个Service、1个VO、配置文件）

### 2.2 Java代码文件清单

#### 2.2.1 基础版本 (java/)

**Controller层（3个文件）**
```
java/controller/
├── DoudianController.java          # 抖店API控制器
│   - 抖店配置管理（创建、更新、删除、查询）
│   - 订单同步和详情查询
│   - 商品同步和详情查询
│   - 财务数据查询（结算账单、资金流水、达人佣金）
│   - 保险和售后管理
│
├── OrderController.java             # 订单管理控制器
│   - 订单分页查询
│   - 订单详情查询
│   - 订单创建、更新、删除
│   - 订单统计
│   - 订单批量导入
│
└── ProductCostController.java       # 商品成本控制器
    - 商品成本分页查询
    - 商品成本详情查询
    - 商品成本创建、更新、删除
    - 商品成本批量导入
    - 成本变更历史查询
```

**Entity层（5个文件）**
```
java/entity/
├── DailyStatsDO.java               # 每日统计实体
│   - 字段：统计日期、订单数、销售额、退款额等
│
├── DoudianConfigDO.java            # 抖店配置实体
│   - 字段：店铺名称、AppKey、AppSecret、Token等
│
├── OrderDO.java                    # 订单实体
│   - 字段：订单号、商品信息、价格、收货地址等
│
├── ProductCostDO.java              # 商品成本实体
│   - 字段：商品ID、成本、价格、库存等
│
└── ProductCostHistoryDO.java       # 商品成本历史实体
    - 字段：成本变更记录、变更原因、变更时间等
```

**Mapper层（2个文件）**
```
java/mapper/
├── OrderMapper.java                # 订单Mapper接口
│   - 分页查询、条件查询、统计等12个方法
│
└── ProductCostMapper.java          # 商品成本Mapper接口
    - 分页查询、条件查询、历史查询等方法
```

**Service层（3个文件）**
```
java/service/
├── DoudianService.java             # 抖店Service接口
│   - 配置管理、订单同步、商品同步、财务数据查询等
│
├── OrderService.java               # 订单Service接口
│   - 订单查询、创建、更新、删除、统计等
│
└── ProductCostService.java         # 商品成本Service接口
    - 成本查询、创建、更新、删除、历史查询等
    - ProductCostServiceImpl.java - 实现类
```

**VO层（1个文件）**
```
java/vo/
└── ProductCostVO.java              # 商品成本视图对象
    - 用于前端展示的数据结构
```

#### 2.2.2 完整版本 (java-complete/)

**Entity层（7个文件）**
```
java-complete/entity/
├── OrderDO.java                    # 订单实体（35个字段）
├── DailyStatsDO.java               # 每日统计实体（19个字段）
├── QianchuanConfigDO.java          # 千川配置实体
├── QianchuanExpenseDO.java         # 千川推广费实体
├── JstConfigDO.java                # 聚水潭配置实体
├── JstPurchaseInDO.java            # 聚水潭入库单实体
└── SyncLogDO.java                  # 同步日志实体
```

**Mapper层（2个文件）**
```
java-complete/mapper/
├── OrderMapper.java                # 订单Mapper接口
└── DailyStatsMapper.java           # 每日统计Mapper接口
```

**Mapper XML（2个文件）**
```
java-complete/mapper-xml/
├── OrderMapper.xml                 # 订单SQL定义
│   - 支持分页、搜索、筛选、统计
│
└── DailyStatsMapper.xml            # 每日统计SQL定义
    - 支持趋势分析、费用分布统计
```

**Service层（2个文件）**
```
java-complete/service/
├── OrderService.java               # 订单Service接口（13个业务方法）
└── OrderServiceImpl.java            # 订单Service实现类
```

**Controller层（1个文件）**
```
java-complete/controller/
└── OrderController.java            # 订单REST API控制器（8个端点）
```

**VO层（1个文件）**
```
java-complete/vo/
└── OrderVO.java                    # 订单视图对象
```

**配置层（2个文件）**
```
java-complete/config/
├── FinanceConfig.java              # 财务模块配置类
│   - 常量定义、枚举定义
│
└── application-finance.yml         # 应用配置文件
    - API配置、定时任务配置
```

### 2.3 Java API实现的功能

#### 2.3.1 抖店API集成
**DoudianController.java** 实现的API端点：
```
POST   /finance/doudian/config/create       # 创建抖店配置
PUT    /finance/doudian/config/update       # 更新抖店配置
DELETE /finance/doudian/config/delete       # 删除抖店配置
GET    /finance/doudian/config/get          # 获取抖店配置
GET    /finance/doudian/config/list         # 获取配置列表
GET    /finance/doudian/config/check        # 检查API配置状态

POST   /finance/doudian/order/sync          # 同步订单
GET    /finance/doudian/order/detail        # 获取订单详情

POST   /finance/doudian/product/sync        # 同步商品
GET    /finance/doudian/product/detail      # 获取商品详情

GET    /finance/doudian/settle/bill         # 获取结算账单
GET    /finance/doudian/account/flow        # 获取资金流水
GET    /finance/doudian/commission/list     # 获取达人佣金

GET    /finance/doudian/insurance/detail    # 获取保险详情
GET    /finance/doudian/aftersale/list      # 获取售后列表
GET    /finance/doudian/aftersale/detail    # 获取售后详情
```

**关键功能**：
- ✅ 抖店OAuth授权配置管理
- ✅ 订单数据同步
- ✅ 商品数据同步
- ✅ 结算账单查询
- ✅ 资金流水查询
- ✅ 达人佣金查询
- ✅ 售后管理

#### 2.3.2 订单管理API
**OrderController.java** 实现的API端点：
```
GET    /finance/order/page              # 分页查询订单
GET    /finance/order/{id}              # 获取订单详情
POST   /finance/order                   # 创建订单
PUT    /finance/order/{id}              # 更新订单
DELETE /finance/order/{id}              # 删除订单
GET    /finance/order/stats             # 订单统计
POST   /finance/order/import            # 批量导入订单
```

**关键功能**：
- ✅ 订单分页查询（支持多条件筛选）
- ✅ 订单详情查询
- ✅ 订单创建、更新、删除
- ✅ 订单统计（按日期、按月、按年）
- ✅ 订单批量导入
- ✅ 多租户隔离

#### 2.3.3 商品成本API
**ProductCostController.java** 实现的API端点：
```
GET    /finance/product-cost/page           # 分页查询商品成本
GET    /finance/product-cost/{id}           # 获取商品成本详情
POST   /finance/product-cost                # 创建商品成本
PUT    /finance/product-cost/{id}           # 更新商品成本
DELETE /finance/product-cost/{id}           # 删除商品成本
POST   /finance/product-cost/import         # 批量导入商品成本
GET    /finance/product-cost/history        # 获取成本变更历史
```

**关键功能**：
- ✅ 商品成本分页查询
- ✅ 商品成本详情查询
- ✅ 商品成本创建、更新、删除
- ✅ 商品成本批量导入
- ✅ 成本变更历史查询
- ✅ 成本计算方法支持（加权平均、最新成本、先进先出）

### 2.4 数据库表定义

**SQL脚本**：`ruoyi-integration/sql/finance_schema.sql`

**包含的表**：
```
finance_orders                  # 订单表（35个字段）
finance_daily_stats             # 每日统计表（19个字段）
finance_qianchuan_config        # 千川配置表（8个字段）
finance_qianchuan_expense       # 千川推广费表（12个字段）
finance_jst_config              # 聚水潭配置表（8个字段）
finance_jst_purchase_in         # 聚水潭入库单表（15个字段）
finance_sync_log                # 同步日志表（10个字段）
finance_product_cost            # 商品成本表
finance_product_cost_history    # 商品成本历史表
```

---

## 三、租户端前端源码清单

### 3.1 前端项目结构

**路径**：`/home/ubuntu/doudian-finance-prototype/client/src/`

### 3.2 页面文件清单（40个）

#### 3.2.1 核心业务页面

**经营概览**
```
pages/Dashboard.tsx                    # 经营概览页面
pages/BusinessSummary.tsx              # 经营概览详情
pages/FinanceCommandCenter.tsx         # 财务指挥中心
```

**订单管理**
```
pages/OrderManagement.tsx              # 订单管理页面
pages/OrderDetail.tsx                  # 订单详情页面
pages/OrderReconciliation.tsx          # 订单对账页面
pages/OrderStatistics.tsx              # 订单统计页面
pages/OrderThirtyDays.tsx              # 最近30天统计
pages/OrderMonthlyStats.tsx            # 按月汇总
pages/OrderYearlyStats.tsx             # 按年汇总
```

**总账管理（7个子模块）**
```
pages/Accounting.tsx                   # 财务核算
pages/Analysis.tsx                     # 经营分析
pages/Funds.tsx                        # 资金管理
pages/Inventory.tsx                    # 库存成本
pages/Expense.tsx                      # 费用中心
pages/Tax.tsx                          # 税务管理
pages/CostConfig.tsx                   # 成本配置
```

**出纳管理（8个子模块）**
```
pages/cashier/CashierDashboard.tsx     # 出纳工作台
pages/cashier/CashierCashflow.tsx      # 资金流水
pages/cashier/CashierChannels.tsx      # 渠道管理
pages/cashier/CashierReconciliation.tsx # 平台对账
pages/cashier/CashierDifferences.tsx   # 差异分析
pages/cashier/CashierDailyReport.tsx   # 资金日报
pages/cashier/CashierMonthlyReport.tsx # 资金月报
pages/cashier/CashierShopReport.tsx    # 店铺统计
pages/cashier/CashierAlerts.tsx        # 预警通知
pages/cashier/CashierAlertRules.tsx    # 预警规则
```

**数据同步**
```
pages/DoudianSync.tsx                  # 抖店数据同步
pages/QianchuanSync.tsx                # 千川数据同步
pages/JstSync.tsx                      # 聚水潭ERP同步
```

**其他页面**
```
pages/DocumentCenter.tsx               # 单据中心
pages/DocumentLinking.tsx              # 单据关联
pages/ReconciliationDashboard.tsx      # 数据对账仪表板
pages/DoudianAuthCallback.tsx          # 抖店授权回调
pages/HelpCenter.tsx                   # 帮助中心
pages/Home.tsx                         # 首页
pages/NotFound.tsx                     # 404页面
pages/ComponentShowcase.tsx            # 组件展示
```

### 3.3 Hook文件清单（6个）

```
hooks/useDoudianAuth.ts                # 抖店OAuth授权状态管理
hooks/useDashboard.ts                  # 经营概览数据获取
hooks/useCashflow.ts                   # 资金流水数据获取
hooks/useLedger.ts                     # 总账管理数据获取
hooks/useCashier.ts                    # 出纳管理数据获取
hooks/useShopSwitcher.ts               # 店铺切换功能
```

### 3.4 组件文件清单

**布局组件**
```
components/DashboardLayout.tsx         # 仪表板布局
components/DashboardLayoutSkeleton.tsx # 加载骨架屏
components/AppLayout.tsx               # 应用布局
components/CashierLayout.tsx           # 出纳布局
```

**业务组件**
```
components/DoudianAuthPrompt.tsx       # 抖店授权提示
components/ShopSwitcher.tsx            # 店铺切换下拉菜单
components/ReconciliationIndicator.tsx # 对账状态指示器
components/ModuleReconciliationPanel.tsx # 模块对账面板
components/ReconciliationStatus.tsx    # 对账状态显示
components/CostInboundRelation.tsx     # 成本与入库关联
components/OrderManagementNav.tsx      # 订单管理导航
components/AIChatBox.tsx               # AI聊天框
components/Map.tsx                     # 地图组件
```

**UI组件库（shadcn/ui）**
```
components/ui/                         # 40+ 基础UI组件
- button, card, dialog, form, input, select, table, etc.
```

### 3.5 API路由文件清单（13个）

**后端路由（Node.js中间层）**
```
server/dashboardRouter.ts              # 经营概览API
server/orderRouter.ts                  # 订单管理API
server/ledgerRouter.ts                 # 总账管理API（42个接口）
server/cashierRouter.ts                # 出纳管理API（55个接口）
server/cashflowRouter.ts               # 资金流水CRUD API
server/costUpdateRouter.ts             # 成本更新API
server/productCostRouter.ts            # 商品成本API
server/orderSyncRouter.ts              # 抖店数据同步API
server/qianchuanRouter.ts              # 千川数据同步API
server/jstRouter.ts                    # 聚水潭ERP同步API
server/doudianRouter.ts                # 抖店授权API
server/documentRouter.ts               # 单据中心API
server/reconciliationRouter.ts         # 数据对账API
```

### 3.6 Service文件清单（9个）

```
server/doudianAuthService.ts           # 抖店OAuth授权服务
server/doudianApi.ts                   # 抖店API客户端
server/qianchuanApi.ts                 # 千川API客户端
server/jstApi.ts                       # 聚水潭ERP API客户端
server/orderSync.ts                    # 订单同步服务
server/qianchuanSyncService.ts         # 千川数据同步服务
server/jstSyncService.ts               # 聚水潭ERP同步服务
server/costUpdateService.ts            # 成本更新服务
server/reconciliation.ts               # 数据对账服务
```

---

## 四、数据库源码

### 4.1 Node.js数据库架构

**ORM框架**：Drizzle ORM
**数据库**：MySQL

**Schema定义**：`drizzle/schema.ts`

**表定义**：
```
users                                  # 用户表
doudian_auth_tokens                    # 抖店授权Token表
doudian_shops                          # 抖店店铺表
orders                                 # 订单表
cashflow                               # 资金流水表
product_costs                          # 商品成本表
cost_updates                           # 成本更新历史表
reconciliation_records                 # 对账记录表
sync_logs                              # 数据同步日志表
```

### 4.2 Java数据库架构

**ORM框架**：MyBatis
**数据库**：MySQL

**SQL脚本**：`ruoyi-integration/sql/finance_schema.sql`

**表定义**：
```
finance_orders                         # 订单表（35个字段）
finance_daily_stats                    # 每日统计表（19个字段）
finance_qianchuan_config               # 千川配置表
finance_qianchuan_expense              # 千川推广费表
finance_jst_config                     # 聚水潭配置表
finance_jst_purchase_in                # 聚水潭入库单表
finance_sync_log                       # 同步日志表
finance_product_cost                   # 商品成本表
finance_product_cost_history           # 商品成本历史表
```

---

## 五、API规范文档

### 5.1 已完成的文档

```
docs/JAVA_API_SPECIFICATION.md         # Java后端API总体规范
docs/LEDGER_MODULE_API_SPECIFICATION.md # 总账管理模块API规范（42个接口）
docs/CASHIER_MODULE_API_SPECIFICATION.md # 出纳管理模块API规范（55个接口）
```

### 5.2 前端集成指南

```
ruoyi-integration/docs/frontend-integration-guide.md
- API调用层封装（request.ts）
- API模块创建示例
- 页面组件迁移示例
- React Query集成方案
- 认证流程变更指南
```

---

## 六、现有功能实现情况

### 6.1 ✅ 已实现的功能

#### 租户端（React前端）
- ✅ 抖店OAuth授权流程
- ✅ 多店铺切换功能
- ✅ 经营概览仪表板
- ✅ 订单管理（列表、详情、统计）
- ✅ 总账管理（7个子模块的UI）
- ✅ 出纳管理（8个子模块的UI）
- ✅ 数据同步页面（抖店、千川、聚水潭）
- ✅ 单据中心
- ✅ 数据对账仪表板
- ✅ 成本配置
- ✅ 帮助中心

#### Java后端（RuoYi框架）
- ✅ 抖店API集成（配置、订单、商品、财务数据、售后）
- ✅ 订单管理API（CRUD、统计、导入）
- ✅ 商品成本API（CRUD、历史、导入）
- ✅ 数据库表定义（9个表）
- ✅ Entity、Mapper、Service、Controller层代码
- ✅ 权限管理集成
- ✅ 多租户隔离

### 6.2 ⏳ 待实现的功能

#### Java后端
- ⏳ 千川API集成（目前只有配置表定义）
- ⏳ 聚水潭ERP API集成（目前只有配置表定义）
- ⏳ 资金流水管理API
- ⏳ 对账差异处理API
- ⏳ 数据同步调度任务
- ⏳ 成本更新服务
- ⏳ 预警规则引擎

#### 租户端
- ⏳ 从tRPC迁移到RESTful API
- ⏳ 与Java后端API集成
- ⏳ 实时数据更新
- ⏳ 数据导出功能
- ⏳ 预警通知功能

#### 管理员端
- ⏳ 租户管理模块
- ⏳ 用户管理模块
- ⏳ 权限管理模块
- ⏳ 系统监控模块
- ⏳ 数据审计模块

---

## 七、技术栈总结

### 前端技术栈
- **框架**：React 19 + TypeScript
- **UI库**：shadcn/ui + Tailwind CSS 4
- **状态管理**：React Query（待迁移）
- **API调用**：tRPC（待迁移到Axios/REST）
- **路由**：Wouter
- **打包工具**：Vite

### 后端技术栈
- **框架**：RuoYi-Vue-Pro（Java Spring Boot）
- **ORM**：MyBatis
- **数据库**：MySQL
- **API文档**：Swagger 3.0
- **权限管理**：Spring Security
- **多租户**：自定义拦截器

### 中间层技术栈（待移除）
- **框架**：Node.js Express
- **RPC框架**：tRPC
- **ORM**：Drizzle ORM
- **API调用**：Axios

---

## 八、文件统计

| 类别 | 数量 | 说明 |
|-----|------|------|
| Java源代码文件 | 30 | Entity、Mapper、Service、Controller等 |
| 前端页面文件 | 40 | 业务模块页面 |
| 前端Hook文件 | 6 | 数据获取和状态管理 |
| 前端API路由 | 13 | 后端API路由定义 |
| 前端Service | 9 | 第三方API客户端 |
| UI组件 | 40+ | shadcn/ui基础组件 |
| 业务组件 | 8 | 自定义业务组件 |
| 数据库表 | 9 | MySQL数据库表 |
| 文档文件 | 25+ | API规范、集成指南等 |
| 测试文件 | 10+ | 单元测试和集成测试 |
| **总计** | **180+** | 完整的业务代码 |

---

## 九、迁移路线图

### 阶段1：完善Java后端
**目标**：实现所有业务模块的Java API
**时间**：3-5天
**任务**：
- [ ] 实现千川API集成
- [ ] 实现聚水潭ERP API集成
- [ ] 实现资金流水管理API
- [ ] 实现对账差异处理API
- [ ] 实现数据同步调度任务

### 阶段2：前端迁移
**目标**：将租户端从tRPC迁移到RESTful API
**时间**：3-5天
**任务**：
- [ ] 创建Axios请求工具
- [ ] 创建API模块
- [ ] 迁移所有页面
- [ ] 实现React Query集成

### 阶段3：管理员端开发
**目标**：基于RuoYi框架开发管理员端
**时间**：5-7天
**任务**：
- [ ] 租户管理模块
- [ ] 用户管理模块
- [ ] 权限管理模块
- [ ] 系统监控模块

### 阶段4：测试和优化
**目标**：确保系统稳定性和性能
**时间**：2-3天
**任务**：
- [ ] 功能测试
- [ ] 性能测试
- [ ] 安全测试
- [ ] 部署测试

---

## 十、快速开始指南

### 10.1 Java后端集成

**步骤1**：复制文件到RuoYi项目
```bash
# 复制Entity类
cp ruoyi-integration/java-complete/entity/*.java \
   ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/entity/

# 复制Mapper
cp ruoyi-integration/java-complete/mapper/*.java \
   ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/mapper/

# 复制Mapper XML
cp ruoyi-integration/java-complete/mapper-xml/*.xml \
   ~/flash-saas/flash-module-finance/src/main/resources/mapper/finance/

# 复制Service
cp ruoyi-integration/java-complete/service/*.java \
   ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/service/

# 复制Controller
cp ruoyi-integration/java-complete/controller/*.java \
   ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/controller/

# 复制VO
cp ruoyi-integration/java-complete/vo/*.java \
   ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/vo/

# 复制配置
cp ruoyi-integration/java-complete/config/FinanceConfig.java \
   ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/config/
```

**步骤2**：执行SQL脚本
```bash
mysql -u root -p < ruoyi-integration/sql/finance_schema.sql
```

**步骤3**：配置环境变量
```yaml
# application.yml
finance:
  doudian:
    appKey: ${DOUDIAN_APP_KEY}
    appSecret: ${DOUDIAN_APP_SECRET}
  qianchuan:
    appId: ${QIANCHUAN_APP_ID}
    appSecret: ${QIANCHUAN_APP_SECRET}
  jushuitan:
    partnerId: ${JUSHUITAN_PARTNER_ID}
    partnerSecret: ${JUSHUITAN_PARTNER_SECRET}
```

### 10.2 前端集成

**步骤1**：创建API调用层
```bash
# 参考 ruoyi-integration/docs/frontend-integration-guide.md
# 创建 client/src/utils/request.ts
# 创建 client/src/api/*.ts
```

**步骤2**：迁移页面
```bash
# 将所有页面从tRPC改为RESTful API调用
# 参考迁移指南中的示例
```

**步骤3**：配置环境变量
```env
VITE_API_BASE_URL=http://localhost:48080/app-api
```

---

**文档版本**：1.0
**最后更新**：2025年1月16日
**维护者**：Manus AI Agent
