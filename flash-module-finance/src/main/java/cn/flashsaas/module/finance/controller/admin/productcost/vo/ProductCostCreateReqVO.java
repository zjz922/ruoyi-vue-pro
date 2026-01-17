package cn.flashsaas.module.finance.controller.admin.productcost.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 商品成本创建请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "商品成本创建请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostCreateReqVO {

    @Schema(description = "店铺ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;

    @Schema(description = "商品ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "商品ID不能为空")
    private String productId;

    @Schema(description = "商品名称", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "商品名称不能为空")
    private String productName;

    @Schema(description = "SKU ID")
    private String skuId;

    @Schema(description = "成本价", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "成本价不能为空")
    private BigDecimal cost;

    @Schema(description = "销售价")
    private BigDecimal salePrice;

    @Schema(description = "库存数量")
    private Integer stock;

    @Schema(description = "成本计算方法")
    private String costMethod;

    @Schema(description = "来源平台")
    private String platform;

    @Schema(description = "平台商品ID")
    private String platformProductId;

    @Schema(description = "备注")
    private String remark;

}
