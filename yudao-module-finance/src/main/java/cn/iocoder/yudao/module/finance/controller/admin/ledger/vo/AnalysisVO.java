package cn.iocoder.yudao.module.finance.controller.admin.ledger.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * ROI分析响应VO
 */
@Data
@Schema(description = "ROI分析响应")
public class AnalysisRoiRespVO {
    @Schema(description = "总ROI")
    private BigDecimal totalRoi;
    
    @Schema(description = "ROI变化")
    private BigDecimal roiChange;
    
    @Schema(description = "总投入")
    private BigDecimal totalInvestment;
    
    @Schema(description = "总回报")
    private BigDecimal totalReturn;
    
    @Schema(description = "渠道ROI")
    private List<AnalysisChannelRoiVO> channelRoi;
    
    @Schema(description = "ROI趋势")
    private List<AnalysisRoiTrendVO> trend;
}

/**
 * 渠道ROI分析VO
 */
@Data
@Schema(description = "渠道ROI分析")
class AnalysisChannelRoiVO {
    @Schema(description = "渠道名称")
    private String channel;
    
    @Schema(description = "投入")
    private BigDecimal investment;
    
    @Schema(description = "回报")
    private BigDecimal returnValue;
    
    @Schema(description = "ROI")
    private BigDecimal roi;
    
    @Schema(description = "ROI变化")
    private BigDecimal roiChange;
    
    @Schema(description = "转化率")
    private BigDecimal conversionRate;
    
    @Schema(description = "客单价")
    private BigDecimal avgOrderValue;
}

/**
 * ROI趋势VO
 */
@Data
@Schema(description = "ROI趋势")
class AnalysisRoiTrendVO {
    @Schema(description = "日期")
    private String date;
    
    @Schema(description = "ROI")
    private BigDecimal roi;
    
    @Schema(description = "投入")
    private BigDecimal investment;
    
    @Schema(description = "回报")
    private BigDecimal returnValue;
}

/**
 * 盈亏平衡分析响应VO
 */
@Data
@Schema(description = "盈亏平衡分析响应")
class AnalysisBreakEvenRespVO {
    @Schema(description = "盈亏平衡点销售额")
    private BigDecimal breakEvenRevenue;
    
    @Schema(description = "盈亏平衡点销量")
    private Integer breakEvenQty;
    
    @Schema(description = "当前销售额")
    private BigDecimal currentRevenue;
    
    @Schema(description = "安全边际")
    private BigDecimal safetyMargin;
    
    @Schema(description = "安全边际率")
    private BigDecimal safetyMarginRate;
    
    @Schema(description = "固定成本")
    private BigDecimal fixedCost;
    
    @Schema(description = "变动成本率")
    private BigDecimal variableCostRate;
    
    @Schema(description = "边际贡献率")
    private BigDecimal contributionMarginRate;
    
    @Schema(description = "盈亏平衡图数据")
    private List<AnalysisBreakEvenChartVO> chartData;
}

/**
 * 盈亏平衡图数据VO
 */
@Data
@Schema(description = "盈亏平衡图数据")
class AnalysisBreakEvenChartVO {
    @Schema(description = "销量")
    private Integer quantity;
    
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "固定成本")
    private BigDecimal fixedCost;
}

/**
 * 利润贡献分析VO
 */
@Data
@Schema(description = "利润贡献分析")
class AnalysisProfitContributionVO {
    @Schema(description = "名称")
    private String name;
    
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "成本")
    private BigDecimal cost;
    
    @Schema(description = "毛利")
    private BigDecimal grossProfit;
    
    @Schema(description = "毛利率")
    private BigDecimal grossProfitRate;
    
    @Schema(description = "利润贡献")
    private BigDecimal profitContribution;
    
    @Schema(description = "利润贡献率")
    private BigDecimal contributionRate;
}

/**
 * 导出请求VO
 */
@Data
@Schema(description = "导出请求")
class AnalysisExportReqVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "报告类型")
    private String reportType;
    
    @Schema(description = "开始日期")
    private String startDate;
    
    @Schema(description = "结束日期")
    private String endDate;
    
    @Schema(description = "格式")
    private String format;
}

/**
 * 本量利分析响应VO
 */
@Data
@Schema(description = "本量利分析响应")
class AnalysisCvpRespVO {
    @Schema(description = "固定成本")
    private BigDecimal fixedCost;
    
    @Schema(description = "变动成本")
    private BigDecimal variableCost;
    
    @Schema(description = "单位变动成本")
    private BigDecimal unitVariableCost;
    
    @Schema(description = "单位售价")
    private BigDecimal unitPrice;
    
    @Schema(description = "边际贡献")
    private BigDecimal contributionMargin;
    
    @Schema(description = "边际贡献率")
    private BigDecimal contributionMarginRate;
    
    @Schema(description = "盈亏平衡点")
    private BigDecimal breakEvenPoint;
    
    @Schema(description = "目标利润所需销量")
    private Integer targetProfitQty;
    
    @Schema(description = "CVP图表数据")
    private List<AnalysisCvpChartVO> chartData;
}

/**
 * CVP图表数据VO
 */
@Data
@Schema(description = "CVP图表数据")
class AnalysisCvpChartVO {
    @Schema(description = "销量")
    private Integer quantity;
    
    @Schema(description = "收入")
    private BigDecimal revenue;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "利润")
    private BigDecimal profit;
}

/**
 * 敏感性分析响应VO
 */
@Data
@Schema(description = "敏感性分析响应")
class AnalysisSensitivityRespVO {
    @Schema(description = "基准利润")
    private BigDecimal baseProfit;
    
    @Schema(description = "敏感性数据")
    private List<AnalysisSensitivityItemVO> items;
    
    @Schema(description = "敏感性排名")
    private List<AnalysisSensitivityRankVO> ranking;
}

/**
 * 敏感性分析项VO
 */
@Data
@Schema(description = "敏感性分析项")
class AnalysisSensitivityItemVO {
    @Schema(description = "变化率")
    private BigDecimal changeRate;
    
    @Schema(description = "价格变化后利润")
    private BigDecimal priceProfit;
    
    @Schema(description = "销量变化后利润")
    private BigDecimal volumeProfit;
    
    @Schema(description = "成本变化后利润")
    private BigDecimal costProfit;
}

/**
 * 敏感性排名VO
 */
@Data
@Schema(description = "敏感性排名")
class AnalysisSensitivityRankVO {
    @Schema(description = "变量名称")
    private String variable;
    
    @Schema(description = "敏感系数")
    private BigDecimal coefficient;
    
    @Schema(description = "影响程度")
    private String impact;
}
