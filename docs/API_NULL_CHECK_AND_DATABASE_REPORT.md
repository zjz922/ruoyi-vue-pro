# API接口Null检查报告与数据库准备报告

> 生成时间：2026-01-17
> 检查范围：抖店API、千川API、聚水潭API、数据同步服务

---

## 一、API接口返回Null问题汇总

### 1.1 DataSyncServiceImpl.java 中的关键问题

| 方法名 | 行号 | 问题描述 | 严重程度 |
|--------|------|----------|----------|
| `getShopAccessToken()` | 415-418 | **返回null**，导致所有API调用失败 | **P0-致命** |
| `saveOrUpdateOrder()` | 461-463 | **空实现**，订单数据无法保存到数据库 | **P0-致命** |
| `saveOrUpdateDailySummary()` | 501-503 | **空实现**，日统计数据无法保存 | **P0-致命** |
| `syncQianchuanData()` | 155 | TODO未实现，千川数据无法保存 | **P1-严重** |
| `syncJstInbound()` | 192 | TODO未实现，入库数据无法保存 | **P1-严重** |
| `syncJstOutbound()` | 229 | TODO未实现，出库数据无法保存 | **P1-严重** |
| `syncJstInventory()` | 264 | TODO未实现，库存数据无法保存 | **P1-严重** |
| `executeDataReconciliation()` | 353 | TODO未实现，勾稽校验无法执行 | **P1-严重** |

### 1.2 getShopAccessToken() 问题详解

```java
// 当前实现（第415-418行）
private String getShopAccessToken(Long shopId, String platform) {
    // TODO: 从数据库获取店铺的访问令牌
    return null;  // ← 这里直接返回null，导致所有API调用失败
}
```

**影响范围**：
- `syncDoudianOrders()` - 抖店订单同步失败
- `syncDoudianCashflow()` - 抖店资金流水同步失败
- `syncQianchuanData()` - 千川推广数据同步失败
- `syncJstInbound()` - 聚水潭入库同步失败
- `syncJstOutbound()` - 聚水潭出库同步失败
- `syncJstInventory()` - 聚水潭库存同步失败
- `executeDailySummary()` - 每日汇总失败

### 1.3 DoudianApiClient.java 潜在Null返回点

| 方法名 | 返回Null条件 | 影响 |
|--------|--------------|------|
| `getOrderSummary()` | API调用异常时返回空对象 | 订单汇总数据为0 |
| `getOrderList()` | API调用异常时返回空列表 | 订单列表为空 |
| `getShopInfo()` | API调用异常时返回空对象 | 店铺信息缺失 |
| `getAccountBalance()` | API调用异常时返回0 | 余额显示为0 |
| `callApi()` | HTTP请求异常时返回null | 所有API调用失败 |

### 1.4 QianchuanApiClient.java 潜在Null返回点

| 方法名 | 返回Null条件 | 影响 |
|--------|--------------|------|
| `getCostSummary()` | API调用异常时返回空对象 | 推广费用为0 |
| `getCampaignList()` | API调用异常时返回空列表 | 推广计划列表为空 |
| `getAccountBalance()` | API调用异常时返回0 | 余额显示为0 |
| `getDailyStats()` | API调用异常时返回空列表 | 每日统计为空 |
| `callApi()` | HTTP请求异常时返回null | 所有API调用失败 |

### 1.5 JstApiClient.java 潜在Null返回点

| 方法名 | 返回Null条件 | 影响 |
|--------|--------------|------|
| `getInboundSummary()` | API调用异常时返回空对象 | 入库汇总为0 |
| `getOutboundSummary()` | API调用异常时返回空对象 | 出库汇总为0 |
| `getInventorySummary()` | API调用异常时返回空对象 | 库存汇总为0 |
| `getSkuList()` | API调用异常时返回空列表 | SKU列表为空 |
| `getInboundList()` | API调用异常时返回空列表 | 入库单列表为空 |
| `callApi()` | HTTP请求异常时返回null | 所有API调用失败 |

---

## 二、数据库表结构检查报告

### 2.1 已存在的表（21个）

| 表名 | 用途 | 状态 |
|------|------|------|
| `finance_orders` | 订单数据 | ✅ 结构完整 |
| `finance_cashflow` | 资金流水 | ✅ 结构完整 |
| `finance_daily_stat` | 日统计数据 | ✅ 结构完整 |
| `finance_product_cost` | 商品成本 | ✅ 结构完整 |
| `finance_doudian_config` | 抖店配置 | ✅ 结构完整 |
| `finance_doudian_auth_token` | 抖店授权令牌 | ✅ 结构完整 |
| `finance_doudian_shop` | 抖店店铺信息 | ✅ 结构完整 |
| `finance_qianchuan_config` | 千川配置 | ✅ 结构完整 |
| `finance_jst_config` | 聚水潭配置 | ✅ 结构完整 |
| `finance_sync_task` | 同步任务 | ✅ 结构完整 |
| `finance_sync_log` | 同步日志 | ✅ 结构完整 |
| `finance_sync_exception` | 同步异常 | ✅ 结构完整 |
| `finance_reconciliation_diff` | 对账差异 | ✅ 结构完整 |
| `finance_reconciliation_exception` | 对账异常 | ✅ 结构完整 |
| `finance_reconciliation_log` | 对账日志 | ✅ 结构完整 |
| `finance_report` | 财务报表 | ✅ 结构完整 |
| `finance_alert_rule` | 预警规则 | ✅ 结构完整 |
| `finance_alert_record` | 预警记录 | ✅ 结构完整 |
| `finance_channel` | 渠道配置 | ✅ 结构完整 |
| `finance_cost_adjustment` | 成本调整 | ✅ 结构完整 |
| `finance_document_mapping` | 单据映射 | ✅ 结构完整 |

### 2.2 关键表字段映射

#### finance_orders（订单表）
```
抖店API字段 → 数据库字段
─────────────────────────────
order_id → platform_order_id
order_status → status
order_amount → pay_amount
create_time → order_create_time
update_time → order_update_time
```

#### finance_daily_stat（日统计表）
```
数据来源 → 数据库字段
─────────────────────────────
抖店订单数 → order_count
抖店订单金额 → order_amount
抖店已付款订单 → paid_order_count, paid_amount
抖店退款 → refund_count, refund_amount
千川推广费 → promotion_cost
聚水潭商品成本 → product_cost
聚水潭物流成本 → logistics_cost
计算毛利 → gross_profit, gross_profit_rate
计算净利 → net_profit, net_profit_rate
```

#### finance_doudian_auth_token（抖店授权令牌表）
```
字段 → 用途
─────────────────────────────
shop_id → 店铺ID（关联查询用）
access_token → API调用令牌
refresh_token → 刷新令牌
expire_time → 令牌过期时间
auth_status → 授权状态（1=有效）
```

### 2.3 数据库表数据状态

```sql
-- 当前所有表均为空
SELECT 'finance_orders' as table_name, COUNT(*) as count FROM finance_orders
UNION ALL
SELECT 'finance_daily_stat', COUNT(*) FROM finance_daily_stat
UNION ALL
SELECT 'finance_doudian_auth_token', COUNT(*) FROM finance_doudian_auth_token;

-- 结果：全部为0
```

---

## 三、修复方案

### 3.1 P0级问题修复（必须立即修复）

#### 3.1.1 修复 getShopAccessToken()

```java
/**
 * 获取店铺访问令牌
 */
private String getShopAccessToken(Long shopId, String platform) {
    switch (platform) {
        case "DOUDIAN":
            // 从finance_doudian_auth_token表获取
            DoudianAuthTokenDO token = doudianAuthTokenMapper.selectByShopId(shopId);
            if (token != null && token.getAuthStatus() == 1) {
                // 检查是否过期
                if (token.getExpireTime() != null && token.getExpireTime().isAfter(LocalDateTime.now())) {
                    return token.getAccessToken();
                }
                // 如果过期，尝试刷新令牌
                return refreshDoudianToken(token);
            }
            break;
        case "QIANCHUAN":
            // 从finance_qianchuan_config表获取
            QianchuanConfigDO qcConfig = qianchuanConfigMapper.selectByShopId(shopId);
            if (qcConfig != null && qcConfig.getEnabled() == 1) {
                return qcConfig.getAccessToken();
            }
            break;
        case "JST":
            // 从finance_jst_config表获取
            JstConfigDO jstConfig = jstConfigMapper.selectByShopId(shopId);
            if (jstConfig != null && jstConfig.getEnabled() == 1) {
                // 聚水潭使用api_key + api_secret生成签名
                return generateJstAccessToken(jstConfig);
            }
            break;
    }
    return null;
}
```

#### 3.1.2 修复 saveOrUpdateOrder()

```java
/**
 * 保存或更新订单
 */
private void saveOrUpdateOrder(Long shopId, DoudianOrderDTO orderDTO) {
    // 查询是否已存在
    OrderDO existOrder = orderMapper.selectByPlatformOrderId(orderDTO.getOrderId());
    
    if (existOrder != null) {
        // 更新订单
        existOrder.setStatus(convertOrderStatus(orderDTO.getOrderStatus()));
        existOrder.setPayAmount(orderDTO.getPayAmount().divide(new BigDecimal("100")));
        existOrder.setOrderUpdateTime(parseDateTime(orderDTO.getUpdateTime()));
        existOrder.setUpdateTime(LocalDateTime.now());
        orderMapper.updateById(existOrder);
    } else {
        // 新增订单
        OrderDO newOrder = new OrderDO();
        newOrder.setShopId(shopId);
        newOrder.setTenantId(getTenantIdByShopId(shopId));
        newOrder.setOrderNo(generateOrderNo());
        newOrder.setPlatformOrderId(orderDTO.getOrderId());
        newOrder.setPlatform("DOUDIAN");
        newOrder.setStatus(convertOrderStatus(orderDTO.getOrderStatus()));
        newOrder.setPayAmount(orderDTO.getPayAmount().divide(new BigDecimal("100")));
        newOrder.setOrderCreateTime(parseDateTime(orderDTO.getCreateTime()));
        newOrder.setOrderUpdateTime(parseDateTime(orderDTO.getUpdateTime()));
        newOrder.setCreateTime(LocalDateTime.now());
        newOrder.setUpdateTime(LocalDateTime.now());
        orderMapper.insert(newOrder);
    }
}
```

#### 3.1.3 修复 saveOrUpdateDailySummary()

```java
/**
 * 保存或更新每日汇总
 */
private void saveOrUpdateDailySummary(DailySummaryDO dailySummary) {
    // 查询是否已存在
    DailyStatDO existStat = dailyStatMapper.selectByShopIdAndDate(
        dailySummary.getShopId(), dailySummary.getSummaryDate());
    
    if (existStat != null) {
        // 更新
        existStat.setOrderAmount(dailySummary.getRevenue());
        existStat.setPromotionCost(dailySummary.getAdCost());
        existStat.setProductCost(dailySummary.getProductCost());
        existStat.setGrossProfit(dailySummary.getGrossProfit());
        existStat.setGrossProfitRate(dailySummary.getGrossProfitRate());
        existStat.setUpdateTime(LocalDateTime.now());
        dailyStatMapper.updateById(existStat);
    } else {
        // 新增
        DailyStatDO newStat = new DailyStatDO();
        newStat.setShopId(dailySummary.getShopId());
        newStat.setTenantId(getTenantIdByShopId(dailySummary.getShopId()));
        newStat.setStatDate(dailySummary.getSummaryDate());
        newStat.setStatType("DAILY");
        newStat.setOrderAmount(dailySummary.getRevenue());
        newStat.setPromotionCost(dailySummary.getAdCost());
        newStat.setProductCost(dailySummary.getProductCost());
        newStat.setGrossProfit(dailySummary.getGrossProfit());
        newStat.setGrossProfitRate(dailySummary.getGrossProfitRate());
        newStat.setCreateTime(LocalDateTime.now());
        newStat.setUpdateTime(LocalDateTime.now());
        dailyStatMapper.insert(newStat);
    }
}
```

### 3.2 需要新增的Mapper方法

#### DoudianAuthTokenMapper.java
```java
DoudianAuthTokenDO selectByShopId(@Param("shopId") Long shopId);
```

#### OrderMapper.java
```java
OrderDO selectByPlatformOrderId(@Param("platformOrderId") String platformOrderId);
```

#### DailyStatMapper.java
```java
DailyStatDO selectByShopIdAndDate(@Param("shopId") Long shopId, @Param("statDate") LocalDate statDate);
```

---

## 四、数据流向图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           数据同步流程                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │ 抖店开放平台  │────→│ DoudianApiClient │────→│ finance_orders   │   │
│  │              │     │                  │     │ finance_cashflow │   │
│  └──────────────┘     └──────────────────┘     └──────────────────┘   │
│                                                                         │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │ 巨量千川API   │────→│ QianchuanApiClient│────→│ finance_daily_stat│  │
│  │              │     │                  │     │ (promotion_cost) │   │
│  └──────────────┘     └──────────────────┘     └──────────────────┘   │
│                                                                         │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │ 聚水潭ERP API │────→│   JstApiClient   │────→│ finance_product_cost│ │
│  │              │     │                  │     │ finance_daily_stat│   │
│  └──────────────┘     └──────────────────┘     └──────────────────┘   │
│                                                                         │
│                              ↓                                          │
│                    ┌──────────────────┐                                │
│                    │ DataSyncService  │                                │
│                    │ executeDailySummary│                              │
│                    └──────────────────┘                                │
│                              ↓                                          │
│                    ┌──────────────────┐                                │
│                    │ finance_daily_stat│                               │
│                    │ (汇总统计数据)    │                                │
│                    └──────────────────┘                                │
│                              ↓                                          │
│                    ┌──────────────────┐                                │
│                    │   租户端页面      │                                │
│                    │ (Dashboard等)    │                                │
│                    └──────────────────┘                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 五、配置要求

### 5.1 抖店配置（用户需提供）

| 配置项 | 说明 | 存储位置 |
|--------|------|----------|
| App Key | 抖店应用Key | application.yml: `doudian.app.key` |
| App Secret | 抖店应用Secret | application.yml: `doudian.app.secret` |
| Access Token | 授权令牌 | `finance_doudian_auth_token`表 |
| Shop ID | 店铺ID | `finance_doudian_auth_token`表 |

### 5.2 千川配置（用户需提供）

| 配置项 | 说明 | 存储位置 |
|--------|------|----------|
| App Key | 千川应用Key | `finance_qianchuan_config`表 |
| App Secret | 千川应用Secret | `finance_qianchuan_config`表 |
| Access Token | 授权令牌 | `finance_qianchuan_config`表 |
| Advertiser ID | 广告主ID | 通过API获取 |

### 5.3 聚水潭配置（用户需提供）

| 配置项 | 说明 | 存储位置 |
|--------|------|----------|
| API Key | 聚水潭AppKey | `finance_jst_config`表 |
| API Secret | 聚水潭AppSecret | `finance_jst_config`表 |

---

## 六、下一步行动

1. **用户提供抖店开发平台Key后**：
   - 将Key配置到application.yml
   - 完成OAuth授权流程，获取access_token
   - 将token存储到`finance_doudian_auth_token`表

2. **修复代码**：
   - 实现`getShopAccessToken()`方法
   - 实现`saveOrUpdateOrder()`方法
   - 实现`saveOrUpdateDailySummary()`方法
   - 实现千川和聚水潭数据保存逻辑

3. **测试验证**：
   - 调用同步API，验证数据是否正确存储
   - 检查租户端页面是否能正确显示数据
