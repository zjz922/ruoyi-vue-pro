package cn.iocoder.yudao.module.finance.controller.admin.integration.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// ==================== DoudianAuth VO ====================

/**
 * 抖店授权状态 Response VO
 */
@Data
@Schema(description = "抖店授权状态 Response VO")
class AuthStatusVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "是否已授权")
    private Boolean authorized;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "消息")
    private String message;
    
    @Schema(description = "过期时间")
    private LocalDateTime expireTime;
}

// ==================== Qianchuan VO ====================

/**
 * 千川同步结果 Response VO
 */
@Data
@Schema(description = "同步结果 Response VO")
class SyncResultVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "同步时间")
    private LocalDateTime syncTime;
    
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "成功数量")
    private Integer successCount;
    
    @Schema(description = "失败数量")
    private Integer failCount;
    
    @Schema(description = "状态")
    private String status;
}

/**
 * 推广费用 Response VO
 */
@Data
@Schema(description = "推广费用 Response VO")
class PromotionCostVO {
    @Schema(description = "日期")
    private LocalDate date;
    
    @Schema(description = "计划ID")
    private String planId;
    
    @Schema(description = "计划名称")
    private String planName;
    
    @Schema(description = "花费")
    private BigDecimal cost;
    
    @Schema(description = "展示数")
    private Long impressions;
    
    @Schema(description = "点击数")
    private Long clicks;
    
    @Schema(description = "转化数")
    private Long conversions;
}

/**
 * 推广统计 Response VO
 */
@Data
@Schema(description = "推广统计 Response VO")
class PromotionStatVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "统计日期")
    private LocalDate statDate;
    
    @Schema(description = "总花费")
    private BigDecimal totalCost;
    
    @Schema(description = "总展示数")
    private Long totalImpressions;
    
    @Schema(description = "总点击数")
    private Long totalClicks;
    
    @Schema(description = "总转化数")
    private Long totalConversions;
    
    @Schema(description = "点击率(%)")
    private BigDecimal ctr;
    
    @Schema(description = "转化率(%)")
    private BigDecimal cvr;
    
    @Schema(description = "ROI")
    private BigDecimal roi;
}

/**
 * 千川配置保存 Request VO
 */
@Data
@Schema(description = "千川配置保存 Request VO")
class QianchuanConfigSaveReqVO {
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID", required = true)
    private Long shopId;
    
    @Schema(description = "广告主ID")
    private String advertiserId;
}

/**
 * 千川授权状态 Response VO
 */
@Data
@Schema(description = "千川授权状态 Response VO")
class QianchuanAuthStatusVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "是否已授权")
    private Boolean authorized;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "消息")
    private String message;
    
    @Schema(description = "过期时间")
    private LocalDateTime expireTime;
    
    @Schema(description = "广告主ID")
    private String advertiserId;
}

/**
 * 推广计划 Response VO
 */
@Data
@Schema(description = "推广计划 Response VO")
class PromotionPlanVO {
    @Schema(description = "计划ID")
    private String planId;
    
    @Schema(description = "计划名称")
    private String planName;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "日预算")
    private BigDecimal dailyBudget;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 推广数据分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "推广数据分页查询 Request VO")
class PromotionDataPageReqVO extends PageParam {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "计划ID")
    private String planId;
}

/**
 * 推广数据 Response VO
 */
@Data
@Schema(description = "推广数据 Response VO")
class PromotionDataVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "日期")
    private LocalDate date;
    
    @Schema(description = "计划ID")
    private String planId;
    
    @Schema(description = "计划名称")
    private String planName;
    
    @Schema(description = "花费")
    private BigDecimal cost;
    
    @Schema(description = "展示数")
    private Long impressions;
    
    @Schema(description = "点击数")
    private Long clicks;
    
    @Schema(description = "转化数")
    private Long conversions;
}

// ==================== JST VO ====================

/**
 * 聚水潭配置 Request VO
 */
@Data
@Schema(description = "聚水潭配置 Request VO")
class JstConfigReqVO {
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID", required = true)
    private Long shopId;
    
    @Schema(description = "AppKey", required = true)
    private String appKey;
    
    @Schema(description = "AppSecret", required = true)
    private String appSecret;
    
    @Schema(description = "AccessToken")
    private String accessToken;
}

/**
 * 聚水潭连接状态 Response VO
 */
@Data
@Schema(description = "聚水潭连接状态 Response VO")
class JstConnectionStatusVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "是否已连接")
    private Boolean connected;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "消息")
    private String message;
    
    @Schema(description = "最后同步时间")
    private LocalDateTime lastSyncTime;
}

/**
 * 入库单分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "入库单分页查询 Request VO")
class InboundOrderPageReqVO extends PageParam {
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
 * 入库单 Response VO
 */
@Data
@Schema(description = "入库单 Response VO")
class InboundOrderVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "入库单号")
    private String inboundNo;
    
    @Schema(description = "入库日期")
    private LocalDate inboundDate;
    
    @Schema(description = "供应商")
    private String supplier;
    
    @Schema(description = "总金额")
    private BigDecimal totalAmount;
    
    @Schema(description = "状态")
    private String status;
}

/**
 * 库存 Response VO
 */
@Data
@Schema(description = "库存 Response VO")
class InventoryVO {
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "SKU名称")
    private String skuName;
    
    @Schema(description = "库存数量")
    private Integer quantity;
    
    @Schema(description = "可用数量")
    private Integer availableQuantity;
    
    @Schema(description = "锁定数量")
    private Integer lockedQuantity;
}

/**
 * 批量更新结果 Response VO
 */
@Data
@Schema(description = "批量更新结果 Response VO")
class BatchUpdateResultVO {
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
    
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "成功数量")
    private Integer successCount;
    
    @Schema(description = "失败数量")
    private Integer failCount;
    
    @Schema(description = "失败的SKU列表")
    private List<String> failedSkus;
}

/**
 * 聚水潭同步日志 Response VO
 */
@Data
@Schema(description = "聚水潭同步日志 Response VO")
class JstSyncLogVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "同步类型")
    private String syncType;
    
    @Schema(description = "开始时间")
    private LocalDateTime startTime;
    
    @Schema(description = "结束时间")
    private LocalDateTime endTime;
    
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "成功数量")
    private Integer successCount;
    
    @Schema(description = "失败数量")
    private Integer failCount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "错误信息")
    private String errorMessage;
}

// ==================== OrderSync VO ====================

/**
 * 订单同步结果 Response VO
 */
@Data
@Schema(description = "订单同步结果 Response VO")
class OrderSyncResultVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "开始时间")
    private LocalDateTime startTime;
    
    @Schema(description = "结束时间")
    private LocalDateTime endTime;
    
    @Schema(description = "同步时间")
    private LocalDateTime syncTime;
    
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "成功数量")
    private Integer successCount;
    
    @Schema(description = "失败数量")
    private Integer failCount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "错误信息")
    private String errorMessage;
}

/**
 * 同步状态 Response VO
 */
@Data
@Schema(description = "同步状态 Response VO")
class SyncStatusVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "是否正在同步")
    private Boolean syncing;
    
    @Schema(description = "最后同步时间")
    private LocalDateTime lastSyncTime;
    
    @Schema(description = "最后同步状态")
    private String lastSyncStatus;
    
    @Schema(description = "最后同步数量")
    private Integer lastSyncCount;
}

/**
 * 同步日志分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "同步日志分页查询 Request VO")
class SyncLogPageReqVO extends PageParam {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "同步类型")
    private String syncType;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "开始时间")
    private LocalDateTime startTime;
    
    @Schema(description = "结束时间")
    private LocalDateTime endTime;
}

/**
 * 同步日志 Response VO
 */
@Data
@Schema(description = "同步日志 Response VO")
class SyncLogVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "同步类型")
    private String syncType;
    
    @Schema(description = "开始时间")
    private LocalDateTime startTime;
    
    @Schema(description = "结束时间")
    private LocalDateTime endTime;
    
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "成功数量")
    private Integer successCount;
    
    @Schema(description = "失败数量")
    private Integer failCount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "错误信息")
    private String errorMessage;
}

/**
 * 自动同步配置 Response VO
 */
@Data
@Schema(description = "自动同步配置 Response VO")
class AutoSyncConfigVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "同步间隔(分钟)")
    private Integer intervalMinutes;
}

/**
 * 同步统计 Response VO
 */
@Data
@Schema(description = "同步统计 Response VO")
class SyncStatVO {
    @Schema(description = "店铺ID")
    private String shopId;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
    
    @Schema(description = "总同步次数")
    private Integer totalSyncCount;
    
    @Schema(description = "成功同步次数")
    private Integer successSyncCount;
    
    @Schema(description = "失败同步次数")
    private Integer failSyncCount;
    
    @Schema(description = "总同步订单数")
    private Integer totalOrdersSynced;
}

// ==================== CostUpdate VO ====================

/**
 * 成本更新 Request VO
 */
@Data
@Schema(description = "成本更新 Request VO")
class CostUpdateReqVO {
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID", required = true)
    private Long shopId;
    
    @Schema(description = "SKU编码", required = true)
    private String skuCode;
    
    @Schema(description = "SKU名称")
    private String skuName;
    
    @Schema(description = "采购成本")
    private BigDecimal purchaseCost;
    
    @Schema(description = "运费成本")
    private BigDecimal shippingCost;
    
    @Schema(description = "包装成本")
    private BigDecimal packagingCost;
    
    @Schema(description = "其他成本")
    private BigDecimal otherCost;
    
    @Schema(description = "成本计算方法")
    private String costMethod;
}

/**
 * 导入结果 Response VO
 */
@Data
@Schema(description = "导入结果 Response VO")
class ImportResultVO {
    @Schema(description = "导入时间")
    private LocalDateTime importTime;
    
    @Schema(description = "总行数")
    private Integer totalRows;
    
    @Schema(description = "成功行数")
    private Integer successRows;
    
    @Schema(description = "失败行数")
    private Integer failRows;
    
    @Schema(description = "错误信息")
    private List<String> errors;
}

/**
 * 成本分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "成本分页查询 Request VO")
class CostPageReqVO extends PageParam {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "SKU名称")
    private String skuName;
}

/**
 * 商品成本 Response VO
 */
@Data
@Schema(description = "商品成本 Response VO")
class ProductCostVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "SKU名称")
    private String skuName;
    
    @Schema(description = "采购成本")
    private BigDecimal purchaseCost;
    
    @Schema(description = "运费成本")
    private BigDecimal shippingCost;
    
    @Schema(description = "包装成本")
    private BigDecimal packagingCost;
    
    @Schema(description = "其他成本")
    private BigDecimal otherCost;
    
    @Schema(description = "总成本")
    private BigDecimal totalCost;
    
    @Schema(description = "成本计算方法")
    private String costMethod;
    
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}

/**
 * 成本历史 Response VO
 */
@Data
@Schema(description = "成本历史 Response VO")
class CostHistoryVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "SKU编码")
    private String skuCode;
    
    @Schema(description = "变更前成本")
    private BigDecimal beforeCost;
    
    @Schema(description = "变更后成本")
    private BigDecimal afterCost;
    
    @Schema(description = "变更原因")
    private String reason;
    
    @Schema(description = "变更时间")
    private LocalDateTime changeTime;
}

/**
 * 成本统计 Response VO
 */
@Data
@Schema(description = "成本统计 Response VO")
class CostStatVO {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "SKU总数")
    private Integer totalSkuCount;
    
    @Schema(description = "已配置成本SKU数")
    private Integer configuredSkuCount;
    
    @Schema(description = "未配置成本SKU数")
    private Integer unconfiguredSkuCount;
    
    @Schema(description = "平均成本")
    private BigDecimal averageCost;
}

// ==================== Document VO ====================

/**
 * 单据分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "单据分页查询 Request VO")
class DocumentPageReqVO extends PageParam {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "单据类型")
    private String documentType;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
}

/**
 * 单据 Response VO
 */
@Data
@Schema(description = "单据 Response VO")
class DocumentVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "单据编号")
    private String documentNo;
    
    @Schema(description = "单据类型")
    private String documentType;
    
    @Schema(description = "单据日期")
    private LocalDate documentDate;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "备注")
    private String remark;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 单据详情 Response VO
 */
@Data
@Schema(description = "单据详情 Response VO")
class DocumentDetailVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "单据编号")
    private String documentNo;
    
    @Schema(description = "单据类型")
    private String documentType;
    
    @Schema(description = "单据日期")
    private LocalDate documentDate;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "备注")
    private String remark;
    
    @Schema(description = "关联订单")
    private List<String> orderIds;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
    
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}

/**
 * 单据创建 Request VO
 */
@Data
@Schema(description = "单据创建 Request VO")
class DocumentCreateReqVO {
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID", required = true)
    private Long shopId;
    
    @Schema(description = "单据类型", required = true)
    private String documentType;
    
    @Schema(description = "单据日期", required = true)
    private LocalDate documentDate;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 单据更新 Request VO
 */
@Data
@Schema(description = "单据更新 Request VO")
class DocumentUpdateReqVO {
    @Schema(description = "ID", required = true)
    private Long id;
    
    @Schema(description = "单据日期")
    private LocalDate documentDate;
    
    @Schema(description = "金额")
    private BigDecimal amount;
    
    @Schema(description = "备注")
    private String remark;
}

/**
 * 单据统计 Response VO
 */
@Data
@Schema(description = "单据统计 Response VO")
class DocumentStatVO {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "单据总数")
    private Integer totalDocuments;
    
    @Schema(description = "待处理单据数")
    private Integer pendingDocuments;
    
    @Schema(description = "已完成单据数")
    private Integer completedDocuments;
    
    @Schema(description = "已取消单据数")
    private Integer cancelledDocuments;
}

/**
 * 单据导出 Request VO
 */
@Data
@Schema(description = "单据导出 Request VO")
class DocumentExportReqVO {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "单据类型")
    private String documentType;
    
    @Schema(description = "开始日期")
    private LocalDate startDate;
    
    @Schema(description = "结束日期")
    private LocalDate endDate;
}

/**
 * 单据类型 Response VO
 */
@Data
@Schema(description = "单据类型 Response VO")
class DocumentTypeVO {
    @Schema(description = "类型编码")
    private String code;
    
    @Schema(description = "类型名称")
    private String name;
}

// ==================== Alert VO ====================

/**
 * 预警规则分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "预警规则分页查询 Request VO")
class AlertRulePageReqVO extends PageParam {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "规则类型")
    private String ruleType;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
}

/**
 * 预警规则 Response VO
 */
@Data
@Schema(description = "预警规则 Response VO")
class AlertRuleVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "规则名称")
    private String ruleName;
    
    @Schema(description = "规则类型")
    private String ruleType;
    
    @Schema(description = "条件")
    private String condition;
    
    @Schema(description = "阈值")
    private BigDecimal threshold;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "通知方式")
    private String notifyType;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

/**
 * 预警规则创建 Request VO
 */
@Data
@Schema(description = "预警规则创建 Request VO")
class AlertRuleCreateReqVO {
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
    
    @Schema(description = "通知配置")
    private String notifyConfig;
}

/**
 * 预警规则更新 Request VO
 */
@Data
@Schema(description = "预警规则更新 Request VO")
class AlertRuleUpdateReqVO {
    @Schema(description = "ID", required = true)
    private Long id;
    
    @Schema(description = "规则名称")
    private String ruleName;
    
    @Schema(description = "规则类型")
    private String ruleType;
    
    @Schema(description = "条件")
    private String condition;
    
    @Schema(description = "阈值")
    private BigDecimal threshold;
    
    @Schema(description = "是否启用")
    private Boolean enabled;
    
    @Schema(description = "通知方式")
    private String notifyType;
    
    @Schema(description = "通知配置")
    private String notifyConfig;
}

/**
 * 预警记录分页查询 Request VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "预警记录分页查询 Request VO")
class AlertRecordPageReqVO extends PageParam {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "预警类型")
    private String alertType;
    
    @Schema(description = "预警级别")
    private String alertLevel;
    
    @Schema(description = "状态")
    private String status;
}

/**
 * 预警记录 Response VO
 */
@Data
@Schema(description = "预警记录 Response VO")
class AlertRecordVO {
    @Schema(description = "ID")
    private Long id;
    
    @Schema(description = "规则ID")
    private Long ruleId;
    
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
    
    @Schema(description = "已读时间")
    private LocalDateTime readTime;
}

/**
 * 预警触发 Request VO
 */
@Data
@Schema(description = "预警触发 Request VO")
class AlertTriggerReqVO {
    @Schema(description = "租户ID", required = true)
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "规则ID")
    private Long ruleId;
    
    @Schema(description = "预警类型", required = true)
    private String alertType;
    
    @Schema(description = "预警级别", required = true)
    private String alertLevel;
    
    @Schema(description = "标题", required = true)
    private String title;
    
    @Schema(description = "内容", required = true)
    private String content;
}

/**
 * 预警统计 Response VO
 */
@Data
@Schema(description = "预警统计 Response VO")
class AlertStatVO {
    @Schema(description = "租户ID")
    private Long tenantId;
    
    @Schema(description = "店铺ID")
    private Long shopId;
    
    @Schema(description = "未读数量")
    private Integer unreadCount;
    
    @Schema(description = "总数量")
    private Integer totalCount;
    
    @Schema(description = "今日数量")
    private Integer todayCount;
    
    @Schema(description = "严重数量")
    private Integer criticalCount;
    
    @Schema(description = "警告数量")
    private Integer warningCount;
    
    @Schema(description = "信息数量")
    private Integer infoCount;
}
