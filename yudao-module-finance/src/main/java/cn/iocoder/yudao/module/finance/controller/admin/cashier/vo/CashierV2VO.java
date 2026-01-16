package cn.iocoder.yudao.module.finance.controller.admin.cashier.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 出纳仪表盘响应VO V2
 */
@Data
@Schema(description = "出纳仪表盘响应V2")
public class CashierDashboardRespVO {
    @Schema(description = "今日收入")
    private BigDecimal todayIncome;
    
    @Schema(description = "今日支出")
    private BigDecimal todayExpense;
    
    @Schema(description = "今日净流入")
    private BigDecimal todayNetFlow;
    
    @Schema(description = "账户余额")
    private BigDecimal accountBalance;
    
    @Schema(description = "待处理预警数")
    private Integer pendingAlerts;
    
    @Schema(description = "待对账数")
    private Integer pendingReconciliation;
    
    @Schema(description = "收入来源分布")
    private List<CashierIncomeSourceVO> incomeSource;
    
    @Schema(description = "支出结构分布")
    private List<CashierExpenseStructureVO> expenseStructure;
    
    @Schema(description = "最近预警")
    private List<CashierAlertVO> recentAlerts;
}

/**
 * 出纳概览响应VO V2
 */
@Data
@Schema(description = "出纳概览响应V2")
public class CashierOverviewRespVO {
    @Schema(description = "月度收入")
    private BigDecimal monthlyIncome;
    
    @Schema(description = "月度支出")
    private BigDecimal monthlyExpense;
    
    @Schema(description = "月度净流入")
    private BigDecimal monthlyNetFlow;
    
    @Schema(description = "收入同比")
    private BigDecimal incomeYoy;
    
    @Schema(description = "支出同比")
    private BigDecimal expenseYoy;
    
    @Schema(description = "日度趋势")
    private List<CashierDailyTrendVO> dailyTrend;
}

/**
 * 收入来源VO
 */
@Data
@Schema(description = "收入来源")
public class CashierIncomeSourceVO {
    @Schema(description = "来源名称")
    private String name;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 支出结构VO
 */
@Data
@Schema(description = "支出结构")
public class CashierExpenseStructureVO {
    @Schema(description = "类型名称")
    private String name;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 日度趋势VO
 */
@Data
@Schema(description = "日度趋势")
public class CashierDailyTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "收入")
    private BigDecimal income;
    
    @Schema(description = "支出")
    private BigDecimal expense;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
}

/**
 * 日报响应VO V2
 */
@Data
@Schema(description = "日报响应V2")
public class CashierDailyReportRespVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "总收入")
    private BigDecimal totalIncome;
    
    @Schema(description = "总支出")
    private BigDecimal totalExpense;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
    
    @Schema(description = "收入来源分布")
    private List<CashierIncomeSourceVO> incomeSource;
    
    @Schema(description = "渠道收入分布")
    private List<CashierChannelIncomeVO> channelIncome;
    
    @Schema(description = "支出结构分布")
    private List<CashierExpenseStructureVO> expenseStructure;
    
    @Schema(description = "渠道支出分布")
    private List<CashierChannelExpenseVO> channelExpense;
}

/**
 * 渠道收入VO
 */
@Data
@Schema(description = "渠道收入")
public class CashierChannelIncomeVO {
    @Schema(description = "渠道名称")
    private String channelName;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
}

/**
 * 渠道支出VO
 */
@Data
@Schema(description = "渠道支出")
public class CashierChannelExpenseVO {
    @Schema(description = "渠道名称")
    private String channelName;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
}

/**
 * 月报响应VO V2
 */
@Data
@Schema(description = "月报响应V2")
public class CashierMonthlyReportRespVO {
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "总收入")
    private BigDecimal totalIncome;
    
    @Schema(description = "总支出")
    private BigDecimal totalExpense;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
    
    @Schema(description = "收入同比")
    private BigDecimal incomeYoy;
    
    @Schema(description = "支出同比")
    private BigDecimal expenseYoy;
    
    @Schema(description = "收入结构分布")
    private List<CashierIncomeSourceVO> incomeStructure;
    
    @Schema(description = "支出结构分布")
    private List<CashierExpenseStructureVO> expenseStructure;
    
    @Schema(description = "渠道月度统计")
    private List<CashierChannelMonthlyVO> channelMonthly;
    
    @Schema(description = "日度明细")
    private List<CashierDailyTrendVO> dailyDetails;
}

/**
 * 渠道月度统计VO
 */
@Data
@Schema(description = "渠道月度统计")
public class CashierChannelMonthlyVO {
    @Schema(description = "渠道名称")
    private String channelName;
    
    @Schema(description = "收入")
    private BigDecimal income;
    
    @Schema(description = "支出")
    private BigDecimal expense;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
}

/**
 * 店铺报表响应VO V2
 */
@Data
@Schema(description = "店铺报表响应V2")
public class CashierShopReportRespVO {
    @Schema(description = "店铺列表")
    private List<CashierShopDataVO> shops;
    
    @Schema(description = "店铺趋势")
    private List<CashierShopTrendVO> shopTrend;
}

/**
 * 店铺数据VO
 */
@Data
@Schema(description = "店铺数据")
public class CashierShopDataVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "店铺名称")
    private String shopName;
    
    @Schema(description = "收入")
    private BigDecimal income;
    
    @Schema(description = "支出")
    private BigDecimal expense;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
    
    @Schema(description = "同比增长")
    private BigDecimal yoyGrowth;
}

/**
 * 店铺趋势VO
 */
@Data
@Schema(description = "店铺趋势")
public class CashierShopTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "店铺数据")
    private List<CashierShopDailyVO> shops;
}

/**
 * 店铺日度数据VO
 */
@Data
@Schema(description = "店铺日度数据")
public class CashierShopDailyVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "收入")
    private BigDecimal income;
    
    @Schema(description = "支出")
    private BigDecimal expense;
}

/**
 * 银行对账VO V2
 */
@Data
@Schema(description = "银行对账V2")
public class CashierReconciliationVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "交易流水号")
    private String transactionNo;
    
    @Schema(description = "银行流水号")
    private String bankNo;
    
    @Schema(description = "交易金额")
    private BigDecimal amount;
    
    @Schema(description = "银行金额")
    private BigDecimal bankAmount;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "交易时间")
    private String transactionTime;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 银行对账匹配请求VO
 */
@Data
@Schema(description = "银行对账匹配请求")
public class CashierReconciliationMatchReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
}

/**
 * 银行对账处理请求VO
 */
@Data
@Schema(description = "银行对账处理请求")
public class CashierReconciliationResolveReqVO {
    @Schema(description = "对账ID")
    private Long reconciliationId;
    
    @Schema(description = "处理方式")
    private String resolveType;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 差异分析响应VO V2
 */
@Data
@Schema(description = "差异分析响应V2")
public class CashierDifferencesRespVO {
    @Schema(description = "差异总数")
    private Integer totalDifferences;
    
    @Schema(description = "差异总金额")
    private BigDecimal totalAmount;
    
    @Schema(description = "差异趋势")
    private List<CashierDifferenceTrendVO> trend;
    
    @Schema(description = "差异原因分布")
    private List<CashierDifferenceReasonVO> reasonDistribution;
    
    @Schema(description = "平台差异分布")
    private List<CashierPlatformDifferenceVO> platformDistribution;
}

/**
 * 差异趋势VO
 */
@Data
@Schema(description = "差异趋势")
public class CashierDifferenceTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "差异数量")
    private Integer count;
    
    @Schema(description = "差异金额")
    private BigDecimal amount;
}

/**
 * 差异原因VO
 */
@Data
@Schema(description = "差异原因")
public class CashierDifferenceReasonVO {
    @Schema(description = "原因")
    private String reason;
    
    @Schema(description = "数量")
    private Integer count;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
}

/**
 * 平台差异VO
 */
@Data
@Schema(description = "平台差异")
public class CashierPlatformDifferenceVO {
    @Schema(description = "平台")
    private String platform;
    
    @Schema(description = "数量")
    private Integer count;
    
    @Schema(description = "金额")
    private BigDecimal amount;
}

/**
 * 预警VO V2
 */
@Data
@Schema(description = "预警V2")
public class CashierAlertVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "预警类型")
    private String type;
    
    @Schema(description = "预警级别")
    private String level;
    
    @Schema(description = "预警标题")
    private String title;
    
    @Schema(description = "预警内容")
    private String content;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "创建时间")
    private String createdAt;
    
    @Schema(description = "处理时间")
    private String processedAt;
    
    @Schema(description = "处理人")
    private String processedBy;
}

/**
 * 预警处理请求VO
 */
@Data
@Schema(description = "预警处理请求")
public class CashierAlertProcessReqVO {
    @Schema(description = "预警ID")
    private Long alertId;
    
    @Schema(description = "处理方式")
    private String processType;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 预警标记已读请求VO
 */
@Data
@Schema(description = "预警标记已读请求")
public class CashierAlertMarkReadReqVO {
    @Schema(description = "预警ID列表")
    private List<Long> alertIds;
}

/**
 * 预警规则VO V2
 */
@Data
@Schema(description = "预警规则V2")
public class CashierAlertRuleVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "规则名称")
    private String name;
    
    @Schema(description = "规则类型")
    private String type;
    
    @Schema(description = "条件")
    private String condition;
    
    @Schema(description = "阈值")
    private BigDecimal threshold;
    
    @Schema(description = "预警级别")
    private String level;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "通知方式")
    private String notifyMethod;
}

/**
 * 预警规则创建请求VO
 */
@Data
@Schema(description = "预警规则创建请求")
public class CashierAlertRuleCreateReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "规则名称")
    private String name;
    
    @Schema(description = "规则类型")
    private String type;
    
    @Schema(description = "条件")
    private String condition;
    
    @Schema(description = "阈值")
    private BigDecimal threshold;
    
    @Schema(description = "预警级别")
    private String level;
    
    @Schema(description = "通知方式")
    private String notifyMethod;
}

/**
 * 预警规则更新请求VO
 */
@Data
@Schema(description = "预警规则更新请求")
public class CashierAlertRuleUpdateReqVO {
    @Schema(description = "规则名称")
    private String name;
    
    @Schema(description = "条件")
    private String condition;
    
    @Schema(description = "阈值")
    private BigDecimal threshold;
    
    @Schema(description = "预警级别")
    private String level;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "通知方式")
    private String notifyMethod;
}

/**
 * 渠道VO V2
 */
@Data
@Schema(description = "渠道V2")
public class CashierChannelVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "渠道名称")
    private String name;
    
    @Schema(description = "渠道类型")
    private String type;
    
    @Schema(description = "账户信息")
    private String accountInfo;
    
    @Schema(description = "余额")
    private BigDecimal balance;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "最后同步时间")
    private String lastSyncTime;
}

/**
 * 渠道创建请求VO
 */
@Data
@Schema(description = "渠道创建请求")
public class CashierChannelCreateReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "渠道名称")
    private String name;
    
    @Schema(description = "渠道类型")
    private String type;
    
    @Schema(description = "账户信息")
    private String accountInfo;
}

/**
 * 渠道更新请求VO
 */
@Data
@Schema(description = "渠道更新请求")
public class CashierChannelUpdateReqVO {
    @Schema(description = "渠道名称")
    private String name;
    
    @Schema(description = "账户信息")
    private String accountInfo;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
}

/**
 * 渠道统计VO V2
 */
@Data
@Schema(description = "渠道统计V2")
public class CashierChannelStatsVO {
    @Schema(description = "渠道ID")
    private Long channelId;
    
    @Schema(description = "渠道名称")
    private String channelName;
    
    @Schema(description = "收入")
    private BigDecimal income;
    
    @Schema(description = "支出")
    private BigDecimal expense;
    
    @Schema(description = "净流入")
    private BigDecimal netFlow;
    
    @Schema(description = "交易笔数")
    private Integer transactionCount;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
public class CashierExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "报表类型")
    private String reportType;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
    
    @Schema(description = "格式")
    private String format;
}
