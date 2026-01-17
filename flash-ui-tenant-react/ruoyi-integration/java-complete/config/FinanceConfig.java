package com.flash.module.finance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 财务模块配置
 */
@Configuration
@EnableScheduling
public class FinanceConfig {

    /**
     * 财务模块常量
     */
    public static class FinanceConstants {
        // 数据来源
        public static final String DATA_SOURCE_MANUAL = "manual";
        public static final String DATA_SOURCE_AUTO = "auto";

        // 同步状态
        public static final Integer SYNC_STATUS_PENDING = 0;
        public static final Integer SYNC_STATUS_SUCCESS = 1;
        public static final Integer SYNC_STATUS_FAILURE = 2;

        // 授权状态
        public static final Integer AUTH_STATUS_UNAUTHORIZED = 0;
        public static final Integer AUTH_STATUS_AUTHORIZED = 1;

        // 订单状态
        public static final String ORDER_STATUS_PENDING = "pending";
        public static final String ORDER_STATUS_COMPLETED = "completed";
        public static final String ORDER_STATUS_CANCELLED = "cancelled";

        // 发货状态
        public static final String SHIPMENT_STATUS_PENDING = "pending";
        public static final String SHIPMENT_STATUS_SHIPPED = "shipped";
        public static final String SHIPMENT_STATUS_RECEIVED = "received";

        // 售后状态
        public static final String AFTER_SALE_STATUS_NONE = "none";
        public static final String AFTER_SALE_STATUS_PENDING = "pending";
        public static final String AFTER_SALE_STATUS_COMPLETED = "completed";
    }

    /**
     * 成本计算方法
     */
    public enum CostCalculationMethod {
        WEIGHTED_AVERAGE("加权平均法"),
        FIFO("先进先出法"),
        LATEST("最新成本法");

        private final String description;

        CostCalculationMethod(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
