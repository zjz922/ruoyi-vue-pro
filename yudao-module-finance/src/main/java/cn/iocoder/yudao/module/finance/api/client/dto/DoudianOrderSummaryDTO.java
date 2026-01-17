package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 抖店订单汇总DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianOrderSummaryDTO {

    /**
     * 销售收入
     */
    private BigDecimal salesRevenue = BigDecimal.ZERO;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount = BigDecimal.ZERO;

    /**
     * 达人佣金
     */
    private BigDecimal commissionFee = BigDecimal.ZERO;

    /**
     * 平台服务费
     */
    private BigDecimal serviceFee = BigDecimal.ZERO;

    /**
     * 快递费
     */
    private BigDecimal shippingFee = BigDecimal.ZERO;

    /**
     * 运费险
     */
    private BigDecimal insuranceFee = BigDecimal.ZERO;

    /**
     * 售后赔付
     */
    private BigDecimal afterSaleCost = BigDecimal.ZERO;

    /**
     * 订单数量
     */
    private Integer orderCount = 0;

    /**
     * 退款数量
     */
    private Integer refundCount = 0;

    /**
     * 订单总金额（分）
     */
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * 同步时间
     */
    private LocalDateTime syncTime;
}
