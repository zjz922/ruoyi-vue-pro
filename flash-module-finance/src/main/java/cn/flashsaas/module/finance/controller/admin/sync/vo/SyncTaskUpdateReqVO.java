package cn.flashsaas.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Schema(description = "管理后台 - 同步任务更新 Request VO")
@Data
public class SyncTaskUpdateReqVO {

    @Schema(description = "任务编号", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "任务编号不能为空")
    private Long id;

    @Schema(description = "租户编号", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "租户编号不能为空")
    private Long tenantId;

    @Schema(description = "任务名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "抖店订单同步")
    @NotBlank(message = "任务名称不能为空")
    private String taskName;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "平台类型不能为空")
    private Integer platformType;

    @Schema(description = "任务类型：1-抖店订单 2-抖店结算 3-千川消耗 4-聚水潭库存", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "任务类型不能为空")
    private Integer taskType;

    @Schema(description = "关联配置ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "关联配置不能为空")
    private Long configId;

    @Schema(description = "Cron表达式", requiredMode = Schema.RequiredMode.REQUIRED, example = "0 0 * * * ?")
    @NotBlank(message = "Cron表达式不能为空")
    private String cronExpression;

    @Schema(description = "状态：0-停用 1-启用", example = "1")
    private Integer status;
}
