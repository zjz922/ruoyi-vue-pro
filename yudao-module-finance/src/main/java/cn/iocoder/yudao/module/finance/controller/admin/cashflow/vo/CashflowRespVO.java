package cn.iocoder.yudao.module.finance.controller.admin.cashflow.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 资金流水响应 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "资金流水响应")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowRespVO {

    @Schema(description = "资金流水ID")
    private Long id;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "流水号")
    private String flowNo;

    @Schema(description = "交易类型")
    private String tradeType;

    @Schema(description = "金额")
    private BigDecimal amount;

    @Schema(description = "余额")
    private BigDecimal balance;

    @Schema(description = "渠道")
    private String channel;

    @Schema(description = "交易对方")
    private String counterparty;

    @Schema(description = "交易描述")
    private String description;

    @Schema(description = "交易时间")
    private LocalDateTime tradeTime;

    @Schema(description = "确认状态")
    private String confirmStatus;

    @Schema(description = "确认时间")
    private LocalDateTime confirmTime;

    @Schema(description = "对账状态")
    private String reconciliationStatus;

    @Schema(description = "来源平台")
    private String platform;

    @Schema(description = "平台流水ID")
    private String platformFlowId;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}
