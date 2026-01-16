package cn.iocoder.yudao.module.finance.controller.admin.productcost.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 商品成本更新请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "商品成本更新请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostUpdateReqVO {

    @Schema(description = "商品成本ID", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "商品成本ID不能为空")
    private Long id;

    @Schema(description = "成本价")
    private BigDecimal cost;

    @Schema(description = "销售价")
    private BigDecimal salePrice;

    @Schema(description = "库存数量")
    private Integer stock;

    @Schema(description = "成本计算方法")
    private String costMethod;

    @Schema(description = "备注")
    private String remark;

}
