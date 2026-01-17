package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 抖店资金流水DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianCashflowDTO {

    /**
     * 流水ID
     */
    private String flowId;

    /**
     * 交易类型
     */
    private String tradeType;

    /**
     * 金额（分）
     */
    private BigDecimal amount;

    /**
     * 余额（分）
     */
    private BigDecimal balance;

    /**
     * 交易时间
     */
    private String tradeTime;

    /**
     * 描述
     */
    private String description;

    /**
     * 关联订单ID
     */
    private String orderId;
}
