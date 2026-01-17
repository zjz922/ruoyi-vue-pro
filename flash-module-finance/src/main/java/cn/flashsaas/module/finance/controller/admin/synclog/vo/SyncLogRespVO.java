package cn.flashsaas.module.finance.controller.admin.synclog.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 数据同步日志响应 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "数据同步日志响应")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncLogRespVO {

    @Schema(description = "同步日志ID")
    private Long id;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "同步类型")
    private String syncType;

    @Schema(description = "数据来源")
    private String dataSource;

    @Schema(description = "同步状态")
    private String syncStatus;

    @Schema(description = "同步开始时间")
    private LocalDateTime startTime;

    @Schema(description = "同步结束时间")
    private LocalDateTime endTime;

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

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}
