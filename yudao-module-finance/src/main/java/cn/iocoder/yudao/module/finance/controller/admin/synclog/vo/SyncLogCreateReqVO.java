package cn.iocoder.yudao.module.finance.controller.admin.synclog.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 数据同步日志创建请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "数据同步日志创建请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncLogCreateReqVO {

    @Schema(description = "店铺ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;

    @Schema(description = "同步类型", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "同步类型不能为空")
    private String syncType;

    @Schema(description = "数据来源", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "数据来源不能为空")
    private String dataSource;

    @Schema(description = "同步状态")
    private String syncStatus;

    @Schema(description = "同步数量")
    private Integer syncCount;

    @Schema(description = "成功数量")
    private Integer successCount;

    @Schema(description = "失败数量")
    private Integer failCount;

    @Schema(description = "错误信息")
    private String errorMessage;

    @Schema(description = "同步参数")
    private String syncParams;

    @Schema(description = "备注")
    private String remark;

}
