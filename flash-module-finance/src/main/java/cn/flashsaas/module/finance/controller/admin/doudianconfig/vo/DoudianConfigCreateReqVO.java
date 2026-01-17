package cn.flashsaas.module.finance.controller.admin.doudianconfig.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 抖店配置创建请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "抖店配置创建请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianConfigCreateReqVO {

    @Schema(description = "店铺ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;

    @Schema(description = "店铺名称")
    private String shopName;

    @Schema(description = "App Key", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "App Key不能为空")
    private String appKey;

    @Schema(description = "App Secret", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "App Secret不能为空")
    private String appSecret;

    @Schema(description = "备注")
    private String remark;

}
