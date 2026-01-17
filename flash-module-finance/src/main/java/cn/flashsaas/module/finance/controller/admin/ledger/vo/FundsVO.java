package cn.flashsaas.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 资金总览响应VO
 */
@Data
@Schema(description = "资金总览响应")
public class FundsOverviewRespVO {
    @Schema(description = "总余额")
    private BigDecimal totalBalance;
    
    @Schema(description = "可用余额")
    private BigDecimal totalAvailable;
    
    @Schema(description = "冻结金额")
    private BigDecimal totalFrozen;
    
    @Schema(description = "今日收入")
    private BigDecimal todayIn;
    
    @Schema(description = "今日支出")
    private BigDecimal todayOut;
    
    @Schema(description = "账户列表")
    private List<FundsAccountVO> accounts;
    
    @Schema(description = "资金预测")
    private FundsForecastRespVO forecast;
}

/**
 * 资金账户VO
 */
@Data
@Schema(description = "资金账户")
class FundsAccountVO {
    @Schema(description = "账户ID")
    private Long id;
    
    @Schema(description = "账户名称")
    private String name;
    
    @Schema(description = "账户类型")
    private String type;
    
    @Schema(description = "余额")
    private BigDecimal balance;
    
    @Schema(description = "可用余额")
    private BigDecimal available;
    
    @Schema(description = "冻结金额")
    private BigDecimal frozen;
    
    @Schema(description = "银行名称")
    private String bankName;
    
    @Schema(description = "账号")
    private String accountNo;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "最后同步时间")
    private String lastSyncTime;
}

/**
 * 资金流水VO
 */
@Data
@Schema(description = "资金流水")
class FundsTransactionVO {
    @Schema(description = "流水ID")
    private Long id;
    
    @Schema(description = "账户ID")
    private Long accountId;
    
    @Schema(description = "账户名称")
    private String accountName;
    
    @Schema(description = "类型")
    private String type;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "余额")
    private BigDecimal balance;
    
    @Schema(description = "摘要")
    private String summary;
    
    @Schema(description = "对方账户")
    private String counterparty;
    
    @Schema(description = "交易时间")
    private String transactionTime;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 转账请求VO
 */
@Data
@Schema(description = "转账请求")
class FundsTransferReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "转出账户ID")
    private Long fromAccountId;
    
    @Schema(description = "转入账户ID")
    private Long toAccountId;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 提现请求VO
 */
@Data
@Schema(description = "提现请求")
class FundsWithdrawReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "账户ID")
    private Long accountId;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "银行账号")
    private String bankAccount;
    
    @Schema(description = "银行名称")
    private String bankName;
}

/**
 * 资金预测响应VO
 */
@Data
@Schema(description = "资金预测响应")
class FundsForecastRespVO {
    @Schema(description = "预测数据")
    private List<FundsForecastItemVO> items;
    
    @Schema(description = "预计收入")
    private BigDecimal expectedIncome;
    
    @Schema(description = "预计支出")
    private BigDecimal expectedExpense;
    
    @Schema(description = "预计结余")
    private BigDecimal expectedBalance;
}

/**
 * 资金预测项VO
 */
@Data
@Schema(description = "资金预测项")
class FundsForecastItemVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "预计收入")
    private BigDecimal income;
    
    @Schema(description = "预计支出")
    private BigDecimal expense;
    
    @Schema(description = "预计余额")
    private BigDecimal balance;
}

/**
 * 提现记录VO
 */
@Data
@Schema(description = "提现记录")
class FundsWithdrawRecordVO {
    @Schema(description = "记录ID")
    private Long id;
    
    @Schema(description = "账户名称")
    private String accountName;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "银行账号")
    private String bankAccount;
    
    @Schema(description = "银行名称")
    private String bankName;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "申请时间")
    private String applyTime;
    
    @Schema(description = "完成时间")
    private String completeTime;
}

/**
 * 对账规则VO
 */
@Data
@Schema(description = "对账规则")
class FundsReconciliationRuleVO {
    @Schema(description = "规则ID")
    private Long id;
    
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "规则名称")
    private String name;
    
    @Schema(description = "匹配字段")
    private String matchField;
    
    @Schema(description = "匹配规则")
    private String matchRule;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
}
