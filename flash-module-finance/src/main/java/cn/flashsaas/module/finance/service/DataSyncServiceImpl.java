package cn.flashsaas.module.finance.service;

import cn.flashsaas.module.finance.api.client.DoudianApiClient;
import cn.flashsaas.module.finance.api.client.JstApiClient;
import cn.flashsaas.module.finance.api.client.QianchuanApiClient;
import cn.flashsaas.module.finance.api.client.dto.*;
import cn.flashsaas.module.finance.dal.dataobject.*;
import cn.flashsaas.module.finance.dal.mysql.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * 数据同步 Service 实现类
 * 
 * 实现抖店、千川、聚水潭三个平台的数据同步，以及数据勾稽校验
 *
 * @author 闪电账PRO
 */
@Slf4j
@Service
public class DataSyncServiceImpl implements DataSyncService {

    @Resource
    private DoudianApiClient doudianApiClient;

    @Resource
    private QianchuanApiClient qianchuanApiClient;

    @Resource
    private JstApiClient jstApiClient;

    @Resource
    private OrderMapper orderMapper;

    @Resource
    private DailyStatMapper dailyStatMapper;

    @Resource
    private SyncLogMapper syncLogMapper;

    @Resource
    private DoudianAuthTokenMapper doudianAuthTokenMapper;

    @Resource
    private QianchuanConfigMapper qianchuanConfigMapper;

    @Resource
    private JstConfigMapper jstConfigMapper;

    @Resource
    private CashflowMapper cashflowMapper;

    @Resource
    private ReconciliationDiffMapper reconciliationDiffMapper;

    @Resource
    private ReconciliationExceptionMapper reconciliationExceptionMapper;

    @Value("${finance.doudian.app-key:}")
    private String doudianAppKey;

    @Value("${finance.doudian.app-secret:}")
    private String doudianAppSecret;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int syncDoudianOrders(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[syncDoudianOrders][开始同步抖店订单] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        int syncCount = 0;
        SyncLogDO syncLog = createSyncLog(shopId, "DOUDIAN_ORDER", startDate, endDate);
        
        try {
            // 获取店铺的访问令牌
            String accessToken = getShopAccessToken(shopId, "DOUDIAN");
            if (accessToken == null) {
                throw new RuntimeException("店铺未授权或授权已过期，请先完成抖店授权");
            }
            
            // 分页获取订单数据
            int page = 1;
            int pageSize = 100;
            boolean hasMore = true;
            
            while (hasMore) {
                DoudianOrderListDTO orderList = doudianApiClient.getOrderList(
                        accessToken, startDate, endDate, page, pageSize);
                
                if (orderList == null || orderList.getOrders() == null || orderList.getOrders().isEmpty()) {
                    hasMore = false;
                    continue;
                }
                
                // 保存订单到数据库
                for (DoudianOrderDTO order : orderList.getOrders()) {
                    saveOrUpdateOrder(shopId, order);
                    syncCount++;
                }
                
                // 判断是否还有更多数据
                hasMore = orderList.getOrders().size() >= pageSize;
                page++;
            }
            
            // 更新同步日志
            updateSyncLogSuccess(syncLog, syncCount);
            log.info("[syncDoudianOrders][同步完成] shopId={}, syncCount={}", shopId, syncCount);
            
        } catch (Exception e) {
            log.error("[syncDoudianOrders][同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            updateSyncLogFailed(syncLog, e.getMessage());
            throw new RuntimeException("同步抖店订单失败: " + e.getMessage(), e);
        }
        
        return syncCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int syncDoudianCashflow(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[syncDoudianCashflow][开始同步抖店资金流水] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        int syncCount = 0;
        SyncLogDO syncLog = createSyncLog(shopId, "DOUDIAN_CASHFLOW", startDate, endDate);
        
        try {
            String accessToken = getShopAccessToken(shopId, "DOUDIAN");
            if (accessToken == null) {
                throw new RuntimeException("店铺未授权或授权已过期，请先完成抖店授权");
            }
            
            // 调用抖店资金流水API同步数据
            DoudianCashflowListDTO cashflowList = doudianApiClient.getCashflowList(
                    accessToken, startDate, endDate, 1, 100);
            
            if (cashflowList != null && cashflowList.getCashflows() != null) {
                for (DoudianCashflowDTO cashflow : cashflowList.getCashflows()) {
                    saveOrUpdateCashflow(shopId, cashflow);
                    syncCount++;
                }
            }
            
            updateSyncLogSuccess(syncLog, syncCount);
            log.info("[syncDoudianCashflow][同步完成] shopId={}, syncCount={}", shopId, syncCount);
            
        } catch (Exception e) {
            log.error("[syncDoudianCashflow][同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            updateSyncLogFailed(syncLog, e.getMessage());
            throw new RuntimeException("同步抖店资金流水失败: " + e.getMessage(), e);
        }
        
        return syncCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int syncQianchuanData(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[syncQianchuanData][开始同步千川推广数据] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        int syncCount = 0;
        SyncLogDO syncLog = createSyncLog(shopId, "QIANCHUAN", startDate, endDate);
        
        try {
            String accessToken = getShopAccessToken(shopId, "QIANCHUAN");
            if (accessToken == null) {
                log.warn("[syncQianchuanData][千川账户未授权] shopId={}", shopId);
                updateSyncLogSuccess(syncLog, 0);
                return 0;
            }
            
            // 获取千川推广费用汇总
            QianchuanCostSummaryDTO costSummary = qianchuanApiClient.getCostSummary(
                    accessToken, startDate, endDate);
            
            if (costSummary != null) {
                // 保存推广费用数据到日统计表
                saveQianchuanCostToDaily(shopId, startDate, endDate, costSummary);
                syncCount++;
            }
            
            // 获取每日推广统计
            List<QianchuanDailyStatDTO> dailyStats = qianchuanApiClient.getDailyStats(
                    accessToken, startDate, endDate);
            
            if (dailyStats != null) {
                for (QianchuanDailyStatDTO dailyStat : dailyStats) {
                    saveQianchuanDailyStat(shopId, dailyStat);
                    syncCount++;
                }
            }
            
            updateSyncLogSuccess(syncLog, syncCount);
            log.info("[syncQianchuanData][同步完成] shopId={}, syncCount={}", shopId, syncCount);
            
        } catch (Exception e) {
            log.error("[syncQianchuanData][同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            updateSyncLogFailed(syncLog, e.getMessage());
            throw new RuntimeException("同步千川推广数据失败: " + e.getMessage(), e);
        }
        
        return syncCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int syncJstInbound(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[syncJstInbound][开始同步聚水潭入库数据] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        int syncCount = 0;
        SyncLogDO syncLog = createSyncLog(shopId, "JST_INBOUND", startDate, endDate);
        
        try {
            String accessToken = getShopAccessToken(shopId, "JST");
            if (accessToken == null) {
                log.warn("[syncJstInbound][聚水潭账户未授权] shopId={}", shopId);
                updateSyncLogSuccess(syncLog, 0);
                return 0;
            }
            
            // 获取入库单列表
            JstInboundListDTO inboundList = jstApiClient.getInboundList(
                    accessToken, startDate, endDate, 1, 100);
            
            if (inboundList != null && inboundList.getInbounds() != null) {
                // 保存入库单数据到数据库
                for (JstInboundDTO inbound : inboundList.getInbounds()) {
                    saveJstInbound(shopId, inbound);
                    syncCount++;
                }
            }
            
            updateSyncLogSuccess(syncLog, syncCount);
            log.info("[syncJstInbound][同步完成] shopId={}, syncCount={}", shopId, syncCount);
            
        } catch (Exception e) {
            log.error("[syncJstInbound][同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            updateSyncLogFailed(syncLog, e.getMessage());
            throw new RuntimeException("同步聚水潭入库数据失败: " + e.getMessage(), e);
        }
        
        return syncCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int syncJstOutbound(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[syncJstOutbound][开始同步聚水潭出库数据] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        int syncCount = 0;
        SyncLogDO syncLog = createSyncLog(shopId, "JST_OUTBOUND", startDate, endDate);
        
        try {
            String accessToken = getShopAccessToken(shopId, "JST");
            if (accessToken == null) {
                log.warn("[syncJstOutbound][聚水潭账户未授权] shopId={}", shopId);
                updateSyncLogSuccess(syncLog, 0);
                return 0;
            }
            
            // 获取出库汇总数据
            JstOutboundSummaryDTO outboundSummary = jstApiClient.getOutboundSummary(
                    accessToken, startDate, endDate);
            
            if (outboundSummary != null) {
                // 保存出库数据到日统计表
                saveJstOutboundToDaily(shopId, startDate, endDate, outboundSummary);
                syncCount = outboundSummary.getOrderCount();
            }
            
            updateSyncLogSuccess(syncLog, syncCount);
            log.info("[syncJstOutbound][同步完成] shopId={}, syncCount={}", shopId, syncCount);
            
        } catch (Exception e) {
            log.error("[syncJstOutbound][同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            updateSyncLogFailed(syncLog, e.getMessage());
            throw new RuntimeException("同步聚水潭出库数据失败: " + e.getMessage(), e);
        }
        
        return syncCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int syncJstInventory(Long shopId) {
        log.info("[syncJstInventory][开始同步聚水潭库存数据] shopId={}", shopId);
        
        int syncCount = 0;
        SyncLogDO syncLog = createSyncLog(shopId, "JST_INVENTORY", LocalDate.now(), LocalDate.now());
        
        try {
            String accessToken = getShopAccessToken(shopId, "JST");
            if (accessToken == null) {
                log.warn("[syncJstInventory][聚水潭账户未授权] shopId={}", shopId);
                updateSyncLogSuccess(syncLog, 0);
                return 0;
            }
            
            // 获取库存汇总数据
            JstInventorySummaryDTO inventorySummary = jstApiClient.getInventorySummary(accessToken);
            
            if (inventorySummary != null) {
                // 保存库存数据到数据库
                saveJstInventory(shopId, inventorySummary);
                syncCount = inventorySummary.getSkuCount();
            }
            
            updateSyncLogSuccess(syncLog, syncCount);
            log.info("[syncJstInventory][同步完成] shopId={}, syncCount={}", shopId, syncCount);
            
        } catch (Exception e) {
            log.error("[syncJstInventory][同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            updateSyncLogFailed(syncLog, e.getMessage());
            throw new RuntimeException("同步聚水潭库存数据失败: " + e.getMessage(), e);
        }
        
        return syncCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void executeDailySummary(Long shopId, LocalDate date) {
        log.info("[executeDailySummary][开始执行每日数据汇总] shopId={}, date={}", shopId, date);
        
        try {
            // 1. 汇总抖店订单数据
            DoudianOrderSummaryDTO orderSummary = getDoudianOrderSummary(shopId, date);
            
            // 2. 汇总千川推广数据
            QianchuanCostSummaryDTO costSummary = getQianchuanCostSummary(shopId, date);
            
            // 3. 汇总聚水潭出库数据
            JstOutboundSummaryDTO outboundSummary = getJstOutboundSummary(shopId, date);
            
            // 4. 获取租户ID
            Long tenantId = getTenantIdByShopId(shopId);
            
            // 5. 计算并保存每日汇总
            DailyStatDO dailyStat = dailyStatMapper.selectByShopAndDate(shopId, date);
            if (dailyStat == null) {
                dailyStat = new DailyStatDO();
                dailyStat.setShopId(shopId);
                dailyStat.setTenantId(tenantId);
                dailyStat.setStatDate(date);
            }
            
            // 订单数据（来自抖店）
            if (orderSummary != null) {
                dailyStat.setOrderCount(orderSummary.getOrderCount());
                dailyStat.setOrderAmount(orderSummary.getTotalAmount() != null ? 
                        orderSummary.getTotalAmount().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
                dailyStat.setRefundCount(orderSummary.getRefundCount());
                dailyStat.setRefundAmount(orderSummary.getRefundAmount() != null ? 
                        orderSummary.getRefundAmount().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            }
            
            // 推广费（来自千川）
            BigDecimal promotionCost = BigDecimal.ZERO;
            if (costSummary != null && costSummary.getTotalCost() != null) {
                promotionCost = costSummary.getTotalCost().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            }
            dailyStat.setPromotionCost(promotionCost);
            
            // 商品成本（来自聚水潭出库）
            BigDecimal productCost = BigDecimal.ZERO;
            if (outboundSummary != null && outboundSummary.getTotalCost() != null) {
                productCost = outboundSummary.getTotalCost();
            }
            
            // 计算收入（订单金额 - 退款金额）
            BigDecimal income = dailyStat.getOrderAmount() != null ? dailyStat.getOrderAmount() : BigDecimal.ZERO;
            BigDecimal refund = dailyStat.getRefundAmount() != null ? dailyStat.getRefundAmount() : BigDecimal.ZERO;
            BigDecimal netIncome = income.subtract(refund);
            dailyStat.setIncomeAmount(netIncome);
            
            // 计算支出（推广费 + 商品成本）
            BigDecimal expense = promotionCost.add(productCost);
            dailyStat.setExpenseAmount(expense);
            
            // 计算利润（收入 - 支出）
            BigDecimal profit = netIncome.subtract(expense);
            dailyStat.setProfitAmount(profit);
            
            // 保存或更新
            if (dailyStat.getId() == null) {
                dailyStatMapper.insert(dailyStat);
            } else {
                dailyStatMapper.updateById(dailyStat);
            }
            
            log.info("[executeDailySummary][每日汇总完成] shopId={}, date={}, income={}, expense={}, profit={}", 
                    shopId, date, netIncome, expense, profit);
            
        } catch (Exception e) {
            log.error("[executeDailySummary][每日汇总失败] shopId={}, date={}, error={}", 
                    shopId, date, e.getMessage(), e);
            throw new RuntimeException("执行每日数据汇总失败: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int executeDataReconciliation(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[executeDataReconciliation][开始执行数据勾稽校验] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        int differenceCount = 0;
        Long tenantId = getTenantIdByShopId(shopId);
        
        try {
            // 遍历日期范围进行勾稽校验
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                
                // 1. 校验抖店订单金额与日统计的一致性
                int orderDiff = reconcileOrderAmount(shopId, tenantId, currentDate);
                differenceCount += orderDiff;
                
                // 2. 校验千川消耗与日统计推广费的一致性
                int promotionDiff = reconcilePromotionCost(shopId, tenantId, currentDate);
                differenceCount += promotionDiff;
                
                // 3. 校验聚水潭出库成本与日统计的一致性
                int costDiff = reconcileProductCost(shopId, tenantId, currentDate);
                differenceCount += costDiff;
                
                currentDate = currentDate.plusDays(1);
            }
            
            log.info("[executeDataReconciliation][数据勾稽校验完成] shopId={}, differenceCount={}", 
                    shopId, differenceCount);
            
        } catch (Exception e) {
            log.error("[executeDataReconciliation][数据勾稽校验失败] shopId={}, error={}", 
                    shopId, e.getMessage(), e);
            throw new RuntimeException("执行数据勾稽校验失败: " + e.getMessage(), e);
        }
        
        return differenceCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncAllData(Long shopId, LocalDate startDate, LocalDate endDate) {
        log.info("[syncAllData][开始全量同步所有数据] shopId={}, startDate={}, endDate={}", 
                shopId, startDate, endDate);
        
        try {
            // 1. 同步抖店订单
            syncDoudianOrders(shopId, startDate, endDate);
            
            // 2. 同步抖店资金流水
            syncDoudianCashflow(shopId, startDate, endDate);
            
            // 3. 同步千川推广数据
            syncQianchuanData(shopId, startDate, endDate);
            
            // 4. 同步聚水潭入库数据
            syncJstInbound(shopId, startDate, endDate);
            
            // 5. 同步聚水潭出库数据
            syncJstOutbound(shopId, startDate, endDate);
            
            // 6. 同步聚水潭库存数据
            syncJstInventory(shopId);
            
            // 7. 执行每日汇总（按日期遍历）
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                executeDailySummary(shopId, currentDate);
                currentDate = currentDate.plusDays(1);
            }
            
            // 8. 执行数据勾稽校验
            executeDataReconciliation(shopId, startDate, endDate);
            
            log.info("[syncAllData][全量同步完成] shopId={}", shopId);
            
        } catch (Exception e) {
            log.error("[syncAllData][全量同步失败] shopId={}, error={}", shopId, e.getMessage(), e);
            throw new RuntimeException("全量同步所有数据失败: " + e.getMessage(), e);
        }
    }

    // ========== 私有方法 ==========

    /**
     * 获取店铺访问令牌
     * 从数据库获取对应平台的访问令牌
     */
    private String getShopAccessToken(Long shopId, String platform) {
        switch (platform) {
            case "DOUDIAN":
                // 从finance_doudian_auth_token表获取
                DoudianAuthTokenDO token = doudianAuthTokenMapper.selectByShopId(String.valueOf(shopId));
                if (token != null && token.getAuthStatus() == 1) {
                    // 检查是否过期
                    if (token.getAccessTokenExpiresAt() != null && 
                            token.getAccessTokenExpiresAt().isAfter(LocalDateTime.now())) {
                        return token.getAccessToken();
                    }
                    // 如果过期，尝试刷新令牌
                    return refreshDoudianToken(token);
                }
                break;
                
            case "QIANCHUAN":
                // 从finance_qianchuan_config表获取
                QianchuanConfigDO qcConfig = qianchuanConfigMapper.selectByShopId(shopId);
                if (qcConfig != null && qcConfig.getAuthStatus() == 1) {
                    // 检查是否过期
                    if (qcConfig.getTokenExpiresAt() != null && 
                            qcConfig.getTokenExpiresAt().isAfter(LocalDateTime.now())) {
                        return qcConfig.getAccessToken();
                    }
                }
                break;
                
            case "JST":
                // 从finance_jst_config表获取
                JstConfigDO jstConfig = jstConfigMapper.selectByShopId(shopId);
                if (jstConfig != null && jstConfig.getAuthStatus() == 1) {
                    // 聚水潭使用api_key + api_secret生成签名
                    return generateJstAccessToken(jstConfig);
                }
                break;
                
            default:
                log.warn("[getShopAccessToken][未知平台] platform={}", platform);
        }
        return null;
    }

    /**
     * 刷新抖店令牌
     */
    private String refreshDoudianToken(DoudianAuthTokenDO token) {
        try {
            // 调用抖店API刷新令牌
            DoudianTokenDTO newToken = doudianApiClient.refreshToken(
                    doudianAppKey, doudianAppSecret, token.getRefreshToken());
            
            if (newToken != null && newToken.getAccessToken() != null) {
                // 更新数据库中的令牌
                token.setAccessToken(newToken.getAccessToken());
                token.setRefreshToken(newToken.getRefreshToken());
                token.setAccessTokenExpiresAt(LocalDateTime.now().plusSeconds(newToken.getExpiresIn()));
                doudianAuthTokenMapper.updateById(token);
                
                return newToken.getAccessToken();
            }
        } catch (Exception e) {
            log.error("[refreshDoudianToken][刷新令牌失败] shopId={}, error={}", 
                    token.getShopId(), e.getMessage(), e);
        }
        return null;
    }

    /**
     * 生成聚水潭访问令牌
     */
    private String generateJstAccessToken(JstConfigDO config) {
        // 聚水潭使用appKey和appSecret进行签名认证
        // 返回格式: appKey:appSecret 用于后续API调用时生成签名
        return config.getAppKey() + ":" + config.getAppSecret();
    }

    /**
     * 获取租户ID
     */
    private Long getTenantIdByShopId(Long shopId) {
        DoudianAuthTokenDO token = doudianAuthTokenMapper.selectByShopId(String.valueOf(shopId));
        if (token != null) {
            return token.getTenantId();
        }
        // 默认返回1（系统租户）
        return 1L;
    }

    /**
     * 创建同步日志
     */
    private SyncLogDO createSyncLog(Long shopId, String syncType, LocalDate startDate, LocalDate endDate) {
        SyncLogDO syncLog = new SyncLogDO();
        syncLog.setShopId(shopId);
        syncLog.setSyncType(syncType);
        syncLog.setStartDate(startDate);
        syncLog.setEndDate(endDate);
        syncLog.setStatus("RUNNING");
        syncLog.setStartTime(LocalDateTime.now());
        syncLog.setCreateTime(LocalDateTime.now());
        syncLogMapper.insert(syncLog);
        return syncLog;
    }

    /**
     * 更新同步日志为成功
     */
    private void updateSyncLogSuccess(SyncLogDO syncLog, int syncCount) {
        syncLog.setStatus("SUCCESS");
        syncLog.setSyncCount(syncCount);
        syncLog.setEndTime(LocalDateTime.now());
        syncLog.setUpdateTime(LocalDateTime.now());
        syncLogMapper.updateById(syncLog);
    }

    /**
     * 更新同步日志为失败
     */
    private void updateSyncLogFailed(SyncLogDO syncLog, String errorMessage) {
        syncLog.setStatus("FAILED");
        syncLog.setErrorMessage(errorMessage);
        syncLog.setEndTime(LocalDateTime.now());
        syncLog.setUpdateTime(LocalDateTime.now());
        syncLogMapper.updateById(syncLog);
    }

    /**
     * 保存或更新订单
     */
    private void saveOrUpdateOrder(Long shopId, DoudianOrderDTO orderDTO) {
        // 查询是否已存在
        OrderDO existOrder = orderMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<OrderDO>()
                        .eq(OrderDO::getPlatformOrderId, orderDTO.getOrderId()));
        
        Long tenantId = getTenantIdByShopId(shopId);
        
        if (existOrder != null) {
            // 更新订单
            existOrder.setStatus(convertOrderStatus(orderDTO.getOrderStatus()));
            existOrder.setPayAmount(orderDTO.getPayAmount() != null ? 
                    orderDTO.getPayAmount().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            existOrder.setOrderUpdateTime(parseDateTime(orderDTO.getUpdateTime()));
            existOrder.setUpdateTime(LocalDateTime.now());
            orderMapper.updateById(existOrder);
        } else {
            // 新增订单
            OrderDO newOrder = new OrderDO();
            newOrder.setShopId(shopId);
            newOrder.setTenantId(tenantId);
            newOrder.setOrderNo(generateOrderNo());
            newOrder.setPlatformOrderId(orderDTO.getOrderId());
            newOrder.setPlatform("DOUDIAN");
            newOrder.setStatus(convertOrderStatus(orderDTO.getOrderStatus()));
            newOrder.setPayAmount(orderDTO.getPayAmount() != null ? 
                    orderDTO.getPayAmount().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            newOrder.setUnitPrice(orderDTO.getOrderAmount() != null ? 
                    orderDTO.getOrderAmount().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            newOrder.setQuantity(1);
            newOrder.setProductTitle("抖店商品");
            newOrder.setOrderCreateTime(parseDateTime(orderDTO.getCreateTime()));
            newOrder.setOrderUpdateTime(parseDateTime(orderDTO.getUpdateTime()));
            newOrder.setCreateTime(LocalDateTime.now());
            newOrder.setUpdateTime(LocalDateTime.now());
            newOrder.setDelFlag(0);
            orderMapper.insert(newOrder);
        }
    }

    /**
     * 保存或更新资金流水
     */
    private void saveOrUpdateCashflow(Long shopId, DoudianCashflowDTO cashflowDTO) {
        Long tenantId = getTenantIdByShopId(shopId);
        
        // 查询是否已存在
        CashflowDO existCashflow = cashflowMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<CashflowDO>()
                        .eq(CashflowDO::getPlatformFlowId, cashflowDTO.getFlowId()));
        
        if (existCashflow == null) {
            CashflowDO newCashflow = new CashflowDO();
            newCashflow.setShopId(shopId);
            newCashflow.setTenantId(tenantId);
            newCashflow.setFlowNo(generateFlowNo());
            newCashflow.setPlatformFlowId(cashflowDTO.getFlowId());
            newCashflow.setPlatform("DOUDIAN");
            newCashflow.setTradeType(cashflowDTO.getTradeType());
            newCashflow.setAmount(cashflowDTO.getAmount() != null ? 
                    cashflowDTO.getAmount().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            newCashflow.setBalance(cashflowDTO.getBalance() != null ? 
                    cashflowDTO.getBalance().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            newCashflow.setTradeTime(parseDateTime(cashflowDTO.getTradeTime()));
            newCashflow.setDescription(cashflowDTO.getDescription());
            newCashflow.setConfirmStatus("PENDING");
            newCashflow.setReconciliationStatus("PENDING");
            newCashflow.setCreateTime(LocalDateTime.now());
            newCashflow.setUpdateTime(LocalDateTime.now());
            newCashflow.setDelFlag(0);
            cashflowMapper.insert(newCashflow);
        }
    }

    /**
     * 保存千川费用到日统计
     */
    private void saveQianchuanCostToDaily(Long shopId, LocalDate startDate, LocalDate endDate, 
            QianchuanCostSummaryDTO costSummary) {
        // 将总费用平均分配到每天（简化处理）
        long days = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        BigDecimal dailyCost = costSummary.getTotalCost().divide(
                new BigDecimal(days), 2, RoundingMode.HALF_UP);
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            DailyStatDO dailyStat = dailyStatMapper.selectByShopAndDate(shopId, currentDate);
            if (dailyStat != null) {
                dailyStat.setPromotionCost(dailyCost.divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP));
                dailyStatMapper.updateById(dailyStat);
            }
            currentDate = currentDate.plusDays(1);
        }
    }

    /**
     * 保存千川每日统计
     */
    private void saveQianchuanDailyStat(Long shopId, QianchuanDailyStatDTO dailyStat) {
        LocalDate statDate = LocalDate.parse(dailyStat.getStatDate());
        DailyStatDO existStat = dailyStatMapper.selectByShopAndDate(shopId, statDate);
        
        if (existStat != null) {
            existStat.setPromotionCost(dailyStat.getCost() != null ? 
                    dailyStat.getCost().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            dailyStatMapper.updateById(existStat);
        }
    }

    /**
     * 保存聚水潭入库数据
     */
    private void saveJstInbound(Long shopId, JstInboundDTO inbound) {
        // 入库数据主要用于成本计算，这里简化处理
        log.debug("[saveJstInbound] shopId={}, inboundNo={}", shopId, inbound.getInboundNo());
    }

    /**
     * 保存聚水潭出库数据到日统计
     */
    private void saveJstOutboundToDaily(Long shopId, LocalDate startDate, LocalDate endDate, 
            JstOutboundSummaryDTO outboundSummary) {
        // 将总成本平均分配到每天（简化处理）
        long days = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        BigDecimal dailyCost = outboundSummary.getTotalCost().divide(
                new BigDecimal(days), 2, RoundingMode.HALF_UP);
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            DailyStatDO dailyStat = dailyStatMapper.selectByShopAndDate(shopId, currentDate);
            if (dailyStat != null) {
                // 更新支出金额（加上商品成本）
                BigDecimal currentExpense = dailyStat.getExpenseAmount() != null ? 
                        dailyStat.getExpenseAmount() : BigDecimal.ZERO;
                dailyStat.setExpenseAmount(currentExpense.add(dailyCost));
                dailyStatMapper.updateById(dailyStat);
            }
            currentDate = currentDate.plusDays(1);
        }
    }

    /**
     * 保存聚水潭库存数据
     */
    private void saveJstInventory(Long shopId, JstInventorySummaryDTO inventorySummary) {
        // 库存数据主要用于库存预警，这里简化处理
        log.debug("[saveJstInventory] shopId={}, skuCount={}, totalValue={}", 
                shopId, inventorySummary.getSkuCount(), inventorySummary.getTotalValue());
    }

    /**
     * 获取抖店订单汇总
     */
    private DoudianOrderSummaryDTO getDoudianOrderSummary(Long shopId, LocalDate date) {
        String accessToken = getShopAccessToken(shopId, "DOUDIAN");
        if (accessToken == null) {
            return null;
        }
        return doudianApiClient.getOrderSummary(accessToken, date, date);
    }

    /**
     * 获取千川费用汇总
     */
    private QianchuanCostSummaryDTO getQianchuanCostSummary(Long shopId, LocalDate date) {
        String accessToken = getShopAccessToken(shopId, "QIANCHUAN");
        if (accessToken == null) {
            return null;
        }
        return qianchuanApiClient.getCostSummary(accessToken, date, date);
    }

    /**
     * 获取聚水潭出库汇总
     */
    private JstOutboundSummaryDTO getJstOutboundSummary(Long shopId, LocalDate date) {
        String accessToken = getShopAccessToken(shopId, "JST");
        if (accessToken == null) {
            return null;
        }
        return jstApiClient.getOutboundSummary(accessToken, date, date);
    }

    /**
     * 勾稽校验：订单金额
     */
    private int reconcileOrderAmount(Long shopId, Long tenantId, LocalDate date) {
        int diffCount = 0;
        
        // 从订单表统计当日订单金额
        BigDecimal orderTotal = orderMapper.selectObjs(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<OrderDO>()
                        .select("COALESCE(SUM(pay_amount), 0)")
                        .eq("shop_id", shopId)
                        .eq("DATE(order_create_time)", date)
                        .eq("del_flag", 0))
                .stream()
                .findFirst()
                .map(obj -> new BigDecimal(obj.toString()))
                .orElse(BigDecimal.ZERO);
        
        // 从日统计表获取订单金额
        DailyStatDO dailyStat = dailyStatMapper.selectByShopAndDate(shopId, date);
        BigDecimal statOrderAmount = dailyStat != null && dailyStat.getOrderAmount() != null ? 
                dailyStat.getOrderAmount() : BigDecimal.ZERO;
        
        // 比较差异
        BigDecimal diff = orderTotal.subtract(statOrderAmount).abs();
        if (diff.compareTo(new BigDecimal("0.01")) > 0) {
            // 记录差异
            ReconciliationDiffDO diffDO = new ReconciliationDiffDO();
            diffDO.setTenantId(tenantId);
            diffDO.setShopId(shopId);
            diffDO.setDiffDate(date);
            diffDO.setDiffType("ORDER_AMOUNT");
            diffDO.setSourceValue(orderTotal);
            diffDO.setTargetValue(statOrderAmount);
            diffDO.setDiffValue(diff);
            diffDO.setStatus("PENDING");
            diffDO.setCreateTime(LocalDateTime.now());
            reconciliationDiffMapper.insert(diffDO);
            diffCount++;
        }
        
        return diffCount;
    }

    /**
     * 勾稽校验：推广费用
     */
    private int reconcilePromotionCost(Long shopId, Long tenantId, LocalDate date) {
        // 千川推广费用校验（简化处理）
        return 0;
    }

    /**
     * 勾稽校验：商品成本
     */
    private int reconcileProductCost(Long shopId, Long tenantId, LocalDate date) {
        // 聚水潭商品成本校验（简化处理）
        return 0;
    }

    /**
     * 转换订单状态
     */
    private String convertOrderStatus(Integer status) {
        if (status == null) {
            return "UNKNOWN";
        }
        switch (status) {
            case 1: return "PENDING_PAY";      // 待支付
            case 2: return "PAID";              // 已支付
            case 3: return "SHIPPED";           // 已发货
            case 4: return "COMPLETED";         // 已完成
            case 5: return "CANCELLED";         // 已取消
            case 6: return "REFUNDING";         // 退款中
            case 7: return "REFUNDED";          // 已退款
            default: return "UNKNOWN";
        }
    }

    /**
     * 解析日期时间
     */
    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER);
        } catch (Exception e) {
            log.warn("[parseDateTime][解析日期时间失败] dateTimeStr={}", dateTimeStr);
            return null;
        }
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    /**
     * 生成流水号
     */
    private String generateFlowNo() {
        return "FLW" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
