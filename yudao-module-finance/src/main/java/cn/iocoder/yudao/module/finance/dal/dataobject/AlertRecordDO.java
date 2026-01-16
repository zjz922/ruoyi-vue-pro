package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 预警记录 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_alert_record")
@KeySequence("finance_alert_record_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRecordDO extends BaseDO {

    /**
     * 记录ID
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
     * 规则ID
     */
    private Long ruleId;

    /**
     * 预警类型
     * 如：LOW_STOCK-库存预警, PROFIT_ALERT-利润预警, SYNC_FAIL-同步失败
     */
    private String alertType;

    /**
     * 预警级别
     * info-信息 warning-警告 error-错误
     */
    private String alertLevel;

    /**
     * 预警内容
     */
    private String alertContent;

    /**
     * 触发值
     */
    private String triggerValue;

    /**
     * 阈值
     */
    private String thresholdValue;

    /**
     * 状态
     * unread-未读 read-已读 processed-已处理
     */
    private String status;

    /**
     * 处理人ID
     */
    private Long processedBy;

    /**
     * 处理时间
     */
    private LocalDateTime processedAt;

}
