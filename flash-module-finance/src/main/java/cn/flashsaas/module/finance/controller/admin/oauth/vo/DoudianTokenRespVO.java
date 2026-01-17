package cn.flashsaas.module.finance.controller.admin.oauth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 抖店Token响应VO
 *
 * @author 闪电帐PRO
 */
@Schema(description = "管理后台 - 抖店Token响应VO")
@Data
public class DoudianTokenRespVO {

    @Schema(description = "Access Token", required = true)
    private String accessToken;

    @Schema(description = "Refresh Token", required = true)
    private String refreshToken;

    @Schema(description = "过期时间", required = true)
    private LocalDateTime expireTime;

    @Schema(description = "店铺ID", required = true)
    private Long shopId;

    @Schema(description = "店铺名称")
    private String shopName;

    @Schema(description = "授权范围")
    private String scope;
}
