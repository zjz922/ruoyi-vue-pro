package cn.flashsaas.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 同步异常 Response VO")
@Data
public class SyncExceptionRespVO {

    @Schema(description = "异常编号", example = "1")
    private Long id;

    @Schema(description = "任务编号", example = "1")
    private Long taskId;

    @Schema(description = "任务名称", example = "抖店订单同步")
    private String taskName;

    @Schema(description = "日志编号", example = "1")
    private Long logId;

    @Schema(description = "租户编号", example = "1")
    private Long tenantId;

    @Schema(description = "租户名称", example = "默认租户")
    private String tenantName;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", example = "1")
    private Integer platformType;

    @Schema(description = "异常类型：1-数据格式错误 2-网络超时 3-API限流 4-数据冲突 5-其他", example = "1")
    private Integer exceptionType;

    @Schema(description = "异常信息")
    private String exceptionMessage;

    @Schema(description = "异常数据(JSON)")
    private String exceptionData;

    @Schema(description = "处理状态：0-待处理 1-已重试 2-已忽略 3-已解决", example = "0")
    private Integer handleStatus;

    @Schema(description = "重试次数", example = "0")
    private Integer retryCount;

    @Schema(description = "最后重试时间")
    private LocalDateTime lastRetryTime;

    @Schema(description = "处理备注")
    private String handleRemark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
