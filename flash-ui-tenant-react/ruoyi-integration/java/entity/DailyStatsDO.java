package cn.flashsaas.module.finance.dal.dataobject.stats;

import cn.flashsaas.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 每日统计汇总 DO
 *
 * @author 闪电账PRO
 */
@TableName("finance_daily_stats")
@KeySequence("finance_daily_stats_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatsDO extends TenantBaseDO {

    /**
     * 主键ID
     */
    @TableId
    private Long id;

    /**
     * 统计日期
     */
    private LocalDate statsDate;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 订单数
     */
    private Integer orderCount;

    /**
     * 已发货数
     */
    private Integer shippedCount;

    /**
     * 销售额
     */
    private BigDecimal salesAmount;

    /**
     * 退款额
     */
    private BigDecimal refundAmount;

    /**
     * 快递费
     */
    private BigDecimal expressFee;

    /**
     * 达人佣金
     */
    private BigDecimal commissionFee;

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
     * 赔付
     */
    private BigDecimal compensationFee;

    /**
     * 其他费用
     */
    private BigDecimal otherFee;

    /**
     * 利润
     */
    private BigDecimal profit;

    /**
     * 利润率(%)
     */
    private BigDecimal profitRate;

}
