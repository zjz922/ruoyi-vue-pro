package cn.flashsaas.module.finance.controller.admin.oauth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 抖店刷新Token请求VO
 *
 * @author 闪电帐PRO
 */
@Schema(description = "管理后台 - 抖店刷新Token请求VO")
@Data
public class DoudianRefreshTokenReqVO {

    @Schema(description = "租户ID", required = true)
    @NotNull(message = "租户ID不能为空")
    private Long tenantId;

    @Schema(description = "店铺ID", required = true)
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;
}
