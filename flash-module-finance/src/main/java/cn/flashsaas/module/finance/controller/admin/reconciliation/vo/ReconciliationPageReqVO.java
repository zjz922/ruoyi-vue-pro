package cn.flashsaas.module.finance.controller.admin.reconciliation.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 对账差异分页请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "对账差异分页请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationPageReqVO extends PageParam {

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "平台")
    private String platform;

    @Schema(description = "对账日期")
    private LocalDate reconciliationDate;

    @Schema(description = "处理状态")
    private String status;

}
