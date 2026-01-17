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
 * 资金流水数据对象
 *
 * @author 闪电账PRO
 */
@TableName("finance_cashflow")
@KeySequence("finance_cashflow_seq")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowDO extends BaseDO {

    /**
     * 资金流水ID
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
     * 流水号
     */
    private String flowNo;

    /**
     * 交易类型 (收入、支出、退款等)
     */
    private String tradeType;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 余额
     */
    private BigDecimal balance;

    /**
     * 渠道 (支付宝、微信、银行卡等)
     */
    private String channel;

    /**
     * 交易对方
     */
    private String counterparty;

    /**
     * 交易描述
     */
    private String description;

    /**
     * 交易时间
     */
    private LocalDateTime tradeTime;

    /**
     * 确认状态 (未确认、已确认)
     */
    private String confirmStatus;

    /**
     * 确认时间
     */
    private LocalDateTime confirmTime;

    /**
     * 对账状态 (未对账、已对账、差异)
     */
    private String reconciliationStatus;

    /**
     * 来源平台 (doudian、qianchuan等)
     */
    private String platform;

    /**
     * 平台流水ID
     */
    private String platformFlowId;

    /**
     * 备注
     */
    private String remark;

    /**
     * 删除标志 (0 未删除, 1 已删除)
     */
    private Integer delFlag;
}
