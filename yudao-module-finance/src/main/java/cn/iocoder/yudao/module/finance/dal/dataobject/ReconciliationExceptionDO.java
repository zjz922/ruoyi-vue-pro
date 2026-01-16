package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 对账异常 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_reconciliation_exception")
@KeySequence("finance_reconciliation_exception_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationExceptionDO extends BaseDO {

    /**
     * 异常ID
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
     * 异常类型
     * 如：AMOUNT_MISMATCH-金额不匹配, ORDER_MISSING-订单缺失, DUPLICATE_ORDER-重复订单
     */
    private String exceptionType;

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 期望值
     */
    private BigDecimal expectedValue;

    /**
     * 实际值
     */
    private BigDecimal actualValue;

    /**
     * 差异
     */
    private BigDecimal difference;

    /**
     * 异常状态
     * pending-待处理 resolved-已解决
     */
    private String status;

    /**
     * 解决人ID
     */
    private Long resolvedBy;

    /**
     * 解决时间
     */
    private LocalDateTime resolvedAt;

    /**
     * 备注
     */
    private String remark;

}
