package cn.iocoder.yudao.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 库存成本概览响应VO
 */
@Data
@Schema(description = "库存成本概览响应")
public class InventoryOverviewRespVO {
    @Schema(description = "库存总价值")
    private BigDecimal totalValue;
    
    @Schema(description = "SKU总数")
    private Integer totalSKU;
    
    @Schema(description = "健康SKU数")
    private Integer healthySKU;
    
    @Schema(description = "预警SKU数")
    private Integer warningSKU;
    
    @Schema(description = "危险SKU数")
    private Integer dangerSKU;
    
    @Schema(description = "周转天数")
    private BigDecimal turnoverDays;
    
    @Schema(description = "平均成本")
    private BigDecimal avgCost;
    
    @Schema(description = "成本变化率")
    private BigDecimal costChangeRate;
    
    @Schema(description = "当前计价方式")
    private String costingMethod;
    
    @Schema(description = "库龄分布")
    private List<InventoryAgeDistributionVO> ageDistribution;
}

/**
 * 库龄分布VO
 */
@Data
@Schema(description = "库龄分布")
class InventoryAgeDistributionVO {
    @Schema(description = "库龄范围")
    private String range;
    
    @Schema(description = "SKU数量")
    private Integer count;
    
    @Schema(description = "库存价值")
    private BigDecimal value;
    
    @Schema(description = "占比")
    private BigDecimal percentage;
}

/**
 * SKU成本追踪VO
 */
@Data
@Schema(description = "SKU成本追踪")
class InventorySkuCostVO {
    @Schema(description = "SKU ID")
    private Long id;
    
    @Schema(description = "商品名称")
    private String productName;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "采购成本")
    private BigDecimal purchaseCost;
    
    @Schema(description = "物流成本")
    private BigDecimal logisticsCost;
    
    @Schema(description = "分摊成本")
    private BigDecimal allocatedCost;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "成本波动")
    private BigDecimal costChange;
    
    @Schema(description = "成本趋势")
    private String costTrend;
    
    @Schema(description = "库存数量")
    private Integer stockQty;
    
    @Schema(description = "库存价值")
    private BigDecimal stockValue;
    
    @Schema(description = "成本历史")
    private List<InventoryCostHistoryVO> costHistory;
}

/**
 * 成本历史VO
 */
@Data
@Schema(description = "成本历史")
class InventoryCostHistoryVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "成本")
    private BigDecimal cost;
}

/**
 * 成本计价配置请求VO
 */
@Data
@Schema(description = "成本计价配置请求")
class InventoryCostingConfigReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "计价方式")
    private String costingMethod;
    
    @Schema(description = "生效日期")
    private String effectiveDate;
}

/**
 * 周转优化建议响应VO
 */
@Data
@Schema(description = "周转优化建议响应")
class InventoryOptimizationRespVO {
    @Schema(description = "滞销商品")
    private List<InventorySlowMovingVO> slowMoving;
    
    @Schema(description = "优化建议")
    private List<InventoryOptimizationItemVO> suggestions;
    
    @Schema(description = "预计节省")
    private BigDecimal expectedSaving;
}

/**
 * 滞销商品VO
 */
@Data
@Schema(description = "滞销商品")
class InventorySlowMovingVO {
    @Schema(description = "SKU ID")
    private Long id;
    
    @Schema(description = "商品名称")
    private String productName;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "库存数量")
    private Integer stockQty;
    
    @Schema(description = "库存价值")
    private BigDecimal stockValue;
    
    @Schema(description = "滞销天数")
    private Integer slowDays;
    
    @Schema(description = "最后销售日期")
    private String lastSaleDate;
    
    @Schema(description = "建议操作")
    private String suggestion;
}

/**
 * 优化建议项VO
 */
@Data
@Schema(description = "优化建议项")
class InventoryOptimizationItemVO {
    @Schema(description = "建议类型")
    private String type;
    
    @Schema(description = "建议内容")
    private String content;
    
    @Schema(description = "影响SKU数")
    private Integer affectedSKU;
    
    @Schema(description = "预计节省")
    private BigDecimal expectedSaving;
    
    @Schema(description = "优先级")
    private String priority;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
class InventoryExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "导出类型")
    private String exportType;
    
    @Schema(description = "格式")
    private String format;
}

/**
 * 成本波动预警VO
 */
@Data
@Schema(description = "成本波动预警")
class InventoryCostAlertVO {
    @Schema(description = "预警ID")
    private Long id;
    
    @Schema(description = "商品名称")
    private String productName;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "波动类型")
    private String changeType;
    
    @Schema(description = "波动幅度")
    private BigDecimal changeRate;
    
    @Schema(description = "原成本")
    private BigDecimal oldCost;
    
    @Schema(description = "新成本")
    private BigDecimal newCost;
    
    @Schema(description = "预警等级")
    private String alertLevel;
    
    @Schema(description = "创建时间")
    private String createdAt;
}

/**
 * 成本计价对比响应VO
 */
@Data
@Schema(description = "成本计价对比响应")
class InventoryCostingComparisonRespVO {
    @Schema(description = "FIFO成本")
    private BigDecimal fifoCost;
    
    @Schema(description = "加权平均成本")
    private BigDecimal weightedAvgCost;
    
    @Schema(description = "标准成本")
    private BigDecimal standardCost;
    
    @Schema(description = "移动平均成本")
    private BigDecimal movingAvgCost;
    
    @Schema(description = "对比数据")
    private List<InventoryCostingComparisonItemVO> comparison;
}

/**
 * 成本计价对比项VO
 */
@Data
@Schema(description = "成本计价对比项")
class InventoryCostingComparisonItemVO {
    @Schema(description = "月份")
    private String month;
    
    @Schema(description = "FIFO成本")
    private BigDecimal fifo;
    
    @Schema(description = "加权平均成本")
    private BigDecimal weightedAvg;
    
    @Schema(description = "标准成本")
    private BigDecimal standard;
}
