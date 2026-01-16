package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 千川推广计划DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class QianchuanCampaignDTO {

    /**
     * 计划ID
     */
    private Long campaignId;

    /**
     * 计划名称
     */
    private String campaignName;

    /**
     * 状态
     */
    private String status;

    /**
     * 预算
     */
    private BigDecimal budget;
}
