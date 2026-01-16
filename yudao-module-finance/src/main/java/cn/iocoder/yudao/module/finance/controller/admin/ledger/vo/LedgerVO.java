package cn.iocoder.yudao.module.finance.controller.admin.ledger.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 总账 Response VO
 */
@Data
@Schema(description = "总账 Response VO")
public class LedgerVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "日期")
    private LocalDate date;
    
    @Schema(description = "科目编码")
    private String accountCode;
    
    @Schema(description = "科目名称")
    private String accountName;
    
    @Schema(description = "借方金额")
    private BigDecimal debitAmount;
    
    @Schema(description = "贷方金额")
    private BigDecimal creditAmount;
    
    @Schema(description = "余额")
    private BigDecimal balance;
    
    @Schema(description = "摘要")
    private String summary;
}

/**
 * 总账分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "总账分页查询 Request VO")
class LedgerPageReqVO extends PageParam {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "科目编码")
    private String accountCode;
}

/**
 * 会计核算 Response VO
 */
@Data
@Schema(description = "会计核算 Response VO")
class AccountingVO {
    @Schema(description = "总收入")
    private BigDecimal totalRevenue;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "总费用")
    private BigDecimal totalExpense;
    
    @Schema(description = "毛利润")
    private BigDecimal grossProfit;
    
    @Schema(description = "净利润")
    private BigDecimal netProfit;
    
    @Schema(description = "毛利率(%)")
    private BigDecimal grossProfitRate;
    
    @Schema(description = "净利率(%)")
    private BigDecimal netProfitRate;
}

/**
 * 资金流向 Response VO
 */
@Data
@Schema(description = "资金流向 Response VO")
class FundsFlowVO {
    @Schema(description = "总流入")
    private BigDecimal totalInflow;
    
    @Schema(description = "总流出")
    private BigDecimal totalOutflow;
    
    @Schema(description = "净流量")
    private BigDecimal netFlow;
    
    @Schema(description = "流入明细")
    private List<FlowDetailVO> inflowDetails;
    
    @Schema(description = "流出明细")
    private List<FlowDetailVO> outflowDetails;
}

/**
 * 流向明细 Response VO
 */
@Data
@Schema(description = "流向明细 Response VO")
class FlowDetailVO {
    @Schema(description = "类型")
    private String type;
    
    @Schema(description = "类型名称")
    private String typeName;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比(%)")
    private BigDecimal percentage;
}

/**
 * 库存成本 Response VO
 */
@Data
@Schema(description = "库存成本 Response VO")
class InventoryCostVO {
    @Schema(description = "库存总价值")
    private BigDecimal totalInventoryValue;
    
    @Schema(description = "SKU总数")
    private Integer totalSkuCount;
    
    @Schema(description = "低库存SKU数")
    private Integer lowStockCount;
    
    @Schema(description = "缺货SKU数")
    private Integer outOfStockCount;
}

/**
 * 销售分析 Response VO
 */
@Data
@Schema(description = "销售分析 Response VO")
class SalesAnalysisVO {
    @Schema(description = "分析维度")
    private String dimension;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "分析数据")
    private List<SalesDataVO> data;
}

/**
 * 销售数据 Response VO
 */
@Data
@Schema(description = "销售数据 Response VO")
class SalesDataVO {
    @Schema(description = "维度值")
    private String dimensionValue;
    
    @Schema(description = "销售额")
    private BigDecimal sales;
    
    @Schema(description = "订单数")
    private Integer orders;
    
    @Schema(description = "占比(%)")
    private BigDecimal percentage;
}

/**
 * 费用统计 Response VO
 */
@Data
@Schema(description = "费用统计 Response VO")
class ExpenseStatVO {
    @Schema(description = "推广费用")
    private BigDecimal promotionCost;
    
    @Schema(description = "平台费用")
    private BigDecimal platformFee;
    
    @Schema(description = "物流费用")
    private BigDecimal shippingCost;
    
    @Schema(description = "其他费用")
    private BigDecimal otherExpense;
    
    @Schema(description = "总费用")
    private BigDecimal totalExpense;
}

/**
 * 税务统计 Response VO
 */
@Data
@Schema(description = "税务统计 Response VO")
class TaxStatVO {
    @Schema(description = "总税额")
    private BigDecimal totalTax;
    
    @Schema(description = "增值税")
    private BigDecimal vat;
    
    @Schema(description = "所得税")
    private BigDecimal incomeTax;
    
    @Schema(description = "其他税费")
    private BigDecimal otherTax;
}

/**
 * 科目余额 Response VO
 */
@Data
@Schema(description = "科目余额 Response VO")
class AccountBalanceVO {
    @Schema(description = "科目编码")
    private String accountCode;
    
    @Schema(description = "科目名称")
    private String accountName;
    
    @Schema(description = "期初余额")
    private BigDecimal openingBalance;
    
    @Schema(description = "本期借方")
    private BigDecimal periodDebit;
    
    @Schema(description = "本期贷方")
    private BigDecimal periodCredit;
    
    @Schema(description = "期末余额")
    private BigDecimal closingBalance;
}

/**
 * 利润表 Response VO
 */
@Data
@Schema(description = "利润表 Response VO")
class ProfitStatementVO {
    @Schema(description = "营业收入")
    private BigDecimal revenue;
    
    @Schema(description = "营业成本")
    private BigDecimal costOfGoodsSold;
    
    @Schema(description = "毛利润")
    private BigDecimal grossProfit;
    
    @Schema(description = "营业费用")
    private BigDecimal operatingExpense;
    
    @Schema(description = "营业利润")
    private BigDecimal operatingProfit;
    
    @Schema(description = "净利润")
    private BigDecimal netProfit;
}
