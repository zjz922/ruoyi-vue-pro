package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDate;

/**
 * 对账日志 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_reconciliation_log")
@KeySequence("finance_reconciliation_log_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationLogDO extends BaseDO {

    /**
     * 日志ID
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
     * 检查类型
     * realtime-实时检查 daily-每日检查 monthly-月度检查
     */
    private String checkType;

    /**
     * 检查日期
     */
    private LocalDate checkDate;

    /**
     * 检查状态
     * passed-通过 failed-失败
     */
    private String status;

    /**
     * 检查详情（JSON格式）
     */
    private String details;

    /**
     * 错误信息
     */
    private String errorMessage;

}
