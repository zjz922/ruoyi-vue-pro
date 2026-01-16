package cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 抖店配置响应 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "抖店配置响应")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianConfigRespVO {

    @Schema(description = "配置ID")
    private Long id;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "店铺名称")
    private String shopName;

    @Schema(description = "App Key")
    private String appKey;

    @Schema(description = "授权状态")
    private String authStatus;

    @Schema(description = "授权时间")
    private Long authTime;

    @Schema(description = "是否启用")
    private Integer enabled;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}
