package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

/**
 * 抖店店铺DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianShopDTO {

    /**
     * 店铺ID
     */
    private Long shopId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 店铺Logo
     */
    private String shopLogo;

    /**
     * 店铺类型
     */
    private Integer shopType;
}
