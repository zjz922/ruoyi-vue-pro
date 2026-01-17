package cn.flashsaas.module.finance.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 交易类型枚举
 *
 * @author 闪电账PRO
 */
@Getter
@AllArgsConstructor
public enum TradeTypeEnum {

    INCOME("收入", "income"),
    EXPENSE("支出", "expense"),
    REFUND("退款", "refund"),
    TRANSFER("转账", "transfer"),
    ADJUSTMENT("调整", "adjustment");

    /**
     * 类型名称
     */
    private final String name;

    /**
     * 类型值
     */
    private final String value;

}
