package cn.iocoder.yudao.module.finance.dal.dataobject.order;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单 DO
 *
 * @author 闪电账PRO
 */
@TableName("finance_order")
@KeySequence("finance_order_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDO extends TenantBaseDO {

    /**
     * 主键ID
     */
    @TableId
    private Long id;

    /**
     * 主订单编号
     */
    private String mainOrderNo;

    /**
     * 子订单编号
     */
    private String subOrderNo;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品规格
     */
    private String productSpec;

    /**
     * 商品数量
     */
    private Integer quantity;

    /**
     * 商家编码/SKU
     */
    private String sku;

    /**
     * 商品单价
     */
    private BigDecimal unitPrice;

    /**
     * 订单应付金额
     */
    private BigDecimal payAmount;

    /**
     * 运费
     */
    private BigDecimal freight;

    /**
     * 优惠总金额
     */
    private BigDecimal totalDiscount;

    /**
     * 平台优惠
     */
    private BigDecimal platformDiscount;

    /**
     * 商家优惠
     */
    private BigDecimal merchantDiscount;

    /**
     * 达人优惠
     */
    private BigDecimal influencerDiscount;

    /**
     * 服务费/手续费
     */
    private BigDecimal serviceFee;

    /**
     * 支付方式
     */
    private String payMethod;

    /**
     * 收件人
     */
    private String receiver;

    /**
     * 收件人手机号
     */
    private String receiverPhone;

    /**
     * 省
     */
    private String province;

    /**
     * 市
     */
    private String city;

    /**
     * 区
     */
    private String district;

    /**
     * 详细地址
     */
    private String address;

    /**
     * 订单提交时间
     */
    private LocalDateTime orderTime;

    /**
     * 支付完成时间
     */
    private LocalDateTime payTime;

    /**
     * 发货时间
     */
    private LocalDateTime shipTime;

    /**
     * 订单完成时间
     */
    private LocalDateTime completeTime;

    /**
     * 订单状态
     */
    private String status;

    /**
     * 售后状态
     */
    private String afterSaleStatus;

    /**
     * 取消原因
     */
    private String cancelReason;

    /**
     * APP渠道
     */
    private String appChannel;

    /**
     * 流量来源
     */
    private String trafficSource;

    /**
     * 订单类型
     */
    private String orderType;

    /**
     * 达人ID
     */
    private String influencerId;

    /**
     * 达人昵称
     */
    private String influencerName;

    /**
     * 旗帜颜色
     */
    private String flagColor;

    /**
     * 商家备注
     */
    private String merchantRemark;

    /**
     * 买家留言
     */
    private String buyerMessage;

    /**
     * 店铺名称
     */
    private String shopName;

}
