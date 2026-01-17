package cn.flashsaas.module.finance.controller.admin.productcost.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品成本响应 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "商品成本响应")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostRespVO {

    @Schema(description = "商品成本ID")
    private Long id;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "商品ID")
    private String productId;

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "SKU ID")
    private String skuId;

    @Schema(description = "成本价")
    private BigDecimal cost;

    @Schema(description = "销售价")
    private BigDecimal salePrice;

    @Schema(description = "库存数量")
    private Integer stock;

    @Schema(description = "成本计算方法")
    private String costMethod;

    @Schema(description = "成本更新时间")
    private Long costUpdateTime;

    @Schema(description = "来源平台")
    private String platform;

    @Schema(description = "平台商品ID")
    private String platformProductId;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}
