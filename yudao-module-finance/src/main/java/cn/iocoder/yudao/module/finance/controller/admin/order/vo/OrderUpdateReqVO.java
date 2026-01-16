package cn.iocoder.yudao.module.finance.controller.admin.order.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 订单更新请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "订单更新请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateReqVO {

    @Schema(description = "订单ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "订单ID不能为空")
    private Long id;

    @Schema(description = "订单状态")
    private String status;

    @Schema(description = "支付金额")
    private BigDecimal payAmount;

    @Schema(description = "收货人")
    private String receiverName;

    @Schema(description = "收货地址")
    private String receiverAddress;

    @Schema(description = "收货电话")
    private String receiverPhone;

    @Schema(description = "备注")
    private String remark;

}
