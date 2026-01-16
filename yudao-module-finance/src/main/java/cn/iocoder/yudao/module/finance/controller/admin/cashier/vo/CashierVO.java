package cn.iocoder.yudao.module.finance.controller.admin.cashier.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 出纳工作台 Response VO
 */
@Data
@Schema(description = "出纳工作台 Response VO")
public class CashierDashboardVO {
    @Schema(description = "今日收入")
    private BigDecimal todayIncome;
    
    @Schema(description = "今日支出")
    private BigDecimal todayExpense;
    
    @Schema(description = "账户余额")
    private BigDecimal balance;
    
    @Schema(description = "待对账数量")
    private Integer pendingReconciliation;
    
    @Schema(description = "未读预警数量")
    private Integer unreadAlerts;
}

/**
 * 待办任务 Response VO
 */
@Data
@Schema(description = "待办任务 Response VO")
class PendingTaskVO {
    @Schema(description = "任务ID")
    private Long taskId;
    
    @Schema(description = "任务类型")
    private String taskType;
    
    @Schema(description = "任务标题")
    private String title;
    
    @Schema(description = "任务描述")
    private String description;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 渠道 Response VO
 */
@Data
@Schema(description = "渠道 Response VO")
class ChannelVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "渠道编码")
    private String channelCode;
    
    @Schema(description = "渠道名称")
    private String channelName;
    
    @Schema(description = "渠道类型")
    private String channelType;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "余额")
    private BigDecimal balance;
}

/**
 * 渠道配置 Request VO
 */
@Data
@Schema(description = "渠道配置 Request VO")
class ChannelConfigReqVO {
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID", required = true)
    private Long shopId;
    
    @Schema(description = "渠道编码", required = true)
    private String channelCode;
    
    @Schema(description = "渠道名称", required = true)
    private String channelName;
    
    @Schema(description = "渠道类型", required = true)
    private String channelType;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
}

/**
 * 对账结果 Response VO
 */
@Data
@Schema(description = "对账结果 Response VO")
class ReconciliationResultVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "对账日期")
    private LocalDate checkDate;
    
    @Schema(description = "平台")
    private String platform;
    
    @Schema(description = "总对账数")
    private Integer totalChecked;
    
    @Schema(description = "匹配数")
    private Integer matchedCount;
    
    @Schema(description = "差异数")
    private Integer differenceCount;
    
    @Schema(description = "状态")
    private String status;
}

/**
 * 差异分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "差异分页查询 Request VO")
class DifferencePageReqVO extends PageParam {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "状态")
    private String status;
}

/**
 * 差异 Response VO
 */
@Data
@Schema(description = "差异 Response VO")
class DifferenceVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "订单号")
    private String orderId;
    
    @Schema(description = "差异类型")
    private String differenceType;
    
    @Schema(description = "系统金额")
    private BigDecimal systemAmount;
    
    @Schema(description = "平台金额")
    private BigDecimal platformAmount;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 日报表 Response VO
 */
@Data
@Schema(description = "日报表 Response VO")
class DailyReportVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "报表日期")
    private LocalDate reportDate;
    
    @Schema(description = "总销售额")
    private BigDecimal totalSales;
    
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "毛利润")
    private BigDecimal grossProfit;
}

/**
 * 月报表 Response VO
 */
@Data
@Schema(description = "月报表 Response VO")
class MonthlyReportVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "年份")
    private Integer year;
    
    @Schema(description = "月份")
    private Integer month;
    
    @Schema(description = "总销售额")
    private BigDecimal totalSales;
    
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "毛利润")
    private BigDecimal grossProfit;
}

/**
 * 店铺统计 Response VO
 */
@Data
@Schema(description = "店铺统计 Response VO")
class ShopStatVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "总销售额")
    private BigDecimal totalSales;
    
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "平均客单价")
    private BigDecimal averageOrderValue;
}

/**
 * 预警 Response VO
 */
@Data
@Schema(description = "预警 Response VO")
class AlertVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "预警类型")
    private String alertType;
    
    @Schema(description = "预警级别")
    private String alertLevel;
    
    @Schema(description = "标题")
    private String title;
    
    @Schema(description = "内容")
    private String content;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 预警规则配置 Request VO
 */
@Data
@Schema(description = "预警规则配置 Request VO")
class AlertRuleConfigReqVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "规则名称", required = true)
    private String ruleName;
    
    @Schema(description = "规则类型", required = true)
    private String ruleType;
    
    @Schema(description = "条件", required = true)
    private String condition;
    
    @Schema(description = "阈值", required = true)
    private BigDecimal threshold;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "通知方式")
    private String notifyType;
}

/**
 * 资金流水汇总 Response VO
 */
@Data
@Schema(description = "资金流水汇总 Response VO")
class CashflowSummaryVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "总收入")
    private BigDecimal totalIncome;
    
    @Schema(description = "总支出")
    private BigDecimal totalExpense;
    
    @Schema(description = "净流量")
    private BigDecimal netCashflow;
}
