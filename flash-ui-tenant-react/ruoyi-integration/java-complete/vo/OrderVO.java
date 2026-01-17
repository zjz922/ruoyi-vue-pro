package com.flash.module.finance.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单 VO
 */
@Schema(description = "订单")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderVO {

    @Schema(description = "订单ID")
    private Long id;

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "子订单号")
    private String subOrderNo;

    @Schema(description = "商品ID")
    private String productId;

    @Schema(description = "SKU编码")
    private String sku;

    @Schema(description = "商品标题")
    private String productTitle;

    @Schema(description = "商品数量")
    private Integer quantity;

    @Schema(description = "单价")
    private BigDecimal unitPrice;

    @Schema(description = "应付金额")
    private BigDecimal payableAmount;

    @Schema(description = "实付金额")
    private BigDecimal paidAmount;

    @Schema(description = "收件人")
    private String recipientName;

    @Schema(description = "收件人电话")
    private String recipientPhone;

    @Schema(description = "收件地址")
    private String recipientAddress;

    @Schema(description = "省份")
    private String province;

    @Schema(description = "城市")
    private String city;

    @Schema(description = "区县")
    private String district;

    @Schema(description = "订单状态")
    private String orderStatus;

    @Schema(description = "发货状态")
    private String shipmentStatus;

    @Schema(description = "售后状态")
    private String afterSaleStatus;

    @Schema(description = "下单时间")
    private LocalDateTime orderTime;

    @Schema(description = "发货时间")
    private LocalDateTime shipmentTime;

    @Schema(description = "收货时间")
    private LocalDateTime receiptTime;

    @Schema(description = "快递公司")
    private String expressCompany;

    @Schema(description = "快递单号")
    private String expressNo;

    @Schema(description = "快递费")
    private BigDecimal expressCharge;

    @Schema(description = "退款金额")
    private BigDecimal refundAmount;

    @Schema(description = "达人佣金")
    private BigDecimal influencerCommission;

    @Schema(description = "服务费")
    private BigDecimal serviceFee;

    @Schema(description = "商品成本")
    private BigDecimal productCost;

    @Schema(description = "推广费")
    private BigDecimal promotionFee;

    @Schema(description = "保险费")
    private BigDecimal insuranceFee;

    @Schema(description = "其他费用")
    private BigDecimal otherFee;

    @Schema(description = "赔付")
    private BigDecimal compensation;

    @Schema(description = "预计利润")
    private BigDecimal estimatedProfit;

    @Schema(description = "备注")
    private String remark;
}
