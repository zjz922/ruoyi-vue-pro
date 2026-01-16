package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.util.List;

/**
 * 千川推广计划列表DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class QianchuanCampaignListDTO {

    /**
     * 推广计划列表
     */
    private List<QianchuanCampaignDTO> campaigns;

    /**
     * 总数
     */
    private Long total;
}
