package cn.iocoder.yudao.module.finance.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 订单状态枚举
 *
 * @author 闪电账PRO
 */
@Getter
@AllArgsConstructor
public enum OrderStatusEnum {

    PENDING_PAYMENT("待支付", "pending_payment"),
    PAID("已支付", "paid"),
    SHIPPED("已发货", "shipped"),
    COMPLETED("已完成", "completed"),
    CANCELLED("已取消", "cancelled"),
    REFUNDED("已退款", "refunded");

    /**
     * 状态名称
     */
    private final String name;

    /**
     * 状态值
     */
    private final String value;

}
