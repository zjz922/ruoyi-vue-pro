package cn.iocoder.yudao.module.finance.controller.admin.oauth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 抖店授权URL响应VO
 *
 * @author 闪电帐PRO
 */
@Schema(description = "管理后台 - 抖店授权URL响应VO")
@Data
public class DoudianAuthUrlRespVO {

    @Schema(description = "授权URL", required = true)
    private String authorizeUrl;
}
