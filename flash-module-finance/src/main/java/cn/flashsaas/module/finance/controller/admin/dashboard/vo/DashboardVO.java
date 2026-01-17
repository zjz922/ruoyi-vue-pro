package cn.flashsaas.module.finance.controller.admin.dashboard.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Dashboard VO 类集合
 */
public class DashboardVO {
}

/**
 * 经营概览 Response VO
 */
@Data
@Schema(description = "经营概览 Response VO")
class DashboardOverviewVO {
    @Schema(description = "总销售额")
    private BigDecimal totalSales;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "总利润")
    private BigDecimal totalProfit;
    
    @Schema(description = "利润率(%)")
    private BigDecimal profitRate;
    
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "总退款数")
    private Integer totalRefunds;
    
    @Schema(description = "销售额同比增长率(%)")
    private BigDecimal salesGrowthRate;
    
    @Schema(description = "订单量同比增长率(%)")
    private BigDecimal orderGrowthRate;
}

/**
 * 销售趋势 Response VO
 */
@Data
@Schema(description = "销售趋势 Response VO")
class SalesTrendVO {
    @Schema(description = "日期")
    private LocalDate date;
    
    @Schema(description = "销售额")
    private BigDecimal sales;
    
    @Schema(description = "订单数")
    private Integer orders;
    
    @Schema(description = "成本")
    private BigDecimal cost;
    
    @Schema(description = "利润")
    private BigDecimal profit;
}

/**
 * 商品排行 Response VO
 */
@Data
@Schema(description = "商品排行 Response VO")
class ProductRankVO {
    @Schema(description = "排名")
    private Integer rank;
    
    @Schema(description = "商品ID")
    private String productId;
    
    @Schema(description = "商品名称")
    private String productName;
    
    @Schema(description = "商品图片")
    private String productImage;
    
    @Schema(description = "销售额")
    private BigDecimal sales;
    
    @Schema(description = "销量")
    private Integer quantity;
    
    @Schema(description = "利润")
    private BigDecimal profit;
}

/**
 * 订单状态统计 Response VO
 */
@Data
@Schema(description = "订单状态统计 Response VO")
class OrderStatusStatVO {
    @Schema(description = "待付款")
    private Integer pendingPayment;
    
    @Schema(description = "待发货")
    private Integer pendingShipment;
    
    @Schema(description = "已发货")
    private Integer shipped;
    
    @Schema(description = "已完成")
    private Integer completed;
    
    @Schema(description = "已取消")
    private Integer cancelled;
    
    @Schema(description = "退款中")
    private Integer refunding;
}

/**
 * 资金概览 Response VO
 */
@Data
@Schema(description = "资金概览 Response VO")
class FundOverviewVO {
    @Schema(description = "总收入")
    private BigDecimal totalIncome;
    
    @Schema(description = "总支出")
    private BigDecimal totalExpense;
    
    @Schema(description = "账户余额")
    private BigDecimal balance;
    
    @Schema(description = "待结算金额")
    private BigDecimal pendingSettlement;
}

/**
 * 利润分析 Response VO
 */
@Data
@Schema(description = "利润分析 Response VO")
class ProfitAnalysisVO {
    @Schema(description = "总收入")
    private BigDecimal totalRevenue;
    
    @Schema(description = "商品成本")
    private BigDecimal productCost;
    
    @Schema(description = "推广费用")
    private BigDecimal promotionCost;
    
    @Schema(description = "平台费用")
    private BigDecimal platformFee;
    
    @Schema(description = "毛利润")
    private BigDecimal grossProfit;
    
    @Schema(description = "净利润")
    private BigDecimal netProfit;
}

/**
 * 实时数据 Response VO
 */
@Data
@Schema(description = "实时数据 Response VO")
class RealtimeDataVO {
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
    
    @Schema(description = "今日销售额")
    private BigDecimal todaySales;
    
    @Schema(description = "今日订单数")
    private Integer todayOrders;
    
    @Schema(description = "今日访客数")
    private Integer todayVisitors;
}
