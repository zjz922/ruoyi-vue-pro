package cn.iocoder.yudao.module.finance.controller.admin.oauth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 抖店换取Token请求VO
 *
 * @author 闪电帐PRO
 */
@Schema(description = "管理后台 - 抖店换取Token请求VO")
@Data
public class DoudianExchangeTokenReqVO {

    @Schema(description = "授权码", required = true)
    @NotBlank(message = "授权码不能为空")
    private String code;

    @Schema(description = "租户ID", required = true)
    @NotNull(message = "租户ID不能为空")
    private Long tenantId;
}
