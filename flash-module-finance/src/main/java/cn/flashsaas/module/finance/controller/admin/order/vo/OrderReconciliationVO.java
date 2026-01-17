package cn.flashsaas.module.finance.controller.admin.order.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 订单对账概览响应VO
 */
@Data
@Schema(description = "订单对账概览响应")
public class OrderReconciliationOverviewRespVO {
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "已对账订单数")
    private Integer reconciledOrders;
    
    @Schema(description = "差异订单数")
    private Integer differenceOrders;
    
    @Schema(description = "对账率")
    private BigDecimal reconciliationRate;
    
    @Schema(description = "平台订单金额")
    private BigDecimal platformAmount;
    
    @Schema(description = "系统订单金额")
    private BigDecimal systemAmount;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "最后同步时间")
    private String lastSyncTime;
    
    @Schema(description = "差异类型分布")
    private List<DifferenceTypeDistributionVO> differenceDistribution;
}

/**
 * 差异类型分布VO
 */
@Data
@Schema(description = "差异类型分布")
class DifferenceTypeDistributionVO {
    @Schema(description = "类型")
    private String type;
    
    @Schema(description = "数量")
    private Integer count;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "颜色")
    private String color;
}

/**
 * 订单同步请求VO
 */
@Data
@Schema(description = "订单同步请求")
class OrderSyncReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
    
    @Schema(description = "同步类型")
    private String syncType;
}

/**
 * 订单对比响应VO
 */
@Data
@Schema(description = "订单对比响应")
class OrderCompareRespVO {
    @Schema(description = "平台订单数")
    private Integer platformCount;
    
    @Schema(description = "系统订单数")
    private Integer systemCount;
    
    @Schema(description = "匹配订单数")
    private Integer matchedCount;
    
    @Schema(description = "平台独有")
    private Integer platformOnly;
    
    @Schema(description = "系统独有")
    private Integer systemOnly;
    
    @Schema(description = "金额差异")
    private Integer amountDiff;
    
    @Schema(description = "状态差异")
    private Integer statusDiff;
    
    @Schema(description = "对比明细")
    private List<OrderCompareItemVO> details;
}

/**
 * 订单对比项VO
 */
@Data
@Schema(description = "订单对比项")
class OrderCompareItemVO {
    @Schema(description = "订单号")
    private String orderNo;
    
    @Schema(description = "平台金额")
    private BigDecimal platformAmount;
    
    @Schema(description = "系统金额")
    private BigDecimal systemAmount;
    
    @Schema(description = "差异类型")
    private String differenceType;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
}

/**
 * 差异订单VO
 */
@Data
@Schema(description = "差异订单")
class OrderDifferenceVO {
    @Schema(description = "差异ID")
    private Long id;
    
    @Schema(description = "订单号")
    private String orderNo;
    
    @Schema(description = "差异类型")
    private String differenceType;
    
    @Schema(description = "平台金额")
    private BigDecimal platformAmount;
    
    @Schema(description = "系统金额")
    private BigDecimal systemAmount;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "发现时间")
    private String detectedAt;
    
    @Schema(description = "处理时间")
    private String resolvedAt;
    
    @Schema(description = "处理人")
    private String resolvedBy;
    
    @Schema(description = "处理备注")
    private String remark;
}

/**
 * 处理差异请求VO
 */
@Data
@Schema(description = "处理差异请求")
class OrderResolveReqVO {
    @Schema(description = "差异ID")
    private Long differenceId;
    
    @Schema(description = "处理方式")
    private String resolveType;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 月度订单统计VO
 */
@Data
@Schema(description = "月度订单统计")
class OrderMonthlyStatsVO {
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "订单数")
    private Integer orderCount;
    
    @Schema(description = "订单金额")
    private BigDecimal orderAmount;
    
    @Schema(description = "退款数")
    private Integer refundCount;
    
    @Schema(description = "退款金额")
    private BigDecimal refundAmount;
    
    @Schema(description = "净销售额")
    private BigDecimal netSales;
    
    @Schema(description = "同比增长")
    private BigDecimal yoyGrowth;
    
    @Schema(description = "环比增长")
    private BigDecimal momGrowth;
}

/**
 * 年度订单统计响应VO
 */
@Data
@Schema(description = "年度订单统计响应")
class OrderYearlyStatsRespVO {
    @Schema(description = "年份")
    private Integer year;
    
    @Schema(description = "总订单数")
    private Integer totalOrders;
    
    @Schema(description = "总订单金额")
    private BigDecimal totalAmount;
    
    @Schema(description = "总退款数")
    private Integer totalRefunds;
    
    @Schema(description = "总退款金额")
    private BigDecimal totalRefundAmount;
    
    @Schema(description = "净销售额")
    private BigDecimal netSales;
    
    @Schema(description = "平均客单价")
    private BigDecimal avgOrderValue;
    
    @Schema(description = "退款率")
    private BigDecimal refundRate;
    
    @Schema(description = "月度明细")
    private List<OrderMonthlyStatsVO> monthlyDetails;
    
    @Schema(description = "季度汇总")
    private List<OrderQuarterlyStatsVO> quarterlyDetails;
}

/**
 * 季度订单统计VO
 */
@Data
@Schema(description = "季度订单统计")
class OrderQuarterlyStatsVO {
    @Schema(description = "季度")
    private String quarter;
    
    @Schema(description = "订单数")
    private Integer orderCount;
    
    @Schema(description = "订单金额")
    private BigDecimal orderAmount;
    
    @Schema(description = "同比增长")
    private BigDecimal yoyGrowth;
}

/**
 * 日度订单统计VO
 */
@Data
@Schema(description = "日度订单统计")
class OrderDailyStatsVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "订单数")
    private Integer orderCount;
    
    @Schema(description = "订单金额")
    private BigDecimal orderAmount;
    
    @Schema(description = "退款数")
    private Integer refundCount;
    
    @Schema(description = "退款金额")
    private BigDecimal refundAmount;
    
    @Schema(description = "净销售额")
    private BigDecimal netSales;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
class OrderExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
    
    @Schema(description = "导出类型")
    private String exportType;
    
    @Schema(description = "格式")
    private String format;
}

/**
 * 同步状态响应VO
 */
@Data
@Schema(description = "同步状态响应")
class OrderSyncStatusRespVO {
    @Schema(description = "最后同步时间")
    private String lastSyncTime;
    
    @Schema(description = "同步状态")
    private String status;
    
    @Schema(description = "同步进度")
    private Integer progress;
    
    @Schema(description = "同步消息")
    private String message;
    
    @Schema(description = "待同步数量")
    private Integer pendingCount;
}
