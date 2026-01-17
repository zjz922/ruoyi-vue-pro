package cn.flashsaas.module.finance.controller.admin.cost.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import com.alibaba.excel.annotation.ExcelProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import static cn.flashsaas.framework.common.util.date.DateUtils.FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND;

// ========== 创建请求 ==========
@Schema(description = "管理后台 - 商品成本创建 Request VO")
@Data
class ProductCostCreateReqVO {

    @Schema(description = "商品号", requiredMode = Schema.RequiredMode.REQUIRED, example = "3701234567890")
    @NotEmpty(message = "商品号不能为空")
    private String productId;

    @Schema(description = "SKU编码", example = "0")
    private String sku;

    @Schema(description = "商品标题", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "商品标题不能为空")
    private String title;

    @Schema(description = "商品成本价", requiredMode = Schema.RequiredMode.REQUIRED, example = "10.00")
    @NotNull(message = "商品成本价不能为空")
    private BigDecimal cost;

    @Schema(description = "商家编码")
    private String merchantCode;

    @Schema(description = "商品售价", example = "29.90")
    private BigDecimal price;

    @Schema(description = "自定义名称")
    private String customName;

    @Schema(description = "库存数量", example = "100")
    private Integer stock;

    @Schema(description = "状态：0有效，1删除", example = "0")
    private Integer status;

    @Schema(description = "最新生效时间")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND)
    private LocalDateTime effectiveDate;

    @Schema(description = "店铺名称", example = "滋栈官方旗舰店")
    private String shopName;

}

// ========== 更新请求 ==========
@Schema(description = "管理后台 - 商品成本更新 Request VO")
@Data
class ProductCostUpdateReqVO {

    @Schema(description = "主键ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "主键ID不能为空")
    private Long id;

    @Schema(description = "商品号", example = "3701234567890")
    private String productId;

    @Schema(description = "SKU编码", example = "0")
    private String sku;

    @Schema(description = "商品标题")
    private String title;

    @Schema(description = "商品成本价", example = "10.00")
    private BigDecimal cost;

    @Schema(description = "商家编码")
    private String merchantCode;

    @Schema(description = "商品售价", example = "29.90")
    private BigDecimal price;

    @Schema(description = "自定义名称")
    private String customName;

    @Schema(description = "库存数量", example = "100")
    private Integer stock;

    @Schema(description = "状态：0有效，1删除", example = "0")
    private Integer status;

    @Schema(description = "最新生效时间")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND)
    private LocalDateTime effectiveDate;

    @Schema(description = "店铺名称", example = "滋栈官方旗舰店")
    private String shopName;

    @Schema(description = "变更原因")
    private String reason;

}

// ========== 分页请求 ==========
@Schema(description = "管理后台 - 商品成本分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
class ProductCostPageReqVO extends PageParam {

    @Schema(description = "商品号", example = "3701234567890")
    private String productId;

    @Schema(description = "商品标题")
    private String title;

    @Schema(description = "SKU编码")
    private String sku;

    @Schema(description = "店铺名称", example = "滋栈官方旗舰店")
    private String shopName;

    @Schema(description = "状态：0有效，1删除", example = "0")
    private Integer status;

    @Schema(description = "创建时间")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND)
    private LocalDateTime[] createTime;

}

// ========== 响应 ==========
@Schema(description = "管理后台 - 商品成本 Response VO")
@Data
class ProductCostRespVO {

    @Schema(description = "主键ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Long id;

    @Schema(description = "商品号", requiredMode = Schema.RequiredMode.REQUIRED, example = "3701234567890")
    private String productId;

    @Schema(description = "SKU编码", example = "0")
    private String sku;

    @Schema(description = "商品标题", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "商品成本价", requiredMode = Schema.RequiredMode.REQUIRED, example = "10.00")
    private BigDecimal cost;

    @Schema(description = "商家编码")
    private String merchantCode;

    @Schema(description = "商品售价", example = "29.90")
    private BigDecimal price;

    @Schema(description = "自定义名称")
    private String customName;

    @Schema(description = "库存数量", example = "100")
    private Integer stock;

    @Schema(description = "状态：0有效，1删除", example = "0")
    private Integer status;

    @Schema(description = "最新生效时间")
    private LocalDateTime effectiveDate;

    @Schema(description = "店铺名称", example = "滋栈官方旗舰店")
    private String shopName;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}

// ========== 导入请求 ==========
@Schema(description = "管理后台 - 商品成本导入 Request VO")
@Data
class ProductCostImportReqVO {

    @ExcelProperty("商品号")
    private String productId;

    @ExcelProperty("SKU编码")
    private String sku;

    @ExcelProperty("商品标题")
    private String title;

    @ExcelProperty("商品成本价")
    private BigDecimal cost;

    @ExcelProperty("商家编码")
    private String merchantCode;

    @ExcelProperty("商品售价")
    private BigDecimal price;

    @ExcelProperty("自定义名称")
    private String customName;

    @ExcelProperty("库存数量")
    private Integer stock;

    @ExcelProperty("店铺名称")
    private String shopName;

}

// ========== 导入响应 ==========
@Schema(description = "管理后台 - 商品成本导入 Response VO")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ProductCostImportRespVO {

    @Schema(description = "新增数量", requiredMode = Schema.RequiredMode.REQUIRED, example = "10")
    private Integer createCount;

    @Schema(description = "更新数量", requiredMode = Schema.RequiredMode.REQUIRED, example = "5")
    private Integer updateCount;

    @Schema(description = "失败数量", requiredMode = Schema.RequiredMode.REQUIRED, example = "0")
    private Integer failCount;

    @Schema(description = "失败信息")
    private String failMsg;

}

// ========== Excel导出 ==========
@Data
class ProductCostExcelVO {

    @ExcelProperty("主键ID")
    private Long id;

    @ExcelProperty("商品号")
    private String productId;

    @ExcelProperty("SKU编码")
    private String sku;

    @ExcelProperty("商品标题")
    private String title;

    @ExcelProperty("商品成本价")
    private BigDecimal cost;

    @ExcelProperty("商家编码")
    private String merchantCode;

    @ExcelProperty("商品售价")
    private BigDecimal price;

    @ExcelProperty("自定义名称")
    private String customName;

    @ExcelProperty("库存数量")
    private Integer stock;

    @ExcelProperty("状态")
    private Integer status;

    @ExcelProperty("店铺名称")
    private String shopName;

    @ExcelProperty("创建时间")
    private LocalDateTime createTime;

}

// ========== 历史记录响应 ==========
@Schema(description = "管理后台 - 商品成本历史 Response VO")
@Data
class ProductCostHistoryRespVO {

    @Schema(description = "主键ID", example = "1")
    private Long id;

    @Schema(description = "商品成本ID", example = "1")
    private Long productCostId;

    @Schema(description = "商品号", example = "3701234567890")
    private String productId;

    @Schema(description = "旧成本价", example = "10.00")
    private BigDecimal oldCost;

    @Schema(description = "新成本价", example = "12.00")
    private BigDecimal newCost;

    @Schema(description = "变更原因")
    private String reason;

    @Schema(description = "操作人ID")
    private Long operatorId;

    @Schema(description = "操作人名称")
    private String operatorName;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

}
