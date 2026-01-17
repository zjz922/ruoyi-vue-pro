package cn.flashsaas.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 抖店订单DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianOrderDTO {

    /**
     * 订单ID
     */
    private String orderId;

    /**
     * 订单状态
     */
    private Integer orderStatus;

    /**
     * 订单金额（分）
     */
    private BigDecimal orderAmount;

    /**
     * 实付金额（分）
     */
    private BigDecimal payAmount;

    /**
     * 退款金额（分）
     */
    private BigDecimal refundAmount;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 更新时间
     */
    private String updateTime;
}
