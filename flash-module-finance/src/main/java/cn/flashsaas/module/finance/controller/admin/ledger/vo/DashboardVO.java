package cn.flashsaas.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 经营概览相关VO类
 */
public class DashboardVO {
}

/**
 * 经营概览响应VO
 */
@Data
@Schema(description = "经营概览响应")
class DashboardOverviewRespVO {
    @Schema(description = "KPI数据")
    private DashboardKpiRespVO kpi;
    
    @Schema(description = "趋势数据")
    private List<DashboardTrendItemVO> trends;
    
    @Schema(description = "费用分布")
    private List<DashboardExpenseItemVO> expenseBreakdown;
    
    @Schema(description = "预警列表")
    private List<DashboardAlertVO> alerts;
    
    @Schema(description = "最近交易")
    private List<DashboardTransactionVO> recentTransactions;
}

/**
 * KPI数据响应VO
 */
@Data
@Schema(description = "KPI数据响应")
class DashboardKpiRespVO {
    @Schema(description = "总收入")
    private BigDecimal totalRevenue;
    
    @Schema(description = "收入变化率")
    private BigDecimal revenueChange;
    
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "订单变化率")
    private BigDecimal ordersChange;
    
    @Schema(description = "毛利润")
    private BigDecimal grossProfit;
    
    @Schema(description = "利润变化率")
    private BigDecimal profitChange;
    
    @Schema(description = "毛利率")
    private BigDecimal grossMargin;
    
    @Schema(description = "毛利率变化")
    private BigDecimal marginChange;
}

/**
 * 趋势数据项VO
 */
@Data
@Schema(description = "趋势数据项")
class DashboardTrendItemVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "利润")
    private BigDecimal profit;
    
    @Schema(description = "订单数")
    private Integer orders;
    
    @Schema(description = "成本")
    private BigDecimal cost;
}

/**
 * 费用分布项VO
 */
@Data
@Schema(description = "费用分布项")
class DashboardExpenseItemVO {
    @Schema(description = "费用名称")
    private String name;
    
    @Schema(description = "费用金额")
    private BigDecimal value;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 预警项VO
 */
@Data
@Schema(description = "预警项")
class DashboardAlertVO {
    @Schema(description = "预警ID")
    private Long id;
    
    @Schema(description = "预警类型")
    private String type;
    
    @Schema(description = "预警标题")
    private String title;
    
    @Schema(description = "预警内容")
    private String message;
    
    @Schema(description = "预警级别")
    private String level;
    
    @Schema(description = "创建时间")
    private String createdAt;
}

/**
 * 最近交易VO
 */
@Data
@Schema(description = "最近交易")
class DashboardTransactionVO {
    @Schema(description = "交易ID")
    private Long id;
    
    @Schema(description = "交易类型")
    private String type;
    
    @Schema(description = "交易描述")
    private String description;
    
    @Schema(description = "交易金额")
    private BigDecimal amount;
    
    @Schema(description = "交易时间")
    private String time;
}
