package com.shandianzhang.model.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 勾稽检查记录实体类
 * 
 * <p>对应数据库表：t_reconciliation_log</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
public class ReconciliationEntity {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 租户ID
     */
    private String tenantId;

    /**
     * 勾稽类型
     * <p>realtime-实时勾稽 daily-日结勾稽 monthly-月结勾稽</p>
     */
    private String reconciliationType;

    /**
     * 勾稽日期
     */
    private Date reconciliationDate;

    /**
     * 勾稽月份（格式：yyyy-MM）
     */
    private String reconciliationMonth;

    /**
     * 勾稽状态
     * <p>success-成功 warning-警告 error-异常</p>
     */
    private String status;

    /**
     * 检查项总数
     */
    private Integer totalItems;

    /**
     * 通过项数
     */
    private Integer passedItems;

    /**
     * 警告项数
     */
    private Integer warningItems;

    /**
     * 异常项数
     */
    private Integer errorItems;

    /**
     * 异常数量
     */
    private Integer exceptionCount;

    /**
     * 勾稽摘要
     */
    private String summary;

    /**
     * 勾稽详情（JSON格式）
     */
    private String details;

    /**
     * 执行耗时（毫秒）
     */
    private Long executionTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    // ==================== Getter & Setter ====================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getReconciliationType() {
        return reconciliationType;
    }

    public void setReconciliationType(String reconciliationType) {
        this.reconciliationType = reconciliationType;
    }

    public Date getReconciliationDate() {
        return reconciliationDate;
    }

    public void setReconciliationDate(Date reconciliationDate) {
        this.reconciliationDate = reconciliationDate;
    }

    public String getReconciliationMonth() {
        return reconciliationMonth;
    }

    public void setReconciliationMonth(String reconciliationMonth) {
        this.reconciliationMonth = reconciliationMonth;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public Integer getPassedItems() {
        return passedItems;
    }

    public void setPassedItems(Integer passedItems) {
        this.passedItems = passedItems;
    }

    public Integer getWarningItems() {
        return warningItems;
    }

    public void setWarningItems(Integer warningItems) {
        this.warningItems = warningItems;
    }

    public Integer getErrorItems() {
        return errorItems;
    }

    public void setErrorItems(Integer errorItems) {
        this.errorItems = errorItems;
    }

    public Integer getExceptionCount() {
        return exceptionCount;
    }

    public void setExceptionCount(Integer exceptionCount) {
        this.exceptionCount = exceptionCount;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(Long executionTime) {
        this.executionTime = executionTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
