package cn.flashsaas.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static cn.flashsaas.framework.common.util.date.DateUtils.FORMAT_YEAR_MONTH_DAY;

/**
 * 数据同步请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "管理后台 - 数据同步请求 VO")
@Data
public class DataSyncReqVO {

    @Schema(description = "店铺ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;

    @Schema(description = "开始日期", requiredMode = Schema.RequiredMode.REQUIRED, example = "2024-01-01")
    @NotNull(message = "开始日期不能为空")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY)
    private LocalDate startDate;

    @Schema(description = "结束日期", requiredMode = Schema.RequiredMode.REQUIRED, example = "2024-01-31")
    @NotNull(message = "结束日期不能为空")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY)
    private LocalDate endDate;
}
