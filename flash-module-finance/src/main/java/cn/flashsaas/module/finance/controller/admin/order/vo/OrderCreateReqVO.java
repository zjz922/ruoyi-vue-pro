package cn.flashsaas.module.finance.controller.admin.order.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 订单创建请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "订单创建请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateReqVO {

    @Schema(description = "店铺ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;

    @Schema(description = "订单号", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "订单号不能为空")
    private String orderNo;

    @Schema(description = "商品标题", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "商品标题不能为空")
    private String productTitle;

    @Schema(description = "商品数量", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "商品数量不能为空")
    private Integer quantity;

    @Schema(description = "单价", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "单价不能为空")
    private BigDecimal unitPrice;

    @Schema(description = "支付金额", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "支付金额不能为空")
    private BigDecimal payAmount;

    @Schema(description = "订单状态")
    private String status;

    @Schema(description = "收货人")
    private String receiverName;

    @Schema(description = "收货地址")
    private String receiverAddress;

    @Schema(description = "收货电话")
    private String receiverPhone;

    @Schema(description = "来源平台")
    private String platform;

    @Schema(description = "平台订单ID")
    private String platformOrderId;

    @Schema(description = "备注")
    private String remark;

}
