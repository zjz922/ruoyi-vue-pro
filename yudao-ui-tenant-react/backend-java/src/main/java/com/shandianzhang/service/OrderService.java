package com.shandianzhang.service;

import com.shandianzhang.model.dto.OrderDTO;
import com.shandianzhang.model.entity.OrderEntity;
import com.shandianzhang.model.vo.OrderListVO;
import com.shandianzhang.model.vo.OrderStatsVO;
import com.shandianzhang.model.vo.PageResult;

import java.util.Date;
import java.util.List;

/**
 * 订单服务接口
 * 
 * <p>定义订单管理相关的业务方法</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
public interface OrderService {

    /**
     * 分页查询订单列表
     * 
     * @param tenantId   租户ID
     * @param keyword    搜索关键词（订单号/商品名称）
     * @param status     订单状态
     * @param startDate  开始日期
     * @param endDate    结束日期
     * @param pageNo     页码
     * @param pageSize   每页条数
     * @return 分页结果
     */
    PageResult<OrderListVO> listOrders(String tenantId, String keyword, Integer status,
                                       Date startDate, Date endDate, int pageNo, int pageSize);

    /**
     * 根据ID查询订单详情
     * 
     * @param tenantId 租户ID
     * @param orderId  订单ID
     * @return 订单详情
     */
    OrderEntity getOrderById(String tenantId, Long orderId);

    /**
     * 根据订单号查询订单
     * 
     * @param tenantId 租户ID
     * @param orderNo  订单号
     * @return 订单实体
     */
    OrderEntity getOrderByNo(String tenantId, String orderNo);

    /**
     * 获取订单统计数据
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 统计数据
     */
    OrderStatsVO getOrderStats(String tenantId, Date startDate, Date endDate);

    /**
     * 获取最近30天订单明细
     * 
     * @param tenantId 租户ID
     * @return 订单明细列表
     */
    List<OrderDTO> getThirtyDaysOrders(String tenantId);

    /**
     * 获取按月汇总统计
     * 
     * @param tenantId 租户ID
     * @param year     年份
     * @return 月度统计列表
     */
    List<OrderStatsVO> getMonthlyStats(String tenantId, int year);

    /**
     * 获取按年汇总统计
     * 
     * @param tenantId 租户ID
     * @return 年度统计列表
     */
    List<OrderStatsVO> getYearlyStats(String tenantId);

    /**
     * 从抖店同步订单
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 同步结果
     */
    SyncResult syncFromDoudian(String tenantId, Date startDate, Date endDate);

    /**
     * 订单对账
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 对账结果
     */
    CompareResult compareOrders(String tenantId, Date startDate, Date endDate);

    /**
     * 同步结果
     */
    class SyncResult {
        private String syncId;
        private Date syncTime;
        private String status;
        private int addedCount;
        private int updatedCount;
        private int failedCount;
        private List<String> errors;

        // Getter & Setter
        public String getSyncId() { return syncId; }
        public void setSyncId(String syncId) { this.syncId = syncId; }
        public Date getSyncTime() { return syncTime; }
        public void setSyncTime(Date syncTime) { this.syncTime = syncTime; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getAddedCount() { return addedCount; }
        public void setAddedCount(int addedCount) { this.addedCount = addedCount; }
        public int getUpdatedCount() { return updatedCount; }
        public void setUpdatedCount(int updatedCount) { this.updatedCount = updatedCount; }
        public int getFailedCount() { return failedCount; }
        public void setFailedCount(int failedCount) { this.failedCount = failedCount; }
        public List<String> getErrors() { return errors; }
        public void setErrors(List<String> errors) { this.errors = errors; }
    }

    /**
     * 对账结果
     */
    class CompareResult {
        private int totalOrders;
        private int matchedOrders;
        private int mismatchedOrders;
        private int newOrders;
        private List<MismatchDetail> mismatches;

        // Getter & Setter
        public int getTotalOrders() { return totalOrders; }
        public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }
        public int getMatchedOrders() { return matchedOrders; }
        public void setMatchedOrders(int matchedOrders) { this.matchedOrders = matchedOrders; }
        public int getMismatchedOrders() { return mismatchedOrders; }
        public void setMismatchedOrders(int mismatchedOrders) { this.mismatchedOrders = mismatchedOrders; }
        public int getNewOrders() { return newOrders; }
        public void setNewOrders(int newOrders) { this.newOrders = newOrders; }
        public List<MismatchDetail> getMismatches() { return mismatches; }
        public void setMismatches(List<MismatchDetail> mismatches) { this.mismatches = mismatches; }
    }

    /**
     * 差异详情
     */
    class MismatchDetail {
        private String orderNo;
        private String field;
        private String localValue;
        private String remoteValue;

        // Getter & Setter
        public String getOrderNo() { return orderNo; }
        public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        public String getLocalValue() { return localValue; }
        public void setLocalValue(String localValue) { this.localValue = localValue; }
        public String getRemoteValue() { return remoteValue; }
        public void setRemoteValue(String remoteValue) { this.remoteValue = remoteValue; }
    }
}
