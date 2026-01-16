package cn.iocoder.yudao.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 财务核算报表响应VO
 */
@Data
@Schema(description = "财务核算报表响应")
public class AccountingReportRespVO {
    @Schema(description = "双轨制数据")
    private DualTrackDataVO dualTrack;
    
    @Schema(description = "月度对比数据")
    private List<MonthlyComparisonItemVO> monthlyComparison;
    
    @Schema(description = "资产负债表")
    private BalanceSheetRespVO balanceSheet;
    
    @Schema(description = "现金流量表")
    private List<CashFlowCategoryVO> cashFlowStatement;
    
    @Schema(description = "日报数据")
    private DailyReportRespVO dailyReport;
    
    @Schema(description = "日趋势数据")
    private List<DailyTrendItemVO> dailyTrend;
    
    @Schema(description = "收入分类数据")
    private List<RevenueTypeItemVO> revenueByType;
    
    @Schema(description = "收入明细")
    private List<RevenueDetailItemVO> revenueDetails;
    
    @Schema(description = "退款分析")
    private RefundAnalysisRespVO refundAnalysis;
    
    @Schema(description = "退款订单")
    private List<RefundOrderItemVO> refundOrders;
}

/**
 * 双轨制数据VO
 */
@Data
@Schema(description = "双轨制数据")
class DualTrackDataVO {
    @Schema(description = "权责发生制")
    private AccrualDataVO accrual;
    
    @Schema(description = "收付实现制")
    private AccrualDataVO cash;
}

/**
 * 权责/收付数据VO
 */
@Data
@Schema(description = "权责/收付数据")
class AccrualDataVO {
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "成本")
    private BigDecimal cost;
    
    @Schema(description = "毛利")
    private BigDecimal grossProfit;
    
    @Schema(description = "营业费用")
    private BigDecimal operatingExpense;
    
    @Schema(description = "净利润")
    private BigDecimal netProfit;
}

/**
 * 月度对比项VO
 */
@Data
@Schema(description = "月度对比项")
class MonthlyComparisonItemVO {
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "权责发生制金额")
    private BigDecimal accrual;
    
    @Schema(description = "收付实现制金额")
    private BigDecimal cash;
}

/**
 * 利润表项VO
 */
@Data
@Schema(description = "利润表项")
class IncomeStatementItemVO {
    @Schema(description = "项目名称")
    private String item;
    
    @Schema(description = "本期金额")
    private BigDecimal current;
    
    @Schema(description = "上期金额")
    private BigDecimal previous;
    
    @Schema(description = "变化率")
    private BigDecimal change;
    
    @Schema(description = "是否缩进")
    private Boolean indent;
    
    @Schema(description = "是否高亮")
    private Boolean highlight;
    
    @Schema(description = "是否加粗")
    private Boolean bold;
}

/**
 * 资产负债表响应VO
 */
@Data
@Schema(description = "资产负债表响应")
class BalanceSheetRespVO {
    @Schema(description = "资产")
    private List<BalanceSheetItemVO> assets;
    
    @Schema(description = "负债")
    private List<BalanceSheetItemVO> liabilities;
    
    @Schema(description = "所有者权益")
    private List<BalanceSheetItemVO> equity;
}

/**
 * 资产负债表项VO
 */
@Data
@Schema(description = "资产负债表项")
class BalanceSheetItemVO {
    @Schema(description = "项目名称")
    private String item;
    
    @Schema(description = "金额")
    private BigDecimal value;
    
    @Schema(description = "子项")
    private List<BalanceSheetItemVO> children;
}

/**
 * 现金流量表分类VO
 */
@Data
@Schema(description = "现金流量表分类")
class CashFlowCategoryVO {
    @Schema(description = "分类名称")
    private String category;
    
    @Schema(description = "明细项")
    private List<CashFlowItemVO> items;
    
    @Schema(description = "小计")
    private BigDecimal subtotal;
}

/**
 * 现金流量表项VO
 */
@Data
@Schema(description = "现金流量表项")
class CashFlowItemVO {
    @Schema(description = "项目名称")
    private String item;
    
    @Schema(description = "金额")
    private BigDecimal value;
    
    @Schema(description = "类型(in/out)")
    private String type;
}

/**
 * 日报数据响应VO
 */
@Data
@Schema(description = "日报数据响应")
class DailyReportRespVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "订单统计")
    private OrderStatsVO orderStats;
    
    @Schema(description = "财务统计")
    private FinancialStatsVO financialStats;
    
    @Schema(description = "资金流向")
    private FundFlowVO fundFlow;
}

/**
 * 订单统计VO
 */
@Data
@Schema(description = "订单统计")
class OrderStatsVO {
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "已付款订单数")
    private Integer paidOrders;
    
    @Schema(description = "转化率")
    private BigDecimal conversionRate;
    
    @Schema(description = "客单价")
    private BigDecimal avgOrderValue;
}

/**
 * 财务统计VO
 */
@Data
@Schema(description = "财务统计")
class FinancialStatsVO {
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "成本")
    private BigDecimal cost;
    
    @Schema(description = "毛利")
    private BigDecimal grossProfit;
    
    @Schema(description = "毛利率")
    private BigDecimal grossProfitRate;
    
    @Schema(description = "费用")
    private BigDecimal expenses;
    
    @Schema(description = "净利润")
    private BigDecimal netProfit;
    
    @Schema(description = "净利率")
    private BigDecimal netProfitRate;
}

/**
 * 资金流向VO
 */
@Data
@Schema(description = "资金流向")
class FundFlowVO {
    @Schema(description = "流入")
    private BigDecimal inflow;
    
    @Schema(description = "流出")
    private BigDecimal outflow;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
}

/**
 * 日趋势项VO
 */
@Data
@Schema(description = "日趋势项")
class DailyTrendItemVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "利润")
    private BigDecimal profit;
    
    @Schema(description = "订单数")
    private Integer orders;
}

/**
 * 收入分类项VO
 */
@Data
@Schema(description = "收入分类项")
class RevenueTypeItemVO {
    @Schema(description = "类型")
    private String type;
    
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "成本")
    private BigDecimal cost;
    
    @Schema(description = "毛利")
    private BigDecimal grossProfit;
    
    @Schema(description = "毛利率")
    private BigDecimal rate;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 收入明细项VO
 */
@Data
@Schema(description = "收入明细项")
class RevenueDetailItemVO {
    @Schema(description = "ID")
    private String id;
    
    @Schema(description = "订单号")
    private String orderNo;
    
    @Schema(description = "类型")
    private String type;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "成本")
    private BigDecimal cost;
    
    @Schema(description = "利润")
    private BigDecimal profit;
    
    @Schema(description = "时间")
    private String time;
}

/**
 * 退款分析响应VO
 */
@Data
@Schema(description = "退款分析响应")
class RefundAnalysisRespVO {
    @Schema(description = "汇总数据")
    private RefundSummaryVO summary;
    
    @Schema(description = "按原因分析")
    private List<RefundByReasonVO> byReason;
    
    @Schema(description = "按店铺分析")
    private List<RefundByShopVO> byShop;
    
    @Schema(description = "趋势数据")
    private List<RefundTrendVO> trend;
}

/**
 * 退款汇总VO
 */
@Data
@Schema(description = "退款汇总")
class RefundSummaryVO {
    @Schema(description = "总金额")
    private BigDecimal totalAmount;
    
    @Schema(description = "总笔数")
    private Integer totalCount;
    
    @Schema(description = "退款率")
    private BigDecimal refundRate;
    
    @Schema(description = "平均退款金额")
    private BigDecimal avgRefundAmount;
}

/**
 * 按原因分析VO
 */
@Data
@Schema(description = "按原因分析")
class RefundByReasonVO {
    @Schema(description = "原因")
    private String reason;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "笔数")
    private Integer count;
    
    @Schema(description = "占比")
    private BigDecimal rate;
}

/**
 * 按店铺分析VO
 */
@Data
@Schema(description = "按店铺分析")
class RefundByShopVO {
    @Schema(description = "店铺")
    private String shop;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "笔数")
    private Integer count;
    
    @Schema(description = "占比")
    private BigDecimal rate;
}

/**
 * 退款趋势VO
 */
@Data
@Schema(description = "退款趋势")
class RefundTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "笔数")
    private Integer count;
}

/**
 * 退款订单项VO
 */
@Data
@Schema(description = "退款订单项")
class RefundOrderItemVO {
    @Schema(description = "ID")
    private String id;
    
    @Schema(description = "订单号")
    private String orderNo;
    
    @Schema(description = "店铺")
    private String shop;
    
    @Schema(description = "品类")
    private String category;
    
    @Schema(description = "原因")
    private String reason;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "时间")
    private String time;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
class AccountingExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "报表类型")
    private String reportType;
    
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "格式")
    private String format;
}
