package com.flash.module.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.flash.framework.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单 DO
 */
@TableName("finance_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDO extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 订单号
     */
    private String orderNo;

    /**
     * 子订单号
     */
    private String subOrderNo;

    /**
     * 商品ID
     */
    private String productId;

    /**
     * SKU编码
     */
    private String sku;

    /**
     * 商品标题
     */
    private String productTitle;

    /**
     * 商品数量
     */
    private Integer quantity;

    /**
     * 单价
     */
    private BigDecimal unitPrice;

    /**
     * 应付金额
     */
    private BigDecimal payableAmount;

    /**
     * 实付金额
     */
    private BigDecimal paidAmount;

    /**
     * 收件人
     */
    private String recipientName;

    /**
     * 收件人电话
     */
    private String recipientPhone;

    /**
     * 收件地址
     */
    private String recipientAddress;

    /**
     * 省份
     */
    private String province;

    /**
     * 城市
     */
    private String city;

    /**
     * 区县
     */
    private String district;

    /**
     * 订单状态
     */
    private String orderStatus;

    /**
     * 发货状态
     */
    private String shipmentStatus;

    /**
     * 售后状态
     */
    private String afterSaleStatus;

    /**
     * 下单时间
     */
    private LocalDateTime orderTime;

    /**
     * 发货时间
     */
    private LocalDateTime shipmentTime;

    /**
     * 收货时间
     */
    private LocalDateTime receiptTime;

    /**
     * 快递公司
     */
    private String expressCompany;

    /**
     * 快递单号
     */
    private String expressNo;

    /**
     * 快递费
     */
    private BigDecimal expressCharge;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount;

    /**
     * 达人佣金
     */
    private BigDecimal influencerCommission;

    /**
     * 服务费
     */
    private BigDecimal serviceFee;

    /**
     * 商品成本
     */
    private BigDecimal productCost;

    /**
     * 推广费
     */
    private BigDecimal promotionFee;

    /**
     * 保险费
     */
    private BigDecimal insuranceFee;

    /**
     * 其他费用
     */
    private BigDecimal otherFee;

    /**
     * 赔付
     */
    private BigDecimal compensation;

    /**
     * 预计利润
     */
    private BigDecimal estimatedProfit;

    /**
     * 备注
     */
    private String remark;
}
