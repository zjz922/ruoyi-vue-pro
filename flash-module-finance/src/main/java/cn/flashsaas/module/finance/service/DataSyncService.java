package cn.flashsaas.module.finance.service;

import java.time.LocalDate;

/**
 * 数据同步 Service 接口
 * 
 * 负责从抖店、千川、聚水潭API同步数据到本地数据库
 * 
 * @author 闪电帐PRO
 */
public interface DataSyncService {

    /**
     * 同步抖店订单数据
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步的订单数量
     */
    int syncDoudianOrders(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 同步抖店资金流水数据
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步的流水数量
     */
    int syncDoudianCashflow(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 同步千川推广数据
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步的记录数量
     */
    int syncQianchuanData(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 同步聚水潭入库数据
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步的入库单数量
     */
    int syncJstInbound(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 同步聚水潭出库数据
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步的出库单数量
     */
    int syncJstOutbound(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 同步聚水潭库存数据
     * 
     * @param shopId 店铺ID
     * @return 同步的SKU数量
     */
    int syncJstInventory(Long shopId);

    /**
     * 执行每日数据汇总
     * 
     * @param shopId 店铺ID
     * @param date 汇总日期
     */
    void executeDailySummary(Long shopId, LocalDate date);

    /**
     * 执行数据勾稽校验
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 校验结果（差异数量）
     */
    int executeDataReconciliation(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 全量同步所有数据
     * 
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     */
    void syncAllData(Long shopId, LocalDate startDate, LocalDate endDate);
}
