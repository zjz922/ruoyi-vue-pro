package com.yudao.module.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.yudao.framework.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 每日统计 DO
 */
@TableName("finance_daily_stats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatsDO extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 统计日期
     */
    private LocalDate statsDate;

    /**
     * 发货数
     */
    private Integer shipmentCount;

    /**
     * 销售额
     */
    private BigDecimal salesAmount;

    /**
     * 退款额
     */
    private BigDecimal refundAmount;

    /**
     * 快递费
     */
    private BigDecimal expressCharge;

    /**
     * 达人佣金
     */
    private BigDecimal influencerCommission;

    /**
     * 服务费
     */
    private BigDecimal serviceFee;

    /**
     * 商品成本
     */
    private BigDecimal productCost;

    /**
     * 推广费
     */
    private BigDecimal promotionFee;

    /**
     * 保险费
     */
    private BigDecimal insuranceFee;

    /**
     * 其他费用
     */
    private BigDecimal otherFee;

    /**
     * 赔付
     */
    private BigDecimal compensation;

    /**
     * 预计利润
     */
    private BigDecimal estimatedProfit;

    /**
     * 利润率
     */
    private BigDecimal profitRate;

    /**
     * 数据来源（手工/自动同步）
     */
    private String dataSource;

    /**
     * 备注
     */
    private String remark;
}
