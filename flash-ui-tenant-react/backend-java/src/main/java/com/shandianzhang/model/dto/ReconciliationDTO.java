package com.shandianzhang.model.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 勾稽检查数据传输对象
 * 
 * <p>用于服务层和控制层之间的数据传输</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
public class ReconciliationDTO {

    /**
     * 勾稽ID
     */
    private String id;

    /**
     * 勾稽类型
     */
    private String type;

    /**
     * 检查时间
     */
    private Date checkTime;

    /**
     * 勾稽状态
     */
    private String status;

    /**
     * 检查项列表
     */
    private List<ReconciliationItemDTO> items;

    /**
     * 异常数量
     */
    private Integer exceptionCount;

    /**
     * 勾稽摘要
     */
    private String summary;

    // ==================== Getter & Setter ====================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(Date checkTime) {
        this.checkTime = checkTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ReconciliationItemDTO> getItems() {
        return items;
    }

    public void setItems(List<ReconciliationItemDTO> items) {
        this.items = items;
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

    /**
     * 勾稽检查项DTO
     */
    public static class ReconciliationItemDTO {

        /**
         * 检查项名称
         */
        private String name;

        /**
         * 期望值
         */
        private BigDecimal expected;

        /**
         * 实际值
         */
        private BigDecimal actual;

        /**
         * 差异值
         */
        private BigDecimal difference;

        /**
         * 差异率
         */
        private BigDecimal differenceRate;

        /**
         * 检查状态
         */
        private String status;

        /**
         * 容差
         */
        private BigDecimal tolerance;

        // ==================== Getter & Setter ====================

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public BigDecimal getExpected() {
            return expected;
        }

        public void setExpected(BigDecimal expected) {
            this.expected = expected;
        }

        public BigDecimal getActual() {
            return actual;
        }

        public void setActual(BigDecimal actual) {
            this.actual = actual;
        }

        public BigDecimal getDifference() {
            return difference;
        }

        public void setDifference(BigDecimal difference) {
            this.difference = difference;
        }

        public BigDecimal getDifferenceRate() {
            return differenceRate;
        }

        public void setDifferenceRate(BigDecimal differenceRate) {
            this.differenceRate = differenceRate;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public BigDecimal getTolerance() {
            return tolerance;
        }

        public void setTolerance(BigDecimal tolerance) {
            this.tolerance = tolerance;
        }
    }
}
