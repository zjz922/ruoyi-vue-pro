package cn.iocoder.yudao.module.finance.controller.admin.order.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单响应 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "订单响应")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRespVO {

    @Schema(description = "订单ID")
    private Long id;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "商品标题")
    private String productTitle;

    @Schema(description = "商品数量")
    private Integer quantity;

    @Schema(description = "单价")
    private BigDecimal unitPrice;

    @Schema(description = "支付金额")
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

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}
