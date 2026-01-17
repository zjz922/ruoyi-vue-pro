# 闪电帐PRO 数据勾稽关系分析报告

## 一、系统模块概览

### 1.1 总账管理模块
| 页面 | 路由 | 主要数据 |
|------|------|----------|
| 经营概览 | / | 销售额、净利润、毛利率、订单数 |
| 财务核算 | /accounting | 收入确认、成本核算、利润表 |
| 资金管理 | /funds | 资金余额、收支流水 |
| 库存成本 | /inventory | 库存价值、成本核算 |
| 经营分析 | /analysis | 利润分析、趋势分析 |
| 费用中心 | /expense | 各类费用统计 |
| 税务管理 | /tax | 应交税费计算 |

### 1.2 订单管理模块
| 页面 | 路由 | 主要数据 |
|------|------|----------|
| 订单管理 | /orders | 订单列表、订单状态 |
| 订单明细 | /order-detail | 单笔订单详情 |
| 订单统计 | /order-statistics | 日汇总统计 |
| 最近30天明细 | /order-thirty-days | 30天订单明细 |
| 按月汇总统计 | /order-monthly-stats | 月度汇总 |
| 按年汇总统计 | /order-yearly-stats | 年度汇总 |
| 成本配置 | /cost-config | 商品成本设置 |
| 单据中心 | /documents | 单据管理 |

### 1.3 出纳管理模块
| 页面 | 路由 | 主要数据 |
|------|------|----------|
| 出纳工作台 | /cashier | 今日收支概览 |
| 资金流水 | /cashier/cashflow | 资金流水明细 |
| 渠道管理 | /cashier/channels | 支付渠道配置 |
| 平台对账 | /cashier/reconciliation | 平台账单对账 |
| 差异分析 | /cashier/differences | 对账差异 |
| 资金日报 | /cashier/daily-report | 日资金报表 |
| 资金月报 | /cashier/monthly-report | 月资金报表 |
| 店铺统计 | /cashier/shop-report | 店铺维度统计 |

---

## 二、数据来源与勾稽关系分析

### 2.1 订单数据是核心数据源

**是的，订单数据是整个系统的核心数据源。** 几乎所有统计报表的数据都可以从订单数据中计算得出或与之关联。

```
┌─────────────────────────────────────────────────────────────┐
│                      订单数据（核心）                         │
│  - 订单号、下单时间、完结时间、结算时间                        │
│  - 付款金额、商品成本、服务费、佣金、运费、退款                 │
│  - 推广费、保险费、其他费用                                   │
│  - 订单状态、客户信息、商品信息                               │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌───────────┐       ┌───────────┐       ┌───────────┐
    │ 总账管理   │       │ 出纳管理   │       │ 预警中心   │
    │           │       │           │       │           │
    │ • 经营概览 │       │ • 资金日报 │       │ • 利润预警 │
    │ • 财务核算 │       │ • 资金月报 │       │ • 成本预警 │
    │ • 费用中心 │       │ • 平台对账 │       │ • 退款预警 │
    │ • 税务管理 │       │ • 差异分析 │       │           │
    └───────────┘       └───────────┘       └───────────┘
```

### 2.2 各模块数据勾稽关系

#### 经营概览（Dashboard）
| 指标 | 订单数据来源 | 计算公式 |
|------|-------------|----------|
| 总营收 | 订单.付款金额 | SUM(付款金额) |
| 总毛利 | 订单.付款金额 - 订单.商品成本 | SUM(付款金额 - 商品成本) |
| 净利润 | 订单利润 | SUM(预估收益) |
| 订单数 | 订单记录 | COUNT(订单) |

#### 财务核算（Accounting）
| 指标 | 订单数据来源 | 计算公式 |
|------|-------------|----------|
| 营业收入 | 订单.付款金额 | SUM(付款金额) - SUM(退款) |
| 营业成本 | 订单.商品成本 | SUM(商品成本) |
| 毛利润 | 收入 - 成本 | 营业收入 - 营业成本 |
| 销售费用 | 订单.推广费 + 订单.佣金 | SUM(推广费 + 达人佣金) |
| 管理费用 | 订单.服务费 | SUM(服务费) |
| 财务费用 | 订单.其他费用 | SUM(其他费用) |

#### 费用中心（Expense）
| 费用类型 | 订单数据来源 |
|---------|-------------|
| 推广费用 | 订单.推广费 |
| 物流费用 | 订单.运费 |
| 平台服务费 | 订单.服务费 |
| 达人佣金 | 订单.达人佣金 |
| 运费险 | 订单.运费险 |
| 赔付费用 | 订单.赔付 |

#### 资金日报/月报
| 指标 | 订单数据来源 |
|------|-------------|
| 销售收入 | 订单.付款金额（按结算时间） |
| 退款支出 | 订单.退款 |
| 平台扣款 | 订单.服务费 + 订单.佣金 |
| 推广支出 | 订单.推广费 |
| 物流支出 | 订单.运费 |

#### 平台对账
| 对账项 | 订单数据 | 平台账单 |
|--------|---------|---------|
| 销售额 | SUM(付款金额) | 平台销售流水 |
| 退款额 | SUM(退款) | 平台退款流水 |
| 服务费 | SUM(服务费) | 平台扣费明细 |
| 结算额 | SUM(设置金额) | 平台结算金额 |

---

## 三、实现完整数据勾稽所需资料

### 3.1 必须提供的核心资料

#### A. 订单数据结构（最重要）
需要提供订单数据的完整字段定义和示例数据：

```typescript
interface Order {
  // 基础信息
  orderId: string;           // 订单号
  subOrderId?: string;       // 子订单号
  shopId: string;            // 店铺ID
  shopName: string;          // 店铺名称
  
  // 时间信息
  createTime: Date;          // 下单时间
  payTime?: Date;            // 付款时间
  shipTime?: Date;           // 发货时间
  completeTime?: Date;       // 完结时间
  settleTime?: Date;         // 结算时间
  
  // 状态信息
  status: string;            // 订单状态
  statusDetail?: string;     // 状态详情
  
  // 金额信息
  payAmount: number;         // 付款金额
  productCost: number;       // 商品成本
  serviceFee: number;        // 服务费
  commission: number;        // 达人佣金
  freight: number;           // 运费
  freightInsurance: number;  // 运费险
  refund: number;            // 退款金额
  promotion: number;         // 推广费
  compensation: number;      // 赔付
  otherFee: number;          // 其他费用
  settleAmount: number;      // 结算金额
  estimatedProfit: number;   // 预估收益
  
  // 商品信息
  productId: string;         // 商品ID
  productName: string;       // 商品名称
  quantity: number;          // 数量
  
  // 客户信息
  customerName: string;      // 客户姓名（脱敏）
  province: string;          // 省份
  city: string;              // 城市
}
```

#### B. 平台账单数据（对账必需）
```typescript
interface PlatformBill {
  billId: string;            // 账单ID
  billDate: Date;            // 账单日期
  billType: string;          // 账单类型
  orderId?: string;          // 关联订单号
  amount: number;            // 金额
  feeType: string;           // 费用类型
  remark: string;            // 备注
}
```

#### C. 商品成本配置
```typescript
interface ProductCost {
  productId: string;         // 商品ID
  productName: string;       // 商品名称
  sku: string;               // SKU
  purchaseCost: number;      // 采购成本
  packagingCost: number;     // 包装成本
  otherCost: number;         // 其他成本
  totalCost: number;         // 总成本
  effectiveDate: Date;       // 生效日期
}
```

### 3.2 可选但建议提供的资料

#### D. 店铺配置信息
```typescript
interface Shop {
  shopId: string;            // 店铺ID
  shopName: string;          // 店铺名称
  platform: string;          // 平台（抖音/快手等）
  category: string;          // 类目
  taxRate: number;           // 适用税率
}
```

#### E. 渠道配置信息
```typescript
interface PaymentChannel {
  channelId: string;         // 渠道ID
  channelName: string;       // 渠道名称（抖音支付/支付宝/微信）
  feeRate: number;           // 手续费率
}
```

#### F. 推广数据（如需精细化分析）
```typescript
interface PromotionData {
  date: Date;                // 日期
  campaignId: string;        // 推广计划ID
  campaignName: string;      // 推广计划名称
  cost: number;              // 花费
  impressions: number;       // 曝光
  clicks: number;            // 点击
  orders: number;            // 成交订单数
  gmv: number;               // 成交金额
}
```

### 3.3 数据接入方式建议

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **API对接** | 通过抖店开放平台API获取数据 | 生产环境，实时数据 |
| **Excel导入** | 从抖店后台导出Excel后导入 | 原型演示，历史数据 |
| **数据库直连** | 连接已有ERP/财务系统数据库 | 已有系统集成 |

---

## 四、实现步骤建议

### 第一阶段：数据模型设计
1. 确认订单数据字段（需要您提供实际字段）
2. 设计数据库表结构
3. 建立字段映射关系

### 第二阶段：数据导入
1. 开发数据导入功能（Excel/API）
2. 数据清洗和校验
3. 历史数据迁移

### 第三阶段：报表计算
1. 实现各报表的计算逻辑
2. 建立数据勾稽校验
3. 异常数据预警

### 第四阶段：对账功能
1. 平台账单导入
2. 自动对账匹配
3. 差异分析报告

---

## 五、您需要提供的资料清单

### 必须提供（优先级：高）
- [ ] **订单数据样例**：导出一份真实订单数据（可脱敏），包含所有字段
- [ ] **字段说明文档**：每个字段的含义、数据类型、取值范围
- [ ] **业务规则说明**：各种费用的计算规则、结算周期等

### 建议提供（优先级：中）
- [ ] **平台账单样例**：抖店后台导出的账单文件
- [ ] **商品成本表**：商品SKU与成本的对应关系
- [ ] **店铺列表**：需要管理的店铺信息

### 可选提供（优先级：低）
- [ ] **推广数据**：如需推广ROI分析
- [ ] **历史报表**：用于数据校验对比
- [ ] **特殊业务场景说明**：如有特殊的订单类型或费用类型

---

## 六、总结

**核心结论**：是的，闪电帐PRO系统的所有统计报表数据都可以从订单数据中计算得出。订单数据是整个系统的"单一数据源"（Single Source of Truth）。

**实现关键**：
1. 订单数据结构的完整性决定了报表的丰富程度
2. 数据勾稽的准确性依赖于字段定义的清晰
3. 平台对账需要额外的账单数据配合

**下一步**：请您提供订单数据的实际字段结构和样例数据，我将据此设计完整的数据模型和勾稽逻辑。
