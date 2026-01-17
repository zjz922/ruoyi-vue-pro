package cn.flashsaas.module.finance.controller.admin.cashflow.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 资金流水分页请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "资金流水分页请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowPageReqVO extends PageParam {

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "流水号")
    private String flowNo;

    @Schema(description = "交易类型")
    private String tradeType;

    @Schema(description = "确认状态")
    private String confirmStatus;

}
