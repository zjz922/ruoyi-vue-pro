package cn.flashsaas.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 聚水潭出库汇总DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class JstOutboundSummaryDTO {

    /**
     * 总金额
     */
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * 总成本
     */
    private BigDecimal totalCost = BigDecimal.ZERO;

    /**
     * 总数量
     */
    private Integer totalQuantity = 0;

    /**
     * 订单数量
     */
    private Integer orderCount = 0;

    /**
     * 同步时间
     */
    private LocalDateTime syncTime;
}
