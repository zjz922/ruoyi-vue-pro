package cn.flashsaas.module.finance.dal.dataobject;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 预警规则 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_alert_rule")
@KeySequence("finance_alert_rule_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRuleDO extends BaseDO {

    /**
     * 规则ID
     */
    @TableId
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 店铺ID（NULL表示全局规则）
     */
    private Long shopId;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 规则类型
     * 如：LOW_STOCK-库存预警, PROFIT_ALERT-利润预警, SYNC_FAIL-同步失败, RECONCILIATION_DIFF-对账差异
     */
    private String ruleType;

    /**
     * 条件配置（JSON格式）
     * 示例：{"threshold": 100, "operator": "lt", "field": "stock_quantity"}
     */
    private String conditionConfig;

    /**
     * 通知配置（JSON格式）
     * 示例：{"channels": ["email", "sms"], "recipients": ["admin@example.com"]}
     */
    private String notifyConfig;

    /**
     * 是否启用
     */
    private Boolean enabled;

    /**
     * 创建人
     */
    private String createBy;

}
