package cn.iocoder.yudao.module.finance.controller.admin.platform.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 聚水潭配置 VO 类集合
 */
public class JushuitanConfigVO {
}

/**
 * 聚水潭配置 - 分页请求 VO
 */
@Schema(description = "管理后台 - 聚水潭配置分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
class JushuitanConfigPageReqVO extends PageParam {

    @Schema(description = "租户ID")
    private Long tenantId;

    @Schema(description = "公司名称")
    private String companyName;

    @Schema(description = "授权状态", example = "1")
    private Integer authStatus;

    @Schema(description = "创建时间")
    private LocalDateTime[] createTime;
}

/**
 * 聚水潭配置 - 创建请求 VO
 */
@Schema(description = "管理后台 - 聚水潭配置创建 Request VO")
@Data
class JushuitanConfigCreateReqVO {

    @Schema(description = "租户ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "租户ID不能为空")
    private Long tenantId;

    @Schema(description = "公司名称", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "公司名称不能为空")
    private String companyName;

    @Schema(description = "公司ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "公司ID不能为空")
    private String companyId;

    @Schema(description = "App Key", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "App Key不能为空")
    private String appKey;

    @Schema(description = "App Secret", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "App Secret不能为空")
    private String appSecret;

    @Schema(description = "同步订单")
    private Boolean syncOrder;

    @Schema(description = "同步库存")
    private Boolean syncInventory;

    @Schema(description = "同步采购")
    private Boolean syncPurchase;

    @Schema(description = "回调地址")
    private String callbackUrl;

    @Schema(description = "备注")
    private String remark;
}

/**
 * 聚水潭配置 - 更新请求 VO
 */
@Schema(description = "管理后台 - 聚水潭配置更新 Request VO")
@Data
class JushuitanConfigUpdateReqVO {

    @Schema(description = "配置ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "配置ID不能为空")
    private Long id;

    @Schema(description = "公司名称")
    private String companyName;

    @Schema(description = "公司ID")
    private String companyId;

    @Schema(description = "App Key")
    private String appKey;

    @Schema(description = "App Secret")
    private String appSecret;

    @Schema(description = "同步订单")
    private Boolean syncOrder;

    @Schema(description = "同步库存")
    private Boolean syncInventory;

    @Schema(description = "同步采购")
    private Boolean syncPurchase;

    @Schema(description = "回调地址")
    private String callbackUrl;

    @Schema(description = "备注")
    private String remark;
}

/**
 * 聚水潭配置 - 响应 VO
 */
@Schema(description = "管理后台 - 聚水潭配置 Response VO")
@Data
class JushuitanConfigRespVO {

    @Schema(description = "配置ID")
    private Long id;

    @Schema(description = "租户ID")
    private Long tenantId;

    @Schema(description = "租户名称")
    private String tenantName;

    @Schema(description = "公司名称")
    private String companyName;

    @Schema(description = "公司ID")
    private String companyId;

    @Schema(description = "App Key")
    private String appKey;

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

    @Schema(description = "同步订单")
    private Boolean syncOrder;

    @Schema(description = "同步库存")
    private Boolean syncInventory;

    @Schema(description = "同步采购")
    private Boolean syncPurchase;

    @Schema(description = "回调地址")
    private String callbackUrl;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
