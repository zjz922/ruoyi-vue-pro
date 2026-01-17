package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

/**
 * 抖店令牌DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianTokenDTO {

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Refresh Token
     */
    private String refreshToken;

    /**
     * 过期时间（秒）
     */
    private Long expiresIn;

    /**
     * 授权范围
     */
    private String scope;

    /**
     * 店铺ID
     */
    private String shopId;

    /**
     * 店铺名称
     */
    private String shopName;
}
