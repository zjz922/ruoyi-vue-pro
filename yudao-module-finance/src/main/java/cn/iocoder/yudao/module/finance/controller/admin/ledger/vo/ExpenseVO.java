package cn.iocoder.yudao.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 费用概览响应VO
 */
@Data
@Schema(description = "费用概览响应")
public class ExpenseOverviewRespVO {
    @Schema(description = "总费用")
    private BigDecimal totalExpense;
    
    @Schema(description = "预算金额")
    private BigDecimal budgetAmount;
    
    @Schema(description = "预算使用率")
    private BigDecimal budgetUsageRate;
    
    @Schema(description = "同比变化")
    private BigDecimal yoyChange;
    
    @Schema(description = "环比变化")
    private BigDecimal momChange;
    
    @Schema(description = "费用分类")
    private List<ExpenseCategoryVO> categories;
    
    @Schema(description = "费用趋势")
    private List<ExpenseTrendVO> trend;
}

/**
 * 费用分类VO
 */
@Data
@Schema(description = "费用分类")
class ExpenseCategoryVO {
    @Schema(description = "分类名称")
    private String category;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
    
    @Schema(description = "预算")
    private BigDecimal budget;
    
    @Schema(description = "预算使用率")
    private BigDecimal budgetUsageRate;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 费用趋势VO
 */
@Data
@Schema(description = "费用趋势")
class ExpenseTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "预算")
    private BigDecimal budget;
}

/**
 * 多维度费用分摊响应VO
 */
@Data
@Schema(description = "多维度费用分摊响应")
class ExpenseAllocationRespVO {
    @Schema(description = "维度")
    private String dimension;
    
    @Schema(description = "分摊数据")
    private List<ExpenseAllocationItemVO> items;
    
    @Schema(description = "总金额")
    private BigDecimal totalAmount;
}

/**
 * 费用分摊项VO
 */
@Data
@Schema(description = "费用分摊项")
class ExpenseAllocationItemVO {
    @Schema(description = "名称")
    private String name;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
    
    @Schema(description = "子项")
    private List<ExpenseAllocationItemVO> children;
}

/**
 * 费用预算请求VO
 */
@Data
@Schema(description = "费用预算请求")
class ExpenseBudgetReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "预算项")
    private List<ExpenseBudgetItemVO> items;
}

/**
 * 费用预算项VO
 */
@Data
@Schema(description = "费用预算项")
class ExpenseBudgetItemVO {
    @Schema(description = "分类")
    private String category;
    
    @Schema(description = "预算金额")
    private BigDecimal amount;
}

/**
 * 费用录入请求VO
 */
@Data
@Schema(description = "费用录入请求")
class ExpenseCreateReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "费用类别")
    private String category;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "摘要")
    private String summary;
    
    @Schema(description = "备注")
    private String remark;
    
    @Schema(description = "附件")
    private List<String> attachments;
}

/**
 * 异常费用VO
 */
@Data
@Schema(description = "异常费用")
class ExpenseAnomalyVO {
    @Schema(description = "异常ID")
    private Long id;
    
    @Schema(description = "费用类别")
    private String category;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "异常类型")
    private String anomalyType;
    
    @Schema(description = "异常描述")
    private String description;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "发现时间")
    private String detectedAt;
}

/**
 * 确认异常费用请求VO
 */
@Data
@Schema(description = "确认异常费用请求")
class ExpenseConfirmAnomalyReqVO {
    @Schema(description = "异常ID")
    private Long anomalyId;
    
    @Schema(description = "确认结果")
    private String result;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 审批费用请求VO
 */
@Data
@Schema(description = "审批费用请求")
class ExpenseApproveReqVO {
    @Schema(description = "费用ID")
    private Long expenseId;
    
    @Schema(description = "审批结果")
    private String result;
    
    @Schema(description = "审批意见")
    private String opinion;
}

/**
 * 费用明细VO
 */
@Data
@Schema(description = "费用明细")
class ExpenseDetailVO {
    @Schema(description = "费用ID")
    private Long id;
    
    @Schema(description = "费用类别")
    private String category;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "摘要")
    private String summary;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "创建人")
    private String createdBy;
    
    @Schema(description = "创建时间")
    private String createdAt;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
class ExpenseExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
    
    @Schema(description = "格式")
    private String format;
}

/**
 * 预算预警VO
 */
@Data
@Schema(description = "预算预警")
class ExpenseBudgetAlertVO {
    @Schema(description = "预警ID")
    private Long id;
    
    @Schema(description = "费用类别")
    private String category;
    
    @Schema(description = "预算金额")
    private BigDecimal budgetAmount;
    
    @Schema(description = "已用金额")
    private BigDecimal usedAmount;
    
    @Schema(description = "使用率")
    private BigDecimal usageRate;
    
    @Schema(description = "预警级别")
    private String alertLevel;
    
    @Schema(description = "预警消息")
    private String message;
}

/**
 * 预算执行趋势VO
 */
@Data
@Schema(description = "预算执行趋势")
class ExpenseBudgetTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "预算")
    private BigDecimal budget;
    
    @Schema(description = "实际")
    private BigDecimal actual;
    
    @Schema(description = "差异")
    private BigDecimal variance;
}
