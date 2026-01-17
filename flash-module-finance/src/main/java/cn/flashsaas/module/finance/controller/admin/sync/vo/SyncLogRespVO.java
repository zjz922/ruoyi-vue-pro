package cn.flashsaas.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 同步日志 Response VO")
@Data
public class SyncLogRespVO {

    @Schema(description = "日志编号", example = "1")
    private Long id;

    @Schema(description = "任务编号", example = "1")
    private Long taskId;

    @Schema(description = "任务名称", example = "抖店订单同步")
    private String taskName;

    @Schema(description = "租户编号", example = "1")
    private Long tenantId;

    @Schema(description = "租户名称", example = "默认租户")
    private String tenantName;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", example = "1")
    private Integer platformType;

    @Schema(description = "开始时间")
    private LocalDateTime startTime;

    @Schema(description = "结束时间")
    private LocalDateTime endTime;

    @Schema(description = "执行耗时(ms)", example = "1000")
    private Long duration;

    @Schema(description = "执行结果：0-失败 1-成功", example = "1")
    private Integer result;

    @Schema(description = "同步条数", example = "100")
    private Integer syncCount;

    @Schema(description = "成功条数", example = "98")
    private Integer successCount;

    @Schema(description = "失败条数", example = "2")
    private Integer failCount;

    @Schema(description = "错误信息")
    private String errorMessage;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
