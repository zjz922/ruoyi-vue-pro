package cn.iocoder.yudao.module.finance.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 对账差异 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_reconciliation_diff")
@Data
@EqualsAndHashCode(callSuper = false)
public class ReconciliationDiffDO {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
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
     * 对账日志ID
     */
    private Long logId;

    /**
     * 对账日期
     */
    private LocalDate checkDate;

    /**
     * 差异日期（兼容字段）
     */
    private LocalDate diffDate;

    /**
     * 来源值
     */
    private BigDecimal sourceValue;

    /**
     * 目标值
     */
    private BigDecimal targetValue;

    /**
     * 差异值
     */
    private BigDecimal diffValue;

    /**
     * 差异类型：order-订单差异, fund-资金差异, inventory-库存差异
     */
    private String diffType;

    /**
     * 关联订单ID
     */
    private String orderId;

    /**
     * 关联订单号
     */
    private String orderNo;

    /**
     * 平台金额
     */
    private BigDecimal platformAmount;

    /**
     * 系统金额
     */
    private BigDecimal systemAmount;

    /**
     * 差异金额
     */
    private BigDecimal diffAmount;

    /**
     * 差异原因
     */
    private String diffReason;

    /**
     * 状态：pending-待处理, processing-处理中, completed-已完成, exception-异常, matched-已匹配
     */
    private String status;

    /**
     * 处理人ID
     */
    private Long handlerId;

    /**
     * 处理时间
     */
    private LocalDateTime handleTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 删除标志
     */
    private Integer delFlag;
}
