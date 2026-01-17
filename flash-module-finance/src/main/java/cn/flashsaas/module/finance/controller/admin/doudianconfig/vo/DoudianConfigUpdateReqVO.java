package cn.flashsaas.module.finance.controller.admin.doudianconfig.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * 抖店配置更新请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "抖店配置更新请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianConfigUpdateReqVO {

    @Schema(description = "配置ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "配置ID不能为空")
    private Long id;

    @Schema(description = "App Key")
    private String appKey;

    @Schema(description = "App Secret")
    private String appSecret;

    @Schema(description = "授权状态")
    private String authStatus;

    @Schema(description = "是否启用")
    private Integer enabled;

    @Schema(description = "备注")
    private String remark;

}
