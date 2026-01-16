package cn.iocoder.yudao.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 税务概览响应VO
 */
@Data
@Schema(description = "税务概览响应")
public class TaxOverviewRespVO {
    @Schema(description = "应纳税额")
    private BigDecimal taxPayable;
    
    @Schema(description = "已缴税额")
    private BigDecimal taxPaid;
    
    @Schema(description = "待缴税额")
    private BigDecimal taxPending;
    
    @Schema(description = "税负率")
    private BigDecimal taxBurdenRate;
    
    @Schema(description = "税负率变化")
    private BigDecimal taxBurdenChange;
    
    @Schema(description = "风险预警数")
    private Integer riskCount;
    
    @Schema(description = "待申报数")
    private Integer pendingDeclarations;
    
    @Schema(description = "税种分布")
    private List<TaxTypeDistributionVO> distribution;
}

/**
 * 税种分布VO
 */
@Data
@Schema(description = "税种分布")
class TaxTypeDistributionVO {
    @Schema(description = "税种")
    private String taxType;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 税务风险预警VO
 */
@Data
@Schema(description = "税务风险预警")
class TaxRiskVO {
    @Schema(description = "风险ID")
    private Long id;
    
    @Schema(description = "风险类型")
    private String riskType;
    
    @Schema(description = "风险等级")
    private String riskLevel;
    
    @Schema(description = "风险描述")
    private String description;
    
    @Schema(description = "涉及金额")
    private BigDecimal amount;
    
    @Schema(description = "建议措施")
    private String suggestion;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "发现时间")
    private String detectedAt;
}

/**
 * 申报日历VO
 */
@Data
@Schema(description = "申报日历")
class TaxDeclarationVO {
    @Schema(description = "申报ID")
    private Long id;
    
    @Schema(description = "税种")
    private String taxType;
    
    @Schema(description = "申报期间")
    private String period;
    
    @Schema(description = "截止日期")
    private String deadline;
    
    @Schema(description = "应纳税额")
    private BigDecimal amount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "申报日期")
    private String declaredAt;
}

/**
 * 税务预警规则请求VO
 */
@Data
@Schema(description = "税务预警规则请求")
class TaxAlertConfigReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "税负率上限")
    private BigDecimal taxBurdenUpperLimit;
    
    @Schema(description = "税负率下限")
    private BigDecimal taxBurdenLowerLimit;
    
    @Schema(description = "申报提醒天数")
    private Integer declarationReminderDays;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
}

/**
 * 忽略风险请求VO
 */
@Data
@Schema(description = "忽略风险请求")
class TaxIgnoreRiskReqVO {
    @Schema(description = "风险ID")
    private Long riskId;
    
    @Schema(description = "忽略原因")
    private String reason;
}

/**
 * 发票统计响应VO
 */
@Data
@Schema(description = "发票统计响应")
class TaxInvoiceStatsRespVO {
    @Schema(description = "销项发票金额")
    private BigDecimal outputAmount;
    
    @Schema(description = "销项发票数量")
    private Integer outputCount;
    
    @Schema(description = "进项发票金额")
    private BigDecimal inputAmount;
    
    @Schema(description = "进项发票数量")
    private Integer inputCount;
    
    @Schema(description = "可抵扣税额")
    private BigDecimal deductibleTax;
    
    @Schema(description = "发票明细")
    private List<TaxInvoiceItemVO> invoices;
}

/**
 * 发票明细VO
 */
@Data
@Schema(description = "发票明细")
class TaxInvoiceItemVO {
    @Schema(description = "发票ID")
    private Long id;
    
    @Schema(description = "发票号码")
    private String invoiceNo;
    
    @Schema(description = "发票类型")
    private String invoiceType;
    
    @Schema(description = "方向")
    private String direction;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "税额")
    private BigDecimal taxAmount;
    
    @Schema(description = "开票日期")
    private String invoiceDate;
    
    @Schema(description = "对方名称")
    private String counterparty;
}

/**
 * 税务报表请求VO
 */
@Data
@Schema(description = "税务报表请求")
class TaxReportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "报表类型")
    private String reportType;
    
    @Schema(description = "期间")
    private String period;
    
    @Schema(description = "格式")
    private String format;
}

/**
 * 税负率趋势VO
 */
@Data
@Schema(description = "税负率趋势")
class TaxBurdenTrendVO {
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "税负率")
    private BigDecimal taxBurdenRate;
    
    @Schema(description = "行业平均")
    private BigDecimal industryAvg;
    
    @Schema(description = "应纳税额")
    private BigDecimal taxPayable;
    
    @Schema(description = "销售收入")
    private BigDecimal revenue;
}

/**
 * 可抵扣项目VO
 */
@Data
@Schema(description = "可抵扣项目")
class TaxDeductionItemVO {
    @Schema(description = "项目ID")
    private Long id;
    
    @Schema(description = "项目名称")
    private String name;
    
    @Schema(description = "可抵扣金额")
    private BigDecimal amount;
    
    @Schema(description = "抵扣类型")
    private String deductionType;
    
    @Schema(description = "有效期")
    private String validUntil;
    
    @Schema(description = "状态")
    private String status;
}
