package cn.flashsaas.module.finance.controller.admin.doudianconfig.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 抖店配置分页请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "抖店配置分页请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianConfigPageReqVO extends PageParam {

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "店铺名称")
    private String shopName;

    @Schema(description = "授权状态")
    private String authStatus;

}
