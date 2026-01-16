package cn.iocoder.yudao.module.finance.controller.admin.cashflow.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 资金流水创建请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "资金流水创建请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowCreateReqVO {

    @Schema(description = "店铺ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;

    @Schema(description = "流水号", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "流水号不能为空")
    private String flowNo;

    @Schema(description = "交易类型", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "交易类型不能为空")
    private String tradeType;

    @Schema(description = "金额", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "金额不能为空")
    private BigDecimal amount;

    @Schema(description = "渠道")
    private String channel;

    @Schema(description = "交易对方")
    private String counterparty;

    @Schema(description = "交易描述")
    private String description;

    @Schema(description = "交易时间", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "交易时间不能为空")
    private LocalDateTime tradeTime;

    @Schema(description = "来源平台")
    private String platform;

    @Schema(description = "平台流水ID")
    private String platformFlowId;

    @Schema(description = "备注")
    private String remark;

}
