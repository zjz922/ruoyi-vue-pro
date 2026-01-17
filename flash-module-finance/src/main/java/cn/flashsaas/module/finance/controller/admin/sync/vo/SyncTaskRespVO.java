package cn.flashsaas.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 同步任务 Response VO")
@Data
public class SyncTaskRespVO {

    @Schema(description = "任务编号", example = "1")
    private Long id;

    @Schema(description = "租户编号", example = "1")
    private Long tenantId;

    @Schema(description = "租户名称", example = "默认租户")
    private String tenantName;

    @Schema(description = "任务名称", example = "抖店订单同步")
    private String taskName;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", example = "1")
    private Integer platformType;

    @Schema(description = "任务类型：1-抖店订单 2-抖店结算 3-千川消耗 4-聚水潭库存", example = "1")
    private Integer taskType;

    @Schema(description = "关联配置ID", example = "1")
    private Long configId;

    @Schema(description = "Cron表达式", example = "0 0 * * * ?")
    private String cronExpression;

    @Schema(description = "状态：0-停用 1-启用", example = "1")
    private Integer status;

    @Schema(description = "上次执行时间")
    private LocalDateTime lastExecuteTime;

    @Schema(description = "上次执行结果：0-失败 1-成功")
    private Integer lastExecuteResult;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
