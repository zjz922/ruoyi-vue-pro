# 租户端全模块数据勾稽分析方案

**文档版本**：v1.0  
**创建日期**：2025-01-16  
**适用项目**：闪电帐PRO SAAS系统 - 租户端

---

## 一、概述

本文档对租户端所有模块页面进行全面分析，确保每个模块的数据都与抖店订单、千川、聚水潭API建立勾稽关联。所有数值通过Java后端API统计分析汇总后存储到数据库，租户端页面进行显示。

### 1.1 架构原则

根据《架构原则文档》(ARCHITECTURE_PRINCIPLES.md)的规定：

1. **数据库操作由Java后端实现**：所有读取数据库相关功能都由Java后端实现
2. **前端只负责API调用**：React租户端和Vue3管理员端只负责调用Java后端API
3. **Node.js中间层只做API转发**：不直接操作数据库

### 1.2 数据流转架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           租户端页面 (React)                                 │
│  FinanceCommandCenter / Accounting / Funds / Inventory / Analysis / ...     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ tRPC调用
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Node.js中间层 (tRPC Router)                           │
│  ledgerRouter / orderRouter / cashierRouter / qianchuanRouter / jstRouter   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ HTTP API调用
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Java后端 (RuoYi-Vue-Pro)                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Controller层                                  │    │
│  │  FinanceAccountingController / FinanceFundsController / ...         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Service层                                     │    │
│  │  数据勾稽计算 / 统计分析汇总 / 业务逻辑处理                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Mapper层 (MyBatis)                            │    │
│  │  数据库CRUD操作 / 复杂SQL查询                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
            │   抖店API    │   │   千川API    │   │  聚水潭API   │
            │  订单/商品   │   │  推广费用    │   │  入库/仓储   │
            └─────────────┘   └─────────────┘   └─────────────┘
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌─────────────────────────────────────────────────┐
            │                    MySQL数据库                   │
            │  orders / qianchuan_cost / jst_purchase_in ...  │
            └─────────────────────────────────────────────────┘
```

---

## 二、租户端模块清单与数据勾稽关系

### 2.1 总账管理模块（7个页面）

#### 2.1.1 经营概览（FinanceCommandCenter）

**页面功能**：核心仪表盘，展示店铺整体经营状况

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 总销售额 | SUM(payment_amount) | 抖店订单API | /api/finance/dashboard/overview |
| 订单数量 | COUNT(order_id) | 抖店订单API | /api/finance/dashboard/overview |
| 毛利润 | 销售额 - 商品成本 - 各项费用 | 综合计算 | /api/finance/dashboard/overview |
| 毛利率 | 毛利润 / 销售额 × 100% | 综合计算 | /api/finance/dashboard/overview |
| 推广费用 | SUM(cost) | 千川推广API | /api/finance/dashboard/overview |
| 物流费用 | SUM(shipping_fee) | 抖店订单API | /api/finance/dashboard/overview |
| 达人佣金 | SUM(commission_amount) | 抖店订单API | /api/finance/dashboard/overview |
| 平台服务费 | SUM(service_fee) | 抖店订单API | /api/finance/dashboard/overview |
| 趋势数据 | 按日期分组汇总 | 综合计算 | /api/finance/dashboard/trends |
| 预警信息 | 规则触发检测 | 系统计算 | /api/finance/dashboard/alerts |

**数据勾稽规则**：
- 总销售额 = 财务核算.销售收入 = 资金管理.订单收入
- 推广费用 = 费用中心.推广费用 = 千川同步.消耗金额
- 毛利润 = 财务核算.毛利润 = 经营分析.利润

---

#### 2.1.2 财务核算（Accounting）

**页面功能**：收入确认、成本核算、利润分析

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 营业收入 | SUM(payment_amount) | 抖店订单API | /api/finance/accounting/income |
| 退款金额 | SUM(refund_amount) | 抖店订单API | /api/finance/accounting/income |
| 净销售额 | 营业收入 - 退款金额 | 计算字段 | /api/finance/accounting/income |
| 商品成本 | SUM(cost_price × qty) | 聚水潭ERP API | /api/finance/accounting/cost |
| 达人佣金 | SUM(commission_amount) | 抖店订单API | /api/finance/accounting/expense |
| 平台服务费 | SUM(service_fee) | 抖店订单API | /api/finance/accounting/expense |
| 推广费用 | SUM(cost) | 千川推广API | /api/finance/accounting/expense |
| 快递费用 | SUM(shipping_fee) | 抖店订单API | /api/finance/accounting/expense |
| 保险费用 | SUM(insurance_fee) | 抖店订单API | /api/finance/accounting/expense |
| 售后赔付 | SUM(after_sale_amount) | 抖店订单API | /api/finance/accounting/expense |
| 毛利润 | 净销售额 - 商品成本 | 计算字段 | /api/finance/accounting/profit |
| 净利润 | 毛利润 - 各项费用 | 计算字段 | /api/finance/accounting/profit |
| 利润表 | 按科目分类汇总 | 综合计算 | /api/finance/accounting/statement |
| 资产负债表 | 资产=负债+所有者权益 | 综合计算 | /api/finance/accounting/balance |
| 现金流量表 | 经营/投资/筹资活动 | 综合计算 | /api/finance/accounting/cashflow |

**数据勾稽规则**：
- 营业收入 = 经营概览.总销售额 = 资金管理.订单收入
- 商品成本 = 库存成本.销售成本 = 聚水潭入库金额按SKU匹配
- 推广费用 = 千川同步.消耗金额 = 费用中心.推广费用
- 净利润 = 经营分析.利润 = 经营概览.毛利润（调整后）

---

#### 2.1.3 资金管理（Funds）

**页面功能**：资金流入流出、余额管理、资金预测

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 订单收入 | SUM(payment_amount) | 抖店订单API | /api/finance/funds/inflow |
| 退款支出 | SUM(refund_amount) | 抖店订单API | /api/finance/funds/outflow |
| 推广支出 | SUM(cost) | 千川推广API | /api/finance/funds/outflow |
| 采购支出 | SUM(total_amount) | 聚水潭ERP API | /api/finance/funds/outflow |
| 佣金支出 | SUM(commission_amount) | 抖店订单API | /api/finance/funds/outflow |
| 服务费支出 | SUM(service_fee) | 抖店订单API | /api/finance/funds/outflow |
| 快递费支出 | SUM(shipping_fee) | 抖店订单API | /api/finance/funds/outflow |
| 资金净流入 | 总流入 - 总流出 | 计算字段 | /api/finance/funds/netflow |
| 账户余额 | 各账户余额汇总 | 抖店/千川API | /api/finance/funds/balance |
| 资金预测 | 基于历史数据预测 | 系统计算 | /api/finance/funds/forecast |
| 资金流水 | 按时间排序的交易记录 | 综合数据 | /api/finance/funds/transactions |

**数据勾稽规则**：
- 订单收入 = 财务核算.营业收入 = 经营概览.总销售额
- 推广支出 = 千川同步.消耗金额 = 财务核算.推广费用
- 采购支出 = 聚水潭入库.总金额 = 库存成本.采购成本
- 资金净流入 = 经营概览.毛利润（现金口径）

---

#### 2.1.4 库存成本（Inventory）

**页面功能**：SKU成本追踪、成本波动预警、周转分析

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 入库数量 | SUM(qty) | 聚水潭ERP API | /api/finance/inventory/inbound |
| 入库金额 | SUM(total_amount) | 聚水潭ERP API | /api/finance/inventory/inbound |
| 平均成本 | 入库金额 / 入库数量 | 计算字段 | /api/finance/inventory/cost |
| 销售数量 | COUNT(order_id) × quantity | 抖店订单API | /api/finance/inventory/sales |
| 销售成本 | 销售数量 × 平均成本 | 计算字段 | /api/finance/inventory/cost |
| 库存周转率 | 销售成本 / 平均库存 | 计算字段 | /api/finance/inventory/turnover |
| 库存周转天数 | 365 / 库存周转率 | 计算字段 | /api/finance/inventory/turnover |
| SKU成本列表 | 按SKU分组的成本明细 | 聚水潭+抖店 | /api/finance/inventory/sku-list |
| 成本预警 | 成本变动超阈值 | 系统计算 | /api/finance/inventory/alerts |
| 库龄分布 | 按入库时间分组 | 聚水潭ERP API | /api/finance/inventory/age |

**数据勾稽规则**：
- 入库金额 = 聚水潭入库单.总金额 = 资金管理.采购支出
- 销售数量 = 抖店订单.商品数量 = 订单管理.商品数量
- 销售成本 = 财务核算.商品成本 = 费用中心.商品成本
- SKU成本 = 聚水潭入库明细.成本单价 = 成本配置.商品成本

---

#### 2.1.5 经营分析（Analysis）

**页面功能**：ROI分析、盈亏平衡、趋势分析

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 推广ROI | 成交金额 / 推广费用 | 千川推广API | /api/finance/analysis/roi |
| 订单ROI | 净利润 / 总投入 | 综合计算 | /api/finance/analysis/roi |
| 点击率 | 点击数 / 展示数 | 千川推广API | /api/finance/analysis/conversion |
| 转化率 | 转化数 / 点击数 | 千川推广API | /api/finance/analysis/conversion |
| 客单价 | 销售收入 / 订单数 | 抖店订单API | /api/finance/analysis/metrics |
| 复购率 | 复购客户数 / 总客户数 | 抖店订单API | /api/finance/analysis/metrics |
| 盈亏平衡点 | 固定成本 / (1 - 变动成本率) | 综合计算 | /api/finance/analysis/breakeven |
| 利润趋势 | 按日/周/月汇总利润 | 综合计算 | /api/finance/analysis/trends |
| 渠道ROI | 按渠道分组的ROI | 千川+抖店 | /api/finance/analysis/channel-roi |
| 商品贡献 | 按商品分组的利润贡献 | 综合计算 | /api/finance/analysis/contribution |

**数据勾稽规则**：
- 推广ROI = 千川同步.ROI = 成交金额/消耗金额
- 成交金额 = 千川同步.成交金额 ≈ 抖店订单.推广订单金额
- 净利润 = 财务核算.净利润 = 经营概览.毛利润
- 客单价 = 财务核算.营业收入 / 订单管理.订单数量

---

#### 2.1.6 费用中心（Expense）

**页面功能**：多维度费用分摊、预算预警、费用分析

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 推广费用 | SUM(cost) | 千川推广API | /api/finance/expense/breakdown |
| 达人佣金 | SUM(commission_amount) | 抖店订单API | /api/finance/expense/breakdown |
| 平台服务费 | SUM(service_fee) | 抖店订单API | /api/finance/expense/breakdown |
| 快递费用 | SUM(shipping_fee) | 抖店订单API | /api/finance/expense/breakdown |
| 保险费用 | SUM(insurance_fee) | 抖店订单API | /api/finance/expense/breakdown |
| 售后赔付 | SUM(after_sale_amount) | 抖店订单API | /api/finance/expense/breakdown |
| 采购费用 | SUM(total_amount) | 聚水潭ERP API | /api/finance/expense/breakdown |
| 仓储费用 | SUM(storage_fee) | 聚水潭ERP API | /api/finance/expense/breakdown |
| 总费用 | 各项费用之和 | 综合计算 | /api/finance/expense/total |
| 费用率 | 总费用 / 销售收入 | 综合计算 | /api/finance/expense/rate |
| 预算使用 | 已用预算 / 总预算 | 系统配置 | /api/finance/expense/budget |
| 费用分摊 | 按店铺/商品/渠道分摊 | 综合计算 | /api/finance/expense/allocation |
| 异常检测 | 超预算/异常波动 | 系统计算 | /api/finance/expense/anomaly |

**数据勾稽规则**：
- 推广费用 = 千川同步.消耗金额 = 财务核算.推广费用
- 达人佣金 = 抖店订单.佣金 = 财务核算.达人佣金
- 采购费用 = 聚水潭入库.总金额 = 资金管理.采购支出
- 总费用 = 财务核算.营业费用 = 经营概览.费用合计

---

#### 2.1.7 税务管理（Tax）

**页面功能**：税负率分析、风险预警、税务报表

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 销售收入 | SUM(payment_amount) | 抖店订单API | /api/finance/tax/revenue |
| 销项税额 | 销售收入 × 税率 / (1 + 税率) | 计算字段 | /api/finance/tax/output |
| 采购金额 | SUM(total_amount) | 聚水潭ERP API | /api/finance/tax/purchase |
| 进项税额 | 采购金额 × 税率 / (1 + 税率) | 计算字段 | /api/finance/tax/input |
| 应纳税额 | 销项税额 - 进项税额 | 计算字段 | /api/finance/tax/payable |
| 税负率 | 应纳税额 / 销售收入 | 计算字段 | /api/finance/tax/burden |
| 增值税明细 | 按月汇总的增值税 | 综合计算 | /api/finance/tax/vat |
| 附加税 | 增值税 × 附加税率 | 计算字段 | /api/finance/tax/additional |
| 税务预警 | 税负率异常检测 | 系统计算 | /api/finance/tax/alerts |
| 税务趋势 | 按月的税负变化 | 综合计算 | /api/finance/tax/trends |

**数据勾稽规则**：
- 销售收入 = 财务核算.营业收入 = 经营概览.总销售额
- 采购金额 = 聚水潭入库.总金额 = 库存成本.入库金额
- 销项税额 = 销售收入 × 13% / 1.13（一般纳税人）
- 进项税额 = 采购金额 × 13% / 1.13（一般纳税人）

---

### 2.2 订单管理模块（8个页面）

#### 2.2.1 订单管理（OrderManagement）

**页面功能**：订单列表查询、筛选、导出

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 订单列表 | 分页查询订单 | 抖店订单API | /api/order/list |
| 订单总数 | COUNT(order_id) | 抖店订单API | /api/order/count |
| 订单金额 | SUM(payment_amount) | 抖店订单API | /api/order/amount |
| 订单状态 | 按状态分组统计 | 抖店订单API | /api/order/status |
| 订单搜索 | 按条件筛选 | 数据库查询 | /api/order/search |

**数据勾稽规则**：
- 订单数据 = 抖店同步.订单数据 = 数据库.orders表
- 订单金额 = 财务核算.营业收入 = 经营概览.总销售额

---

#### 2.2.2 订单明细（OrderDetail）

**页面功能**：单个订单详情查看

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 订单基本信息 | 订单号/时间/状态 | 抖店订单API | /api/order/detail |
| 商品信息 | SKU/数量/单价 | 抖店订单API | /api/order/detail |
| 收货信息 | 收件人/地址/电话 | 抖店订单API | /api/order/detail |
| 费用明细 | 各项费用拆分 | 抖店订单API | /api/order/detail |
| 成本信息 | 商品成本/利润 | 聚水潭+计算 | /api/order/cost |
| 物流信息 | 快递单号/轨迹 | 抖店订单API | /api/order/logistics |

**数据勾稽规则**：
- 商品成本 = 成本配置.商品成本 = 聚水潭入库.成本单价
- 订单利润 = 订单金额 - 商品成本 - 各项费用

---

#### 2.2.3 订单统计（OrderStatistics）

**页面功能**：订单汇总统计分析

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 订单趋势 | 按日期分组统计 | 抖店订单API | /api/order/statistics/trend |
| 状态分布 | 按状态分组统计 | 抖店订单API | /api/order/statistics/status |
| 渠道分布 | 按渠道分组统计 | 抖店订单API | /api/order/statistics/channel |
| 地区分布 | 按省份分组统计 | 抖店订单API | /api/order/statistics/region |
| 商品排行 | 按销量排序 | 抖店订单API | /api/order/statistics/product |

**数据勾稽规则**：
- 订单总数 = 订单管理.订单总数 = 经营概览.订单数量
- 订单金额 = 订单管理.订单金额 = 财务核算.营业收入

---

#### 2.2.4 最近30天明细（OrderThirtyDays）

**页面功能**：近30天订单明细查看

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 每日订单数 | COUNT(order_id) GROUP BY date | 抖店订单API | /api/order/thirty-days |
| 每日销售额 | SUM(payment_amount) GROUP BY date | 抖店订单API | /api/order/thirty-days |
| 每日利润 | 销售额 - 成本 - 费用 | 综合计算 | /api/order/thirty-days |
| 每日退款 | SUM(refund_amount) GROUP BY date | 抖店订单API | /api/order/thirty-days |

**数据勾稽规则**：
- 每日数据 = 经营概览.趋势数据 = 每日统计汇总表

---

#### 2.2.5 按月汇总统计（OrderMonthlyStats）

**页面功能**：月度订单统计汇总

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 月度订单数 | COUNT(order_id) GROUP BY month | 抖店订单API | /api/order/monthly |
| 月度销售额 | SUM(payment_amount) GROUP BY month | 抖店订单API | /api/order/monthly |
| 月度利润 | 销售额 - 成本 - 费用 | 综合计算 | /api/order/monthly |
| 月度同比 | (本月 - 去年同月) / 去年同月 | 计算字段 | /api/order/monthly |
| 月度环比 | (本月 - 上月) / 上月 | 计算字段 | /api/order/monthly |

**数据勾稽规则**：
- 月度销售额 = 财务核算.月度营业收入 = 税务管理.月度销售收入

---

#### 2.2.6 按年汇总统计（OrderYearlyStats）

**页面功能**：年度订单统计汇总

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 年度订单数 | COUNT(order_id) GROUP BY year | 抖店订单API | /api/order/yearly |
| 年度销售额 | SUM(payment_amount) GROUP BY year | 抖店订单API | /api/order/yearly |
| 年度利润 | 销售额 - 成本 - 费用 | 综合计算 | /api/order/yearly |
| 年度同比 | (本年 - 去年) / 去年 | 计算字段 | /api/order/yearly |

**数据勾稽规则**：
- 年度销售额 = 财务核算.年度营业收入 = 税务管理.年度销售收入

---

#### 2.2.7 成本配置（CostConfig）

**页面功能**：商品成本设置和管理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| SKU列表 | 商品SKU清单 | 抖店商品API | /api/product-cost/list |
| 商品成本 | 手动配置/自动同步 | 聚水潭ERP API | /api/product-cost/cost |
| 成本历史 | 成本变更记录 | 数据库 | /api/product-cost/history |
| 批量导入 | Excel批量导入 | 用户上传 | /api/product-cost/import |
| 批量更新 | 批量修改成本 | 用户操作 | /api/product-cost/batch-update |

**数据勾稽规则**：
- 商品成本 = 聚水潭入库.成本单价（优先）= 手动配置成本
- 成本数据用于：财务核算.商品成本、库存成本.销售成本、订单明细.成本信息

---

#### 2.2.8 单据中心（DocumentCenter）

**页面功能**：配货单、出库单、入库单管理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 单据列表 | 分页查询单据 | 数据库 | /api/document/list |
| 配货单 | 订单配货信息 | 抖店+聚水潭 | /api/document/picking |
| 出库单 | 商品出库记录 | 聚水潭ERP API | /api/document/outbound |
| 入库单 | 商品入库记录 | 聚水潭ERP API | /api/document/inbound |
| 退货单 | 退货处理记录 | 抖店订单API | /api/document/return |

**数据勾稽规则**：
- 入库单 = 聚水潭同步.入库单 = 库存成本.入库数据
- 出库单 = 订单发货数据 = 抖店订单.发货信息

---

### 2.3 出纳管理模块（10个页面）

#### 2.3.1 出纳工作台（CashierDashboard）

**页面功能**：出纳核心工作概览

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 今日收入 | SUM(payment_amount) WHERE date=today | 抖店订单API | /api/cashier/dashboard |
| 今日支出 | SUM(各项费用) WHERE date=today | 综合计算 | /api/cashier/dashboard |
| 待处理事项 | 待对账/待审批数量 | 系统计算 | /api/cashier/dashboard |
| 资金余额 | 各账户余额汇总 | 抖店/千川API | /api/cashier/dashboard |
| 预警数量 | 未处理预警数 | 系统计算 | /api/cashier/dashboard |

**数据勾稽规则**：
- 今日收入 = 资金管理.今日流入 = 经营概览.今日销售额
- 资金余额 = 资金管理.账户余额

---

#### 2.3.2 资金流水（CashierCashflow）

**页面功能**：收支明细查询

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 流水列表 | 分页查询交易记录 | 综合数据 | /api/cashier/cashflow/list |
| 收入流水 | 筛选收入类型 | 抖店订单API | /api/cashier/cashflow/income |
| 支出流水 | 筛选支出类型 | 千川+聚水潭 | /api/cashier/cashflow/expense |
| 流水汇总 | 按日期/类型汇总 | 综合计算 | /api/cashier/cashflow/summary |

**数据勾稽规则**：
- 收入流水 = 抖店订单.结算金额 = 资金管理.订单收入
- 支出流水 = 千川消耗 + 聚水潭采购 + 各项费用

---

#### 2.3.3 渠道管理（CashierChannels）

**页面功能**：支付渠道配置和管理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 渠道列表 | 支付渠道清单 | 系统配置 | /api/cashier/channels/list |
| 渠道余额 | 各渠道账户余额 | 抖店/千川API | /api/cashier/channels/balance |
| 渠道流水 | 按渠道分组的流水 | 综合数据 | /api/cashier/channels/flow |
| 渠道统计 | 按渠道的收支统计 | 综合计算 | /api/cashier/channels/stats |

**数据勾稽规则**：
- 抖店渠道余额 = 抖店API.账户余额
- 千川渠道余额 = 千川API.账户余额

---

#### 2.3.4 平台对账（CashierReconciliation）

**页面功能**：平台数据对账

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 对账任务 | 对账任务列表 | 系统生成 | /api/cashier/reconciliation/list |
| 抖店对账 | 抖店订单数据核对 | 抖店订单API | /api/cashier/reconciliation/doudian |
| 千川对账 | 千川消耗数据核对 | 千川推广API | /api/cashier/reconciliation/qianchuan |
| 聚水潭对账 | 聚水潭入库数据核对 | 聚水潭ERP API | /api/cashier/reconciliation/jst |
| 对账结果 | 对账差异明细 | 系统计算 | /api/cashier/reconciliation/result |

**数据勾稽规则**：
- 系统订单金额 = 抖店API.订单金额（允许0.01元误差）
- 系统推广费 = 千川API.消耗金额（允许0.01元误差）
- 系统入库金额 = 聚水潭API.入库金额（允许0.01元误差）

---

#### 2.3.5 差异分析（CashierDifferences）

**页面功能**：对账差异处理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 差异列表 | 未处理差异清单 | 对账结果 | /api/cashier/differences/list |
| 差异详情 | 单条差异明细 | 对账结果 | /api/cashier/differences/detail |
| 差异处理 | 处理差异记录 | 用户操作 | /api/cashier/differences/handle |
| 差异统计 | 差异汇总分析 | 系统计算 | /api/cashier/differences/stats |

**数据勾稽规则**：
- 差异 = 系统数据 - API数据
- 差异处理后需更新相关模块数据

---

#### 2.3.6 资金日报（CashierDailyReport）

**页面功能**：每日资金报表

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 日收入 | SUM(payment_amount) | 抖店订单API | /api/cashier/report/daily |
| 日支出 | SUM(各项费用) | 综合计算 | /api/cashier/report/daily |
| 日净流入 | 日收入 - 日支出 | 计算字段 | /api/cashier/report/daily |
| 日期末余额 | 期初余额 + 日净流入 | 计算字段 | /api/cashier/report/daily |

**数据勾稽规则**：
- 日收入 = 经营概览.日销售额 = 财务核算.日营业收入
- 日支出 = 费用中心.日费用合计

---

#### 2.3.7 资金月报（CashierMonthlyReport）

**页面功能**：月度资金报表

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 月收入 | SUM(payment_amount) GROUP BY month | 抖店订单API | /api/cashier/report/monthly |
| 月支出 | SUM(各项费用) GROUP BY month | 综合计算 | /api/cashier/report/monthly |
| 月净流入 | 月收入 - 月支出 | 计算字段 | /api/cashier/report/monthly |
| 月末余额 | 期初余额 + 月净流入 | 计算字段 | /api/cashier/report/monthly |

**数据勾稽规则**：
- 月收入 = 订单月度统计.月销售额 = 财务核算.月营业收入
- 月支出 = 费用中心.月费用合计

---

#### 2.3.8 店铺统计（CashierShopReport）

**页面功能**：按店铺维度的资金统计

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 店铺列表 | 已授权店铺清单 | 抖店授权 | /api/cashier/shop/list |
| 店铺收入 | SUM(payment_amount) GROUP BY shop | 抖店订单API | /api/cashier/shop/income |
| 店铺支出 | SUM(各项费用) GROUP BY shop | 综合计算 | /api/cashier/shop/expense |
| 店铺利润 | 店铺收入 - 店铺支出 | 计算字段 | /api/cashier/shop/profit |

**数据勾稽规则**：
- 各店铺收入之和 = 经营概览.总销售额 = 财务核算.营业收入

---

#### 2.3.9 待处理预警（CashierAlerts）

**页面功能**：预警列表和处理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 预警列表 | 未处理预警清单 | 系统生成 | /api/cashier/alerts/list |
| 预警详情 | 单条预警明细 | 系统生成 | /api/cashier/alerts/detail |
| 预警处理 | 处理预警记录 | 用户操作 | /api/cashier/alerts/handle |
| 预警统计 | 预警汇总分析 | 系统计算 | /api/cashier/alerts/stats |

**数据勾稽规则**：
- 预警数据来源于各模块的异常检测
- 预警处理后需更新相关模块状态

---

#### 2.3.10 预警规则（CashierAlertRules）

**页面功能**：预警规则配置

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 规则列表 | 预警规则清单 | 系统配置 | /api/cashier/alert-rules/list |
| 规则配置 | 规则参数设置 | 用户配置 | /api/cashier/alert-rules/config |
| 规则启停 | 规则状态切换 | 用户操作 | /api/cashier/alert-rules/toggle |

**数据勾稽规则**：
- 规则触发条件关联各模块数据指标

---

### 2.4 数据同步模块（6个页面）

#### 2.4.1 抖店同步（DoudianSync）

**页面功能**：抖店数据同步管理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 同步状态 | 最后同步时间/状态 | 系统记录 | /api/doudian/sync/status |
| 同步日志 | 同步任务执行记录 | 系统记录 | /api/doudian/sync/logs |
| 手动同步 | 触发手动同步 | 用户操作 | /api/doudian/sync/trigger |
| 同步配置 | 同步参数设置 | 用户配置 | /api/doudian/sync/config |

**数据勾稽规则**：
- 同步数据写入orders表
- 同步后更新daily_stats表

---

#### 2.4.2 千川同步（QianchuanSync）

**页面功能**：千川数据同步管理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 同步状态 | 最后同步时间/状态 | 系统记录 | /api/qianchuan/sync/status |
| 同步日志 | 同步任务执行记录 | 系统记录 | /api/qianchuan/sync/logs |
| 手动同步 | 触发手动同步 | 用户操作 | /api/qianchuan/sync/trigger |
| 同步配置 | 同步参数设置 | 用户配置 | /api/qianchuan/sync/config |

**数据勾稽规则**：
- 同步数据写入qianchuan_cost表
- 同步后更新daily_stats.promotionFee字段

---

#### 2.4.3 聚水潭同步（JstSync）

**页面功能**：聚水潭数据同步管理

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 同步状态 | 最后同步时间/状态 | 系统记录 | /api/jst/sync/status |
| 同步日志 | 同步任务执行记录 | 系统记录 | /api/jst/sync/logs |
| 手动同步 | 触发手动同步 | 用户操作 | /api/jst/sync/trigger |
| 同步配置 | 同步参数设置 | 用户配置 | /api/jst/sync/config |

**数据勾稽规则**：
- 同步数据写入jst_purchase_in表和jst_purchase_in_item表
- 同步后更新product_costs表的成本数据

---

#### 2.4.4 对账看板（ReconciliationDashboard）

**页面功能**：数据对账总览

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 对账概览 | 各平台对账状态 | 系统计算 | /api/reconciliation/dashboard |
| 差异汇总 | 各平台差异统计 | 系统计算 | /api/reconciliation/summary |
| 对账趋势 | 历史对账结果 | 系统记录 | /api/reconciliation/trends |

**数据勾稽规则**：
- 汇总抖店、千川、聚水潭三个平台的对账结果

---

#### 2.4.5 订单对账（OrderReconciliation）

**页面功能**：订单级别对账

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 订单对账列表 | 订单对账明细 | 抖店+系统 | /api/reconciliation/orders |
| 对账差异 | 系统数据 - API数据 | 计算字段 | /api/reconciliation/orders/diff |
| 差异处理 | 处理对账差异 | 用户操作 | /api/reconciliation/orders/handle |

**数据勾稽规则**：
- 系统订单数据 = 抖店API订单数据（允许0.01元误差）

---

#### 2.4.6 单据关联（DocumentLinking）

**页面功能**：单据与订单关联

| 数据指标 | 计算公式 | 数据来源 | API接口 |
|---------|---------|---------|---------|
| 关联列表 | 单据订单关联清单 | 系统记录 | /api/document/linking/list |
| 自动关联 | 系统自动匹配 | 系统计算 | /api/document/linking/auto |
| 手动关联 | 用户手动关联 | 用户操作 | /api/document/linking/manual |

**数据勾稽规则**：
- 入库单关联采购订单
- 出库单关联销售订单
- 退货单关联退款订单

---

## 三、数据勾稽验证规则

### 3.1 跨模块数据一致性验证

| 验证规则 | 验证内容 | 容差范围 | 验证频率 |
|---------|---------|---------|---------|
| 收入一致性 | 经营概览.总销售额 = 财务核算.营业收入 = 资金管理.订单收入 = 订单统计.订单金额 | 0.01元 | 实时 |
| 成本一致性 | 财务核算.商品成本 = 库存成本.销售成本 = 费用中心.商品成本 | 0.01元 | 实时 |
| 推广费一致性 | 千川同步.消耗金额 = 财务核算.推广费用 = 费用中心.推广费用 = 经营分析.推广费用 | 0.01元 | 实时 |
| 利润一致性 | 财务核算.净利润 = 经营分析.利润 = 经营概览.毛利润（调整后） | 0.01元 | 实时 |
| 订单数一致性 | 订单管理.订单总数 = 经营概览.订单数量 = 订单统计.订单数 | 0 | 实时 |
| 入库金额一致性 | 聚水潭同步.入库金额 = 库存成本.入库金额 = 资金管理.采购支出 | 0.01元 | 实时 |

### 3.2 数据源同步验证

| 验证规则 | 验证内容 | 处理方式 |
|---------|---------|---------|
| 抖店数据完整性 | 订单数据是否完整同步 | 缺失则重新同步 |
| 千川数据完整性 | 推广数据是否完整同步 | 缺失则重新同步 |
| 聚水潭数据完整性 | 入库数据是否完整同步 | 缺失则重新同步 |
| 数据时效性 | 数据同步时间是否在24小时内 | 超时则触发同步 |

---

## 四、Java后端API实现要求

### 4.1 Controller层规范

```java
/**
 * 财务核算Controller
 * 所有数据从数据库读取，数据库数据由同步任务从API写入
 */
@RestController
@RequestMapping("/api/finance/accounting")
public class FinanceAccountingController {
    
    @Autowired
    private FinanceAccountingService accountingService;
    
    /**
     * 获取财务核算概览
     * 数据来源：orders表（抖店同步）、qianchuan_cost表（千川同步）、jst_purchase_in表（聚水潭同步）
     */
    @GetMapping("/overview")
    public CommonResult<AccountingOverviewVO> getOverview(
            @RequestParam String shopId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return success(accountingService.getOverview(shopId, startDate, endDate));
    }
}
```

### 4.2 Service层规范

```java
/**
 * 财务核算Service
 * 负责数据勾稽计算和统计分析
 */
@Service
public class FinanceAccountingServiceImpl implements FinanceAccountingService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private QianchuanCostMapper qianchuanCostMapper;
    
    @Autowired
    private JstPurchaseInMapper jstPurchaseInMapper;
    
    @Override
    public AccountingOverviewVO getOverview(String shopId, String startDate, String endDate) {
        // 1. 从orders表获取销售收入（抖店同步数据）
        BigDecimal salesRevenue = orderMapper.sumPaymentAmount(shopId, startDate, endDate);
        
        // 2. 从qianchuan_cost表获取推广费用（千川同步数据）
        BigDecimal promotionCost = qianchuanCostMapper.sumStatCost(shopId, startDate, endDate);
        
        // 3. 从jst_purchase_in表获取商品成本（聚水潭同步数据）
        BigDecimal productCost = jstPurchaseInMapper.sumTotalAmount(shopId, startDate, endDate);
        
        // 4. 计算利润
        BigDecimal grossProfit = salesRevenue.subtract(productCost);
        BigDecimal netProfit = grossProfit.subtract(promotionCost).subtract(otherExpenses);
        
        // 5. 组装返回数据
        return AccountingOverviewVO.builder()
                .salesRevenue(salesRevenue)
                .productCost(productCost)
                .promotionCost(promotionCost)
                .grossProfit(grossProfit)
                .netProfit(netProfit)
                .dataSource(buildDataSourceInfo())
                .build();
    }
}
```

### 4.3 数据同步任务规范

```java
/**
 * 抖店数据同步任务
 * 定时从抖店API获取数据并写入数据库
 */
@Component
public class DoudianSyncTask {
    
    @Autowired
    private DoudianApiClient doudianApiClient;
    
    @Autowired
    private OrderMapper orderMapper;
    
    /**
     * 每小时同步一次订单数据
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void syncOrders() {
        // 1. 调用抖店API获取订单数据
        List<DoudianOrder> orders = doudianApiClient.getOrders(startTime, endTime);
        
        // 2. 转换并写入数据库
        for (DoudianOrder order : orders) {
            OrderDO orderDO = convertToOrderDO(order);
            orderMapper.insertOrUpdate(orderDO);
        }
        
        // 3. 更新每日统计汇总表
        updateDailyStats(startTime, endTime);
    }
}
```

---

## 五、总结

本文档详细分析了租户端31个模块页面的数据勾稽关系，确保：

1. **所有数据来源明确**：每个数据指标都明确标注了来源于抖店API、千川API还是聚水潭API
2. **数据勾稽规则清晰**：定义了跨模块数据一致性验证规则，确保数据准确性
3. **API接口规范统一**：所有数据通过Java后端API获取，前端只负责调用和展示
4. **数据流转架构清晰**：从API同步到数据库，再从数据库读取展示，形成完整闭环

---

**文档结束**
