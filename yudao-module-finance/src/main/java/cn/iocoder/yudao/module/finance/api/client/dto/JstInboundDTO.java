package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 聚水潭入库单DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class JstInboundDTO {

    /**
     * 入库单ID
     */
    private String inboundId;

    /**
     * 入库单号
     */
    private String inboundNo;

    /**
     * 状态
     */
    private String status;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 数量
     */
    private Integer quantity;

    /**
     * 创建时间
     */
    private String createTime;
}
