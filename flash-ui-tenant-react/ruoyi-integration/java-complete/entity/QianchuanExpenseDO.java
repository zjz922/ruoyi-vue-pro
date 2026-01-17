package com.flash.module.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.flash.framework.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 千川推广费 DO
 */
@TableName("finance_qianchuan_expenses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QianchuanExpenseDO extends BaseEntity {

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
     * 计划ID
     */
    private String campaignId;

    /**
     * 计划名称
     */
    private String campaignName;

    /**
     * 消耗金额
     */
    private BigDecimal expense;

    /**
     * 展现次数
     */
    private Long impressions;

    /**
     * 点击次数
     */
    private Long clicks;

    /**
     * 点击率
     */
    private BigDecimal ctr;

    /**
     * 平均点击成本
     */
    private BigDecimal cpc;

    /**
     * 转化数
     */
    private Long conversions;

    /**
     * 转化率
     */
    private BigDecimal conversionRate;

    /**
     * 成交金额
     */
    private BigDecimal gmv;

    /**
     * ROI
     */
    private BigDecimal roi;

    /**
     * 数据来源（手工/自动同步）
     */
    private String dataSource;

    /**
     * 备注
     */
    private String remark;
}
