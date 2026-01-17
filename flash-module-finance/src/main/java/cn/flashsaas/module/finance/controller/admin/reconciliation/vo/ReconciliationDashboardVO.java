package cn.flashsaas.module.finance.controller.admin.reconciliation.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 勾稽仪表盘响应VO
 */
@Data
@Schema(description = "勾稽仪表盘响应")
public class ReconciliationDashboardRespVO {
    @Schema(description = "订单勾稽统计")
    private ReconciliationSummaryVO orderSummary;
    
    @Schema(description = "成本勾稽统计")
    private ReconciliationSummaryVO costSummary;
    
    @Schema(description = "库存勾稽统计")
    private ReconciliationSummaryVO inventorySummary;
    
    @Schema(description = "推广费用勾稽统计")
    private ReconciliationSummaryVO promotionSummary;
    
    @Schema(description = "日度统计")
    private List<ReconciliationDailyStatsVO> dailyStats;
    
    @Schema(description = "差异分布")
    private List<ReconciliationDifferenceDistributionVO> differenceDistribution;
}

/**
 * 勾稽统计摘要VO
 */
@Data
@Schema(description = "勾稽统计摘要")
public class ReconciliationSummaryVO {
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "已匹配数量")
    private Integer matchedCount;
    
    @Schema(description = "差异数量")
    private Integer differenceCount;
    
    @Schema(description = "匹配率")
    private BigDecimal matchRate;
    
    @Schema(description = "总金额")
    private BigDecimal totalAmount;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
}

/**
 * 日度勾稽统计VO
 */
@Data
@Schema(description = "日度勾稽统计")
public class ReconciliationDailyStatsVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "订单匹配数")
    private Integer orderMatched;
    
    @Schema(description = "订单差异数")
    private Integer orderDifference;
    
    @Schema(description = "成本匹配数")
    private Integer costMatched;
    
    @Schema(description = "成本差异数")
    private Integer costDifference;
    
    @Schema(description = "库存匹配数")
    private Integer inventoryMatched;
    
    @Schema(description = "库存差异数")
    private Integer inventoryDifference;
    
    @Schema(description = "推广匹配数")
    private Integer promotionMatched;
    
    @Schema(description = "推广差异数")
    private Integer promotionDifference;
}

/**
 * 差异分布VO
 */
@Data
@Schema(description = "差异分布")
class ReconciliationDifferenceDistributionVO {
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
 * 订单勾稽VO
 */
@Data
@Schema(description = "订单勾稽")
public class ReconciliationOrderVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "订单号")
    private String orderNo;
    
    @Schema(description = "平台订单金额")
    private BigDecimal platformAmount;
    
    @Schema(description = "系统订单金额")
    private BigDecimal systemAmount;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "差异类型")
    private String differenceType;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "订单日期")
    private String orderDate;
    
    @Schema(description = "勾稽时间")
    private String reconciliationTime;
}

/**
 * 成本勾稽VO
 */
@Data
@Schema(description = "成本勾稽")
public class ReconciliationCostVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "商品名称")
    private String productName;
    
    @Schema(description = "采购成本")
    private BigDecimal purchaseCost;
    
    @Schema(description = "系统成本")
    private BigDecimal systemCost;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "勾稽时间")
    private String reconciliationTime;
}

/**
 * 库存勾稽VO
 */
@Data
@Schema(description = "库存勾稽")
public class ReconciliationInventoryVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "商品名称")
    private String productName;
    
    @Schema(description = "平台库存")
    private Integer platformStock;
    
    @Schema(description = "系统库存")
    private Integer systemStock;
    
    @Schema(description = "差异数量")
    private Integer differenceQty;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "勾稽时间")
    private String reconciliationTime;
}

/**
 * 推广费用勾稽VO
 */
@Data
@Schema(description = "推广费用勾稽")
public class ReconciliationPromotionVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "推广计划ID")
    private String planId;
    
    @Schema(description = "推广计划名称")
    private String planName;
    
    @Schema(description = "平台消耗")
    private BigDecimal platformCost;
    
    @Schema(description = "系统记录")
    private BigDecimal systemCost;
    
    @Schema(description = "差异金额")
    private BigDecimal differenceAmount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "勾稽时间")
    private String reconciliationTime;
}

/**
 * 勾稽匹配请求VO
 */
@Data
@Schema(description = "勾稽匹配请求")
public class ReconciliationMatchReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "勾稽类型")
    private String type;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
}

/**
 * 处理勾稽差异请求VO
 */
@Data
@Schema(description = "处理勾稽差异请求")
public class ReconciliationResolveReqVO {
    @Schema(description = "差异ID")
    private Long differenceId;
    
    @Schema(description = "勾稽类型")
    private String type;
    
    @Schema(description = "处理方式")
    private String resolveType;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 勾稽规则VO
 */
@Data
@Schema(description = "勾稽规则")
public class ReconciliationRuleVO {
    @Schema(description = "规则ID")
    private Long id;
    
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "规则名称")
    private String name;
    
    @Schema(description = "规则类型")
    private String type;
    
    @Schema(description = "匹配字段")
    private String matchField;
    
    @Schema(description = "容差值")
    private BigDecimal tolerance;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
public class ReconciliationExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "导出类型")
    private String type;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
    
    @Schema(description = "格式")
    private String format;
}
