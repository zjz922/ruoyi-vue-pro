package cn.iocoder.yudao.module.finance.controller.admin.cashflow.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 资金流水更新请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "资金流水更新请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowUpdateReqVO {

    @Schema(description = "资金流水ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "资金流水ID不能为空")
    private Long id;

    @Schema(description = "金额")
    private BigDecimal amount;

    @Schema(description = "确认状态")
    private String confirmStatus;

    @Schema(description = "对账状态")
    private String reconciliationStatus;

    @Schema(description = "备注")
    private String remark;

}
