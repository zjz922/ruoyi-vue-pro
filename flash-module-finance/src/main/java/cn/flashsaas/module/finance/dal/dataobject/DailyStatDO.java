package cn.flashsaas.module.finance.dal.dataobject;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 每日统计 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_daily_stat")
@KeySequence("finance_daily_stat_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatDO extends BaseDO {

    /**
     * 统计ID
     */
    @TableId
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
     * 统计日期
     */
    private LocalDate statDate;

    /**
     * 订单数
     */
    private Integer orderCount;

    /**
     * 订单金额
     */
    private BigDecimal orderAmount;

    /**
     * 退款数
     */
    private Integer refundCount;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount;

    /**
     * 收入金额
     */
    private BigDecimal incomeAmount;

    /**
     * 支出金额
     */
    private BigDecimal expenseAmount;

    /**
     * 利润金额
     */
    private BigDecimal profitAmount;

    /**
     * 推广费用
     */
    private BigDecimal promotionCost;

}
