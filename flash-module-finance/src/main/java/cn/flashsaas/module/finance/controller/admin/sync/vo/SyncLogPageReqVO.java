package cn.flashsaas.module.finance.controller.admin.sync.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

import static cn.flashsaas.framework.common.util.date.DateUtils.FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND;

@Schema(description = "管理后台 - 同步日志分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class SyncLogPageReqVO extends PageParam {

    @Schema(description = "租户编号", example = "1")
    private Long tenantId;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", example = "1")
    private Integer platformType;

    @Schema(description = "执行结果：0-失败 1-成功", example = "1")
    private Integer result;

    @Schema(description = "开始时间")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND)
    private LocalDateTime startTime;

    @Schema(description = "结束时间")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND)
    private LocalDateTime endTime;
}
