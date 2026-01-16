package com.shandianzhang.service;

import com.shandianzhang.model.dto.ReconciliationDTO;
import com.shandianzhang.model.entity.ReconciliationEntity;
import com.shandianzhang.model.vo.PageResult;
import com.shandianzhang.model.vo.ReconciliationExceptionVO;

import java.util.Date;
import java.util.List;

/**
 * 勾稽检查服务接口
 * 
 * <p>定义勾稽检查相关的业务方法</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
public interface ReconciliationService {

    /**
     * 执行实时勾稽检查
     * 
     * <p>检查订单管理与订单统计的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @return 勾稽结果
     */
    ReconciliationDTO executeRealtimeReconciliation(String tenantId);

    /**
     * 执行日结勾稽检查
     * 
     * <p>检查订单统计与订单明细的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @param date     日期
     * @return 勾稽结果
     */
    ReconciliationDTO executeDailyReconciliation(String tenantId, Date date);

    /**
     * 执行月结勾稽检查
     * 
     * <p>检查按月汇总与按年汇总的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @param month    月份（格式：yyyy-MM）
     * @return 勾稽结果
     */
    ReconciliationDTO executeMonthlyReconciliation(String tenantId, String month);

    /**
     * 获取待处理异常列表
     * 
     * @param tenantId 租户ID
     * @param status   异常状态
     * @param pageNo   页码
     * @param pageSize 每页条数
     * @return 分页结果
     */
    PageResult<ReconciliationExceptionVO> getPendingExceptions(String tenantId, String status,
                                                                int pageNo, int pageSize);

    /**
     * 解决异常
     * 
     * @param tenantId    租户ID
     * @param exceptionId 异常ID
     * @param resolution  解决方案
     * @return 是否成功
     */
    boolean resolveException(String tenantId, Long exceptionId, String resolution);

    /**
     * 获取勾稽日志
     * 
     * @param tenantId 租户ID
     * @param type     勾稽类型
     * @param pageNo   页码
     * @param pageSize 每页条数
     * @return 分页结果
     */
    PageResult<ReconciliationEntity> getReconciliationLogs(String tenantId, String type,
                                                           int pageNo, int pageSize);

    /**
     * 执行8个模块的完整勾稽检查
     * 
     * <p>检查以下模块间的数据一致性：</p>
     * <ul>
     *   <li>订单管理 ↔ 订单统计</li>
     *   <li>订单统计 ↔ 订单明细</li>
     *   <li>订单明细 ↔ 最近30天明细</li>
     *   <li>最近30天明细 ↔ 按月汇总</li>
     *   <li>按月汇总 ↔ 按年汇总</li>
     *   <li>成本配置 → 订单明细</li>
     *   <li>单据中心 → 订单管理</li>
     * </ul>
     * 
     * @param tenantId 租户ID
     * @return 完整勾稽结果
     */
    FullReconciliationResult executeFullReconciliation(String tenantId);

    /**
     * 完整勾稽结果
     */
    class FullReconciliationResult {
        
        /**
         * 订单管理 ↔ 订单统计 勾稽结果
         */
        private ReconciliationDTO orderManagementToStats;
        
        /**
         * 订单统计 ↔ 订单明细 勾稽结果
         */
        private ReconciliationDTO statsToDetail;
        
        /**
         * 订单明细 ↔ 最近30天明细 勾稽结果
         */
        private ReconciliationDTO detailToThirtyDays;
        
        /**
         * 最近30天明细 ↔ 按月汇总 勾稽结果
         */
        private ReconciliationDTO thirtyDaysToMonthly;
        
        /**
         * 按月汇总 ↔ 按年汇总 勾稽结果
         */
        private ReconciliationDTO monthlyToYearly;
        
        /**
         * 成本配置 → 订单明细 勾稽结果
         */
        private ReconciliationDTO costToDetail;
        
        /**
         * 单据中心 → 订单管理 勾稽结果
         */
        private ReconciliationDTO documentToOrder;
        
        /**
         * 总体状态
         */
        private String overallStatus;
        
        /**
         * 总异常数
         */
        private int totalExceptions;

        // Getter & Setter
        public ReconciliationDTO getOrderManagementToStats() { return orderManagementToStats; }
        public void setOrderManagementToStats(ReconciliationDTO orderManagementToStats) { this.orderManagementToStats = orderManagementToStats; }
        public ReconciliationDTO getStatsToDetail() { return statsToDetail; }
        public void setStatsToDetail(ReconciliationDTO statsToDetail) { this.statsToDetail = statsToDetail; }
        public ReconciliationDTO getDetailToThirtyDays() { return detailToThirtyDays; }
        public void setDetailToThirtyDays(ReconciliationDTO detailToThirtyDays) { this.detailToThirtyDays = detailToThirtyDays; }
        public ReconciliationDTO getThirtyDaysToMonthly() { return thirtyDaysToMonthly; }
        public void setThirtyDaysToMonthly(ReconciliationDTO thirtyDaysToMonthly) { this.thirtyDaysToMonthly = thirtyDaysToMonthly; }
        public ReconciliationDTO getMonthlyToYearly() { return monthlyToYearly; }
        public void setMonthlyToYearly(ReconciliationDTO monthlyToYearly) { this.monthlyToYearly = monthlyToYearly; }
        public ReconciliationDTO getCostToDetail() { return costToDetail; }
        public void setCostToDetail(ReconciliationDTO costToDetail) { this.costToDetail = costToDetail; }
        public ReconciliationDTO getDocumentToOrder() { return documentToOrder; }
        public void setDocumentToOrder(ReconciliationDTO documentToOrder) { this.documentToOrder = documentToOrder; }
        public String getOverallStatus() { return overallStatus; }
        public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }
        public int getTotalExceptions() { return totalExceptions; }
        public void setTotalExceptions(int totalExceptions) { this.totalExceptions = totalExceptions; }
    }
}
