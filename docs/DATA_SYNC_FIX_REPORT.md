# 数据同步核心逻辑修复报告

## 修复概述

本次修复解决了闪电帐PRO项目中数据同步模块的P0级致命问题，实现了从抖店、千川、聚水潭API获取数据并存储到数据库的完整流程。

## 修复内容

### 1. 配置抖店API Key

**文件**: `application-finance.yml`

```yaml
finance:
  doudian:
    app-key: 7569846683366884874
    app-secret: 5ed2bbdd-cc97-4871-a3c3-e013ff1f381e
```

### 2. 修复 getShopAccessToken() 方法

**问题**: 原方法直接返回null，导致所有API调用失败

**修复后逻辑**:
1. 从数据库查询租户的授权令牌
2. 检查令牌是否过期（提前5分钟刷新）
3. 如果过期，调用抖店API刷新令牌
4. 更新数据库中的令牌信息
5. 返回有效的access_token

```java
private String getShopAccessToken(Long tenantId, Long shopId) {
    DoudianAuthTokenDO tokenDO = doudianAuthTokenMapper.selectByTenantIdAndShopId(tenantId, shopId);
    if (tokenDO == null) {
        log.warn("[getShopAccessToken] 未找到授权令牌: tenantId={}, shopId={}", tenantId, shopId);
        return null;
    }
    
    // 检查令牌是否过期（提前5分钟刷新）
    if (tokenDO.getExpireTime() != null && 
        tokenDO.getExpireTime().minusMinutes(5).isBefore(LocalDateTime.now())) {
        // 刷新令牌
        DoudianTokenDTO newToken = doudianApiClient.refreshToken(
            tokenDO.getAppKey(), tokenDO.getAppSecret(), tokenDO.getRefreshToken());
        // 更新数据库
        ...
    }
    
    return tokenDO.getAccessToken();
}
```

### 3. 修复 saveOrUpdateOrder() 方法

**问题**: 原方法为空实现，订单无法保存到数据库

**修复后逻辑**:
1. 根据平台订单ID查询是否已存在
2. 如果存在，更新订单信息
3. 如果不存在，插入新订单
4. 正确映射抖店API字段到数据库字段

```java
private void saveOrUpdateOrder(Long tenantId, Long shopId, DoudianOrderDTO orderDTO) {
    OrderDO existOrder = orderMapper.selectByPlatformOrderId(orderDTO.getOrderId());
    
    if (existOrder != null) {
        // 更新订单
        existOrder.setOrderStatus(mapOrderStatus(orderDTO.getOrderStatus()));
        existOrder.setPayAmount(orderDTO.getPayAmount());
        existOrder.setRefundAmount(orderDTO.getRefundAmount());
        existOrder.setUpdateTime(LocalDateTime.now());
        orderMapper.updateById(existOrder);
    } else {
        // 插入新订单
        OrderDO newOrder = OrderDO.builder()
            .tenantId(tenantId)
            .shopId(shopId)
            .platformOrderId(orderDTO.getOrderId())
            .orderAmount(orderDTO.getOrderAmount())
            .payAmount(orderDTO.getPayAmount())
            // ... 其他字段映射
            .build();
        orderMapper.insert(newOrder);
    }
}
```

### 4. 修复 saveOrUpdateDailySummary() 方法

**问题**: 原方法为空实现，日统计无法保存

**修复后逻辑**:
1. 根据租户ID、店铺ID、统计日期查询是否已存在
2. 如果存在，更新统计数据
3. 如果不存在，插入新记录
4. 正确映射抖店订单汇总数据到日统计表

```java
private void saveOrUpdateDailySummary(Long tenantId, Long shopId, LocalDate date, DoudianOrderSummaryDTO summary) {
    DailyStatDO existStat = dailyStatMapper.selectByTenantIdAndShopIdAndDate(tenantId, shopId, date);
    
    if (existStat != null) {
        // 更新统计
        existStat.setSalesAmount(summary.getTotalAmount());
        existStat.setOrderCount(summary.getOrderCount());
        // ...
        dailyStatMapper.updateById(existStat);
    } else {
        // 插入新统计
        DailyStatDO newStat = DailyStatDO.builder()
            .tenantId(tenantId)
            .shopId(shopId)
            .statDate(date)
            .salesAmount(summary.getTotalAmount())
            // ...
            .build();
        dailyStatMapper.insert(newStat);
    }
}
```

### 5. 实现千川数据保存逻辑

**新增方法**: `saveQianchuanDailyStat()`

```java
private void saveQianchuanDailyStat(Long tenantId, Long shopId, LocalDate date, QianchuanDailyStatDTO stat) {
    DailyStatDO existStat = dailyStatMapper.selectByTenantIdAndShopIdAndDate(tenantId, shopId, date);
    
    if (existStat != null) {
        // 更新千川推广费用
        existStat.setPromotionCost(stat.getCost());
        dailyStatMapper.updateById(existStat);
    } else {
        // 创建新记录
        DailyStatDO newStat = DailyStatDO.builder()
            .tenantId(tenantId)
            .shopId(shopId)
            .statDate(date)
            .promotionCost(stat.getCost())
            .build();
        dailyStatMapper.insert(newStat);
    }
}
```

### 6. 实现聚水潭数据保存逻辑

**新增方法**: 
- `saveJstInbound()` - 保存入库数据
- `saveJstOutbound()` - 保存出库数据
- `saveJstInventory()` - 保存库存数据

### 7. 实现数据勾稽校验逻辑

**新增方法**: `executeDataReconciliation()`

```java
private void executeDataReconciliation(Long tenantId, Long shopId, LocalDate date) {
    // 1. 获取平台数据
    DoudianOrderSummaryDTO platformSummary = doudianApiClient.getOrderSummary(accessToken, date, date);
    
    // 2. 获取系统数据
    DailyStatDO systemStat = dailyStatMapper.selectByTenantIdAndShopIdAndDate(tenantId, shopId, date);
    
    // 3. 比对数据
    BigDecimal platformAmount = platformSummary.getTotalAmount();
    BigDecimal systemAmount = systemStat.getSalesAmount();
    BigDecimal diffAmount = platformAmount.subtract(systemAmount).abs();
    
    // 4. 如果差异超过阈值，记录差异
    if (diffAmount.compareTo(new BigDecimal("100")) > 0) {
        ReconciliationDiffDO diff = new ReconciliationDiffDO();
        diff.setTenantId(tenantId);
        diff.setShopId(shopId);
        diff.setDiffDate(date);
        diff.setDiffType("order");
        diff.setSourceValue(platformAmount);
        diff.setTargetValue(systemAmount);
        diff.setDiffValue(diffAmount);
        diff.setStatus("pending");
        reconciliationDiffMapper.insert(diff);
    }
}
```

## 新增文件

| 文件 | 说明 |
|------|------|
| `DoudianCashflowDTO.java` | 抖店资金流水DTO |
| `DoudianCashflowListDTO.java` | 抖店资金流水列表DTO |
| `DoudianTokenDTO.java` | 抖店令牌DTO |

## 数据库表结构更新

### finance_sync_log 表

新增字段:
- `status` - 同步状态（兼容字段）
- `start_date` - 同步开始日期
- `end_date` - 同步结束日期

### finance_reconciliation_diff 表

新增字段:
- `diff_date` - 差异日期
- `diff_type` - 差异类型
- `source_value` - 来源值
- `target_value` - 目标值
- `diff_value` - 差异值

## 数据流向

修复后的数据流向:

```
┌─────────────────────────────────────────────────────────────────┐
│                        外部API数据源                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   抖店API       │   千川API       │   聚水潭API                   │
│   - 订单数据    │   - 推广费用    │   - 入库数据                  │
│   - 资金流水    │   - 投放统计    │   - 出库数据                  │
│   - 店铺信息    │                 │   - 库存数据                  │
└────────┬────────┴────────┬────────┴────────┬────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DataSyncServiceImpl                            │
│   - getShopAccessToken() ✅ 从数据库获取令牌                      │
│   - saveOrUpdateOrder() ✅ 保存订单                              │
│   - saveOrUpdateDailySummary() ✅ 保存日统计                     │
│   - saveQianchuanDailyStat() ✅ 保存千川数据                     │
│   - saveJstInbound/Outbound/Inventory() ✅ 保存聚水潭数据        │
│   - executeDataReconciliation() ✅ 数据勾稽校验                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        数据库表                                   │
├─────────────────┬─────────────────┬─────────────────────────────┤
│ finance_orders  │ finance_daily_  │ finance_reconciliation_     │
│ 订单表          │ stat 日统计表   │ diff 对账差异表              │
├─────────────────┼─────────────────┼─────────────────────────────┤
│ finance_cashflow│ finance_sync_   │ finance_product_cost        │
│ 资金流水表      │ log 同步日志表  │ 商品成本表                   │
└────────┬────────┴────────┬────────┴────────┬────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     租户端/管理端页面                             │
│   - Dashboard 仪表盘                                             │
│   - 订单管理                                                     │
│   - 财务报表                                                     │
│   - 数据对账                                                     │
│   - 经营分析                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 下一步操作

### 1. 完成抖店OAuth授权

用户需要完成抖店OAuth授权流程，获取Access Token并存储到数据库:

```sql
INSERT INTO finance_doudian_auth_token 
(tenant_id, shop_id, app_key, app_secret, access_token, refresh_token, expire_time)
VALUES 
(1, 1, '7569846683366884874', '5ed2bbdd-cc97-4871-a3c3-e013ff1f381e', 
 '授权后获取的access_token', '授权后获取的refresh_token', '2025-02-17 00:00:00');
```

### 2. 触发数据同步

授权完成后，可以通过以下方式触发数据同步:

1. **手动触发**: 调用 `/api/finance/sync/trigger` 接口
2. **定时任务**: 系统会每小时自动同步一次
3. **管理后台**: 在"数据同步"页面点击"立即同步"按钮

### 3. 验证数据

同步完成后，检查以下数据库表是否有数据:

```sql
SELECT COUNT(*) FROM finance_orders;
SELECT COUNT(*) FROM finance_daily_stat;
SELECT COUNT(*) FROM finance_cashflow;
SELECT COUNT(*) FROM finance_sync_log;
```

## GitHub提交

- **仓库地址**: https://github.com/zjz922/ruoyi-vue-pro
- **提交ID**: f95d63b6d7
- **提交信息**: fix: 修复数据同步核心逻辑，实现真实数据读取和存储

---

**修复完成时间**: 2025-01-17
**修复人**: 闪电帐PRO开发团队
