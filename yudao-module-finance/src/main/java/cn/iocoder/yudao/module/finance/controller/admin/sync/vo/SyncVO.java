package cn.iocoder.yudao.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 同步任务 VO
 */
@Data
@Schema(description = "同步任务 VO")
public class SyncTaskVO {
    @Schema(description = "任务编号")
    private Long id;

    @Schema(description = "租户编号")
    private Long tenantId;

    @Schema(description = "租户名称")
    private String tenantName;

    @Schema(description = "任务名称")
    private String taskName;

    @Schema(description = "任务类型：1-抖店订单 2-抖店结算 3-千川消耗 4-聚水潭库存")
    private Integer taskType;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭")
    private Integer platformType;

    @Schema(description = "配置编号")
    private Long configId;

    @Schema(description = "Cron表达式")
    private String cronExpression;

    @Schema(description = "任务状态：0-停用 1-启用")
    private Integer status;

    @Schema(description = "上次执行时间")
    private LocalDateTime lastExecuteTime;

    @Schema(description = "上次执行结果：0-失败 1-成功")
    private Integer lastExecuteResult;

    @Schema(description = "下次执行时间")
    private LocalDateTime nextExecuteTime;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 同步任务查询 VO
 */
@Data
@Schema(description = "同步任务查询 VO")
class SyncTaskQueryVO {
    @Schema(description = "页码")
    private Integer pageNo = 1;

    @Schema(description = "每页条数")
    private Integer pageSize = 10;

    @Schema(description = "租户编号")
    private Long tenantId;

    @Schema(description = "任务名称")
    private String taskName;

    @Schema(description = "任务类型")
    private Integer taskType;

    @Schema(description = "平台类型")
    private Integer platformType;

    @Schema(description = "任务状态")
    private Integer status;
}

/**
 * 同步任务创建 VO
 */
@Data
@Schema(description = "同步任务创建 VO")
class SyncTaskCreateVO {
    @Schema(description = "租户编号")
    @NotNull(message = "租户不能为空")
    private Long tenantId;

    @Schema(description = "任务名称")
    @NotBlank(message = "任务名称不能为空")
    private String taskName;

    @Schema(description = "任务类型")
    @NotNull(message = "任务类型不能为空")
    private Integer taskType;

    @Schema(description = "平台类型")
    @NotNull(message = "平台类型不能为空")
    private Integer platformType;

    @Schema(description = "配置编号")
    @NotNull(message = "配置不能为空")
    private Long configId;

    @Schema(description = "Cron表达式")
    @NotBlank(message = "Cron表达式不能为空")
    private String cronExpression;

    @Schema(description = "任务状态")
    private Integer status = 1;
}

/**
 * 同步任务更新 VO
 */
@Data
@Schema(description = "同步任务更新 VO")
class SyncTaskUpdateVO {
    @Schema(description = "任务编号")
    @NotNull(message = "任务编号不能为空")
    private Long id;

    @Schema(description = "任务名称")
    private String taskName;

    @Schema(description = "Cron表达式")
    private String cronExpression;

    @Schema(description = "任务状态")
    private Integer status;
}

/**
 * 同步日志 VO
 */
@Data
@Schema(description = "同步日志 VO")
class SyncLogVO {
    @Schema(description = "日志编号")
    private Long id;

    @Schema(description = "任务编号")
    private Long taskId;

    @Schema(description = "任务名称")
    private String taskName;

    @Schema(description = "租户编号")
    private Long tenantId;

    @Schema(description = "租户名称")
    private String tenantName;

    @Schema(description = "平台类型")
    private Integer platformType;

    @Schema(description = "执行开始时间")
    private LocalDateTime startTime;

    @Schema(description = "执行结束时间")
    private LocalDateTime endTime;

    @Schema(description = "执行耗时（毫秒）")
    private Long duration;

    @Schema(description = "执行结果：0-失败 1-成功")
    private Integer result;

    @Schema(description = "同步数据条数")
    private Integer syncCount;

    @Schema(description = "成功条数")
    private Integer successCount;

    @Schema(description = "失败条数")
    private Integer failCount;

    @Schema(description = "错误信息")
    private String errorMessage;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 同步日志查询 VO
 */
@Data
@Schema(description = "同步日志查询 VO")
class SyncLogQueryVO {
    @Schema(description = "页码")
    private Integer pageNo = 1;

    @Schema(description = "每页条数")
    private Integer pageSize = 10;

    @Schema(description = "任务编号")
    private Long taskId;

    @Schema(description = "租户编号")
    private Long tenantId;

    @Schema(description = "平台类型")
    private Integer platformType;

    @Schema(description = "执行结果")
    private Integer result;

    @Schema(description = "开始时间")
    private LocalDateTime startTime;

    @Schema(description = "结束时间")
    private LocalDateTime endTime;
}

/**
 * 同步异常 VO
 */
@Data
@Schema(description = "同步异常 VO")
class SyncExceptionVO {
    @Schema(description = "异常编号")
    private Long id;

    @Schema(description = "日志编号")
    private Long logId;

    @Schema(description = "任务编号")
    private Long taskId;

    @Schema(description = "任务名称")
    private String taskName;

    @Schema(description = "租户编号")
    private Long tenantId;

    @Schema(description = "租户名称")
    private String tenantName;

    @Schema(description = "平台类型")
    private Integer platformType;

    @Schema(description = "异常类型：1-数据格式错误 2-网络超时 3-API限流 4-数据冲突 5-其他")
    private Integer exceptionType;

    @Schema(description = "异常数据（JSON）")
    private String exceptionData;

    @Schema(description = "异常信息")
    private String exceptionMessage;

    @Schema(description = "处理状态：0-待处理 1-已重试 2-已忽略 3-已解决")
    private Integer handleStatus;

    @Schema(description = "重试次数")
    private Integer retryCount;

    @Schema(description = "最后重试时间")
    private LocalDateTime lastRetryTime;

    @Schema(description = "处理备注")
    private String handleRemark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 同步异常查询 VO
 */
@Data
@Schema(description = "同步异常查询 VO")
class SyncExceptionQueryVO {
    @Schema(description = "页码")
    private Integer pageNo = 1;

    @Schema(description = "每页条数")
    private Integer pageSize = 10;

    @Schema(description = "任务编号")
    private Long taskId;

    @Schema(description = "租户编号")
    private Long tenantId;

    @Schema(description = "平台类型")
    private Integer platformType;

    @Schema(description = "异常类型")
    private Integer exceptionType;

    @Schema(description = "处理状态")
    private Integer handleStatus;
}
