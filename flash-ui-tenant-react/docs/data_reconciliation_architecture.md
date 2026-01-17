# 完整的数据勾稽体系架构设计

## 1. 整体架构

### 1.1 数据勾稽体系框架

```
┌─────────────────────────────────────────────────────────────────┐
│                     数据勾稽体系                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              基准数据源（订单数据）                       │  │
│  │  - 订单表（finance_orders）                              │  │
│  │  - 每日统计表（finance_daily_stats）                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                 │
│         ▼                  ▼                  ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 成本关联     │  │ 库存关联     │  │ 推广费关联   │          │
│  │ 验证         │  │ 验证         │  │ 验证         │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                 │
│                            ▼                                     │
│         ┌──────────────────────────────────┐                    │
│         │  勾稽差异表                      │                    │
│         │  (ReconciliationDifference)      │                    │
│         └──────────────────────────────────┘                    │
│                            │                                     │
│         ┌──────────────────┴──────────────────┐                 │
│         ▼                                     ▼                  │
│  ┌──────────────────┐          ┌──────────────────────┐        │
│  │ 勾稽报告生成     │          │ 异常告警机制         │        │
│  │ (Daily/Weekly/   │          │ (Alert System)       │        │
│  │  Monthly Report) │          │                      │        │
│  └──────────────────┘          └──────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 数据流转过程

```
订单数据输入 → 数据清洗 → 基准数据存储 → 多维度勾稽验证 → 差异记录 → 报告生成 → 告警通知
```

---

## 2. 数据库设计

### 2.1 核心表结构

#### 2.1.1 订单表 - finance_orders（基准数据）

| 字段名 | 类型 | 说明 | 勾稽用途 |
|--------|------|------|---------|
| id | BIGINT | 订单ID | 主键 |
| tenant_id | BIGINT | 租户ID | 多租户隔离 |
| order_no | VARCHAR(50) | 订单编号 | 唯一标识 |
| sku | VARCHAR(100) | SKU编码 | 库存关联 |
| product_id | VARCHAR(50) | 商品ID | 成本关联 |
| quantity | INT | 数量 | 库存计算 |
| payable_amount | DECIMAL(10,2) | 应付金额 | 销售额基准 |
| product_cost | DECIMAL(10,2) | 商品成本 | 成本勾稽 |
| promotion_fee | DECIMAL(10,2) | 推广费 | 推广费勾稽 |
| order_time | DATETIME | 订单时间 | 时间维度 |
| ship_time | DATETIME | 发货时间 | 库存出库时间 |

#### 2.1.2 成本表 - finance_product_costs

| 字段名 | 类型 | 说明 | 勾稽关联 |
|--------|------|------|---------|
| id | BIGINT | 成本ID | 主键 |
| tenant_id | BIGINT | 租户ID | 多租户隔离 |
| sku | VARCHAR(100) | SKU编码 | 关联订单 |
| product_id | VARCHAR(50) | 商品ID | 关联订单 |
| current_cost | DECIMAL(10,2) | 当前成本 | 成本基准 |
| effective_time | DATETIME | 生效时间 | 时间匹配 |
| created_time | DATETIME | 创建时间 | 审计 |

#### 2.1.3 库存表 - finance_inventory（新建）

| 字段名 | 类型 | 说明 | 勾稽关联 |
|--------|------|------|---------|
| id | BIGINT | 库存ID | 主键 |
| tenant_id | BIGINT | 租户ID | 多租户隔离 |
| sku | VARCHAR(100) | SKU编码 | 关联订单 |
| product_id | VARCHAR(50) | 商品ID | 关联订单 |
| quantity | INT | 库存数量 | 库存基准 |
| reserved_qty | INT | 预留数量 | 订单关联 |
| available_qty | INT | 可用数量 | 库存计算 |
| warehouse_id | VARCHAR(50) | 仓库ID | 物理位置 |
| updated_time | DATETIME | 更新时间 | 时间戳 |

#### 2.1.4 推广费表 - finance_promotion_expense（新建）

| 字段名 | 类型 | 说明 | 勾稽关联 |
|--------|------|------|---------|
| id | BIGINT | 推广费ID | 主键 |
| tenant_id | BIGINT | 租户ID | 多租户隔离 |
| expense_date | DATE | 推广日期 | 时间维度 |
| campaign_id | VARCHAR(50) | 推广计划ID | 千川关联 |
| campaign_name | VARCHAR(255) | 推广计划名称 | 描述 |
| cost | DECIMAL(12,2) | 推广费用 | 推广费基准 |
| platform | VARCHAR(50) | 平台（千川/抖音等） | 来源标识 |
| sync_time | DATETIME | 同步时间 | 数据来源时间 |

#### 2.1.5 勾稽规则表 - finance_reconciliation_rule（新建）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 规则ID |
| tenant_id | BIGINT | 租户ID |
| rule_name | VARCHAR(255) | 规则名称 |
| rule_type | VARCHAR(50) | 规则类型（ORDER_COST/ORDER_INVENTORY/ORDER_PROMOTION） |
| source_table | VARCHAR(100) | 源表 |
| target_table | VARCHAR(100) | 目标表 |
| join_condition | VARCHAR(500) | JOIN条件 |
| validation_sql | LONGTEXT | 验证SQL |
| tolerance | DECIMAL(10,2) | 容差值 |
| enabled | TINYINT | 是否启用 |
| created_time | DATETIME | 创建时间 |

#### 2.1.6 勾稽差异表 - finance_reconciliation_difference（新建）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 差异ID |
| tenant_id | BIGINT | 租户ID |
| rule_id | BIGINT | 规则ID |
| rule_type | VARCHAR(50) | 规则类型 |
| source_id | BIGINT | 源记录ID |
| target_id | BIGINT | 目标记录ID |
| source_value | DECIMAL(15,2) | 源值 |
| target_value | DECIMAL(15,2) | 目标值 |
| difference | DECIMAL(15,2) | 差异值 |
| difference_rate | DECIMAL(5,2) | 差异率（%） |
| status | VARCHAR(20) | 状态（PENDING/RESOLVED/IGNORED） |
| remark | VARCHAR(500) | 备注 |
| created_time | DATETIME | 发现时间 |
| resolved_time | DATETIME | 解决时间 |

#### 2.1.7 勾稽报告表 - finance_reconciliation_report（新建）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 报告ID |
| tenant_id | BIGINT | 租户ID |
| report_date | DATE | 报告日期 |
| report_type | VARCHAR(50) | 报告类型（DAILY/WEEKLY/MONTHLY） |
| total_orders | INT | 总订单数 |
| reconciled_orders | INT | 已勾稽订单数 |
| reconciliation_rate | DECIMAL(5,2) | 勾稽率（%） |
| total_differences | INT | 总差异数 |
| total_difference_amount | DECIMAL(15,2) | 总差异金额 |
| critical_differences | INT | 严重差异数 |
| report_content | LONGTEXT | 报告内容（JSON） |
| created_time | DATETIME | 生成时间 |

---

## 3. 后端SQL关联查询设计

### 3.1 订单-成本关联查询

```sql
-- 查询订单与成本的关联关系
SELECT 
    o.id as order_id,
    o.order_no,
    o.sku,
    o.product_id,
    o.quantity,
    o.product_cost as order_cost,
    c.current_cost as config_cost,
    (o.product_cost - c.current_cost * o.quantity) as cost_difference,
    o.order_time,
    c.effective_time
FROM finance_orders o
LEFT JOIN finance_product_costs c 
    ON o.tenant_id = c.tenant_id 
    AND o.sku = c.sku
    AND o.order_time >= c.effective_time
WHERE o.tenant_id = #{tenantId}
    AND o.order_time BETWEEN #{startDate} AND #{endDate}
ORDER BY o.order_time DESC;
```

### 3.2 订单-库存关联查询

```sql
-- 查询订单与库存的关联关系
SELECT 
    o.id as order_id,
    o.order_no,
    o.sku,
    o.product_id,
    o.quantity as order_qty,
    i.quantity as inventory_qty,
    i.available_qty,
    (i.available_qty - o.quantity) as inventory_after_order,
    o.ship_time,
    i.updated_time
FROM finance_orders o
LEFT JOIN finance_inventory i 
    ON o.tenant_id = i.tenant_id 
    AND o.sku = i.sku
WHERE o.tenant_id = #{tenantId}
    AND o.order_time BETWEEN #{startDate} AND #{endDate}
ORDER BY o.order_time DESC;
```

### 3.3 订单-推广费关联查询

```sql
-- 查询订单与推广费的关联关系
SELECT 
    DATE(o.order_time) as order_date,
    COUNT(DISTINCT o.id) as order_count,
    SUM(o.payable_amount) as sales_amount,
    SUM(o.promotion_fee) as order_promotion_fee,
    SUM(p.cost) as platform_promotion_fee,
    (SUM(o.promotion_fee) - SUM(p.cost)) as promotion_difference
FROM finance_orders o
LEFT JOIN finance_promotion_expense p 
    ON o.tenant_id = p.tenant_id 
    AND DATE(o.order_time) = p.expense_date
WHERE o.tenant_id = #{tenantId}
    AND o.order_time BETWEEN #{startDate} AND #{endDate}
GROUP BY DATE(o.order_time)
ORDER BY order_date DESC;
```

### 3.4 多维度勾稽汇总查询

```sql
-- 多维度勾稽汇总
SELECT 
    DATE(o.order_time) as stats_date,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.payable_amount) as total_sales,
    SUM(o.product_cost) as total_cost,
    SUM(o.promotion_fee) as total_promotion,
    COUNT(DISTINCT CASE WHEN c.id IS NOT NULL THEN o.id END) as cost_matched,
    COUNT(DISTINCT CASE WHEN i.id IS NOT NULL THEN o.id END) as inventory_matched,
    COUNT(DISTINCT CASE WHEN p.id IS NOT NULL THEN o.id END) as promotion_matched
FROM finance_orders o
LEFT JOIN finance_product_costs c 
    ON o.tenant_id = c.tenant_id AND o.sku = c.sku
LEFT JOIN finance_inventory i 
    ON o.tenant_id = i.tenant_id AND o.sku = i.sku
LEFT JOIN finance_promotion_expense p 
    ON o.tenant_id = p.tenant_id AND DATE(o.order_time) = p.expense_date
WHERE o.tenant_id = #{tenantId}
    AND o.order_time BETWEEN #{startDate} AND #{endDate}
GROUP BY DATE(o.order_time)
ORDER BY stats_date DESC;
```

---

## 4. 前端数据验证规则

### 4.1 订单-成本验证规则

**验证规则**：订单中的商品成本应与成本配置表中的成本相匹配

**验证公式**：
```
订单成本 = 成本配置成本 × 订单数量
容差范围：±5%
```

**异常情况**：
- 成本配置中不存在该SKU
- 订单成本与配置成本差异超过容差
- 成本配置的生效时间晚于订单时间

### 4.2 订单-库存验证规则

**验证规则**：订单发货时库存应充足，发货后库存应相应减少

**验证公式**：
```
发货前库存 >= 订单数量
发货后库存 = 发货前库存 - 订单数量
```

**异常情况**：
- 订单数量超过库存数量
- 库存更新时间与订单发货时间不匹配
- 库存数量为负数

### 4.3 订单-推广费验证规则

**验证规则**：订单中的推广费应与推广平台数据相匹配

**验证公式**：
```
订单推广费合计 = 推广平台推广费
容差范围：±2%
```

**异常情况**：
- 推广费数据缺失
- 推广费差异超过容差
- 推广费时间维度不匹配

### 4.4 订单-入库单验证规则

**验证规则**：订单中的商品应有对应的入库单记录

**验证公式**：
```
订单SKU ∈ 入库单SKU集合
入库数量 >= 订单数量
```

**异常情况**：
- 订单SKU在入库单中不存在
- 入库数量不足
- 入库时间晚于订单时间

---

## 5. 数据同步验证流程

### 5.1 抖店同步验证

```
抖店数据同步 → 数据清洗 → 与订单表对比 → 差异记录 → 告警通知
```

**验证项**：
- 订单编号唯一性
- 金额数据完整性
- 时间戳有效性
- SKU与商品ID匹配

### 5.2 千川同步验证

```
千川推广费同步 → 数据清洗 → 与订单推广费对比 → 差异记录 → 告警通知
```

**验证项**：
- 推广费金额准确性
- 日期维度匹配
- 推广计划ID有效性
- 费用类型分类

### 5.3 聚水潭同步验证

```
聚水潭入库单同步 → 数据清洗 → 与库存表对比 → 差异记录 → 告警通知
```

**验证项**：
- SKU与商品ID匹配
- 入库数量准确性
- 入库时间有效性
- 仓库信息完整

---

## 6. 勾稽报告生成规则

### 6.1 日报生成

**生成时间**：每日凌晨2点

**报告内容**：
- 当日订单总数
- 当日已勾稽订单数
- 当日勾稽率
- 当日发现的差异数
- 当日差异金额
- 严重差异预警

### 6.2 周报生成

**生成时间**：每周一凌晨3点

**报告内容**：
- 周订单总数
- 周勾稽率趋势
- 周差异汇总
- 周内严重差异TOP 10
- 周内最常见差异类型

### 6.3 月报生成

**生成时间**：每月1日凌晨4点

**报告内容**：
- 月订单总数
- 月勾稽率
- 月差异汇总
- 月内严重差异分析
- 月内改进建议

---

## 7. 异常告警机制

### 7.1 告警等级

| 等级 | 条件 | 处理方式 |
|------|------|---------|
| 🔴 严重 | 差异率 > 10% 或 差异金额 > 1000元 | 立即告警，管理员介入 |
| 🟠 警告 | 差异率 5%-10% 或 差异金额 500-1000元 | 记录告警，定期审查 |
| 🟡 提示 | 差异率 < 5% 或 差异金额 < 500元 | 记录日志，月度汇总 |

### 7.2 告警通知

- 系统消息通知
- 邮件通知
- 钉钉/企业微信通知（可选）
- 数据大盘展示

---

## 8. 实现时间表

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| Phase 1 | 数据库表创建 | 2-3天 |
| Phase 2 | 后端SQL查询实现 | 3-5天 |
| Phase 3 | 勾稽验证服务 | 5-7天 |
| Phase 4 | 前端验证组件 | 3-5天 |
| Phase 5 | 报告生成引擎 | 3-5天 |
| Phase 6 | 测试与优化 | 3-5天 |

**总计**：约2-3周

---

## 9. 关键指标

### 9.1 勾稽率计算

```
勾稽率 = (已勾稽订单数 / 总订单数) × 100%
目标：>= 99.5%
```

### 9.2 差异率计算

```
差异率 = (差异金额 / 总金额) × 100%
目标：<= 0.5%
```

### 9.3 解决率计算

```
解决率 = (已解决差异数 / 总差异数) × 100%
目标：>= 95%
```

---

## 10. 安全与合规

- 所有勾稽数据都包含租户隔离
- 所有操作都有审计日志
- 敏感数据加密存储
- 定期备份勾稽报告
- 符合财务审计要求

