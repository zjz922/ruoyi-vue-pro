package cn.flashsaas.module.finance.dal.dataobject;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单数据对象
 *
 * @author 闪电账PRO
 */
@TableName("finance_orders")
@KeySequence("finance_orders_seq")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDO extends BaseDO {

    /**
     * 订单ID
     */
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 店铺ID
     */
    private Long shopId;

    /**
     * 订单号
     */
    private String orderNo;

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
     * 支付金额
     */
    private BigDecimal payAmount;

    /**
     * 订单状态 (待支付、已支付、已发货、已完成、已取消)
     */
    private String status;

    /**
     * 收货人
     */
    private String receiverName;

    /**
     * 收货地址
     */
    private String receiverAddress;

    /**
     * 收货电话
     */
    private String receiverPhone;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 订单创建时间（来自抖店）
     */
    private LocalDateTime orderCreateTime;

    /**
     * 订单更新时间（来自抖店）
     */
    private LocalDateTime orderUpdateTime;

    /**
     * 来源平台 (doudian、qianchuan、jst等)
     */
    private String platform;

    /**
     * 平台订单ID
     */
    private String platformOrderId;

    /**
     * 备注
     */
    private String remark;

    /**
     * 删除标志 (0 未删除, 1 已删除)
     */
    private Integer delFlag;
}
