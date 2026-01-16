package com.shandianzhang.model.vo;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 订单统计视图对象
 * 
 * <p>用于封装订单统计数据</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
public class OrderStatsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 统计周期（日期/月份/年份）
     */
    private String period;

    /**
     * 总订单数
     */
    private long totalOrders;

    /**
     * 待付款订单数
     */
    private long pendingOrders;

    /**
     * 已付款订单数
     */
    private long paidOrders;

    /**
     * 已发货订单数
     */
    private long shippedOrders;

    /**
     * 已完成订单数
     */
    private long completedOrders;

    /**
     * 已取消订单数
     */
    private long cancelledOrders;

    /**
     * 已退款订单数
     */
    private long refundedOrders;

    /**
     * 订单总金额
     */
    private BigDecimal totalAmount;

    /**
     * 支付总金额
     */
    private BigDecimal totalPayment;

    /**
     * 退款总金额
     */
    private BigDecimal totalRefund;

    /**
     * 成本总金额
     */
    private BigDecimal totalCost;

    /**
     * 毛利润总金额
     */
    private BigDecimal totalProfit;

    /**
     * 毛利率（百分比）
     */
    private BigDecimal profitRate;

    /**
     * 平均订单金额
     */
    private BigDecimal avgOrderAmount;

    /**
     * 平均毛利润
     */
    private BigDecimal avgProfit;

    // ==================== Getter & Setter ====================

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getPaidOrders() {
        return paidOrders;
    }

    public void setPaidOrders(long paidOrders) {
        this.paidOrders = paidOrders;
    }

    public long getShippedOrders() {
        return shippedOrders;
    }

    public void setShippedOrders(long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public long getRefundedOrders() {
        return refundedOrders;
    }

    public void setRefundedOrders(long refundedOrders) {
        this.refundedOrders = refundedOrders;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(BigDecimal totalPayment) {
        this.totalPayment = totalPayment;
    }

    public BigDecimal getTotalRefund() {
        return totalRefund;
    }

    public void setTotalRefund(BigDecimal totalRefund) {
        this.totalRefund = totalRefund;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(BigDecimal totalProfit) {
        this.totalProfit = totalProfit;
    }

    public BigDecimal getProfitRate() {
        return profitRate;
    }

    public void setProfitRate(BigDecimal profitRate) {
        this.profitRate = profitRate;
    }

    public BigDecimal getAvgOrderAmount() {
        return avgOrderAmount;
    }

    public void setAvgOrderAmount(BigDecimal avgOrderAmount) {
        this.avgOrderAmount = avgOrderAmount;
    }

    public BigDecimal getAvgProfit() {
        return avgProfit;
    }

    public void setAvgProfit(BigDecimal avgProfit) {
        this.avgProfit = avgProfit;
    }
}
