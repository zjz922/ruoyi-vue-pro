package cn.flashsaas.module.finance.controller.admin.platform.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 千川配置 VO 类集合
 */
public class QianchuanConfigVO {
}

/**
 * 千川配置 - 分页请求 VO
 */
@Schema(description = "管理后台 - 千川配置分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
class QianchuanConfigPageReqVO extends PageParam {

    @Schema(description = "租户ID")
    private Long tenantId;

    @Schema(description = "广告主名称")
    private String advertiserName;

    @Schema(description = "授权状态", example = "1")
    private Integer authStatus;

    @Schema(description = "创建时间")
    private LocalDateTime[] createTime;
}

/**
 * 千川配置 - 创建请求 VO
 */
@Schema(description = "管理后台 - 千川配置创建 Request VO")
@Data
class QianchuanConfigCreateReqVO {

    @Schema(description = "租户ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "租户ID不能为空")
    private Long tenantId;

    @Schema(description = "广告主名称", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "广告主名称不能为空")
    private String advertiserName;

    @Schema(description = "广告主ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "广告主ID不能为空")
    private String advertiserId;

    @Schema(description = "App ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "App ID不能为空")
    private String appId;

    @Schema(description = "App Secret", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "App Secret不能为空")
    private String appSecret;

    @Schema(description = "回调地址")
    private String callbackUrl;

    @Schema(description = "备注")
    private String remark;
}

/**
 * 千川配置 - 更新请求 VO
 */
@Schema(description = "管理后台 - 千川配置更新 Request VO")
@Data
class QianchuanConfigUpdateReqVO {

    @Schema(description = "配置ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "配置ID不能为空")
    private Long id;

    @Schema(description = "广告主名称")
    private String advertiserName;

    @Schema(description = "广告主ID")
    private String advertiserId;

    @Schema(description = "App ID")
    private String appId;

    @Schema(description = "App Secret")
    private String appSecret;

    @Schema(description = "回调地址")
    private String callbackUrl;

    @Schema(description = "备注")
    private String remark;
}

/**
 * 千川配置 - 响应 VO
 */
@Schema(description = "管理后台 - 千川配置 Response VO")
@Data
class QianchuanConfigRespVO {

    @Schema(description = "配置ID")
    private Long id;

    @Schema(description = "租户ID")
    private Long tenantId;

    @Schema(description = "租户名称")
    private String tenantName;

    @Schema(description = "广告主名称")
    private String advertiserName;

    @Schema(description = "广告主ID")
    private String advertiserId;

    @Schema(description = "App ID")
    private String appId;

    @Schema(description = "App Secret（脱敏）")
    private String appSecretMasked;

    @Schema(description = "Access Token（脱敏）")
    private String accessTokenMasked;

    @Schema(description = "授权状态：0-未授权，1-已授权，2-授权过期")
    private Integer authStatus;

    @Schema(description = "授权状态名称")
    private String authStatusName;

    @Schema(description = "Token过期时间")
    private LocalDateTime tokenExpireTime;

    @Schema(description = "最后同步时间")
    private LocalDateTime lastSyncTime;

    @Schema(description = "今日消耗")
    private java.math.BigDecimal todayCost;

    @Schema(description = "账户余额")
    private java.math.BigDecimal accountBalance;

    @Schema(description = "回调地址")
    private String callbackUrl;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
