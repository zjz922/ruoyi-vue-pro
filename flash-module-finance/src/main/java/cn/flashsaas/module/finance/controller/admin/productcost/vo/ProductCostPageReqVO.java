package cn.flashsaas.module.finance.controller.admin.productcost.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 商品成本分页请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "商品成本分页请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostPageReqVO extends PageParam {

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "商品ID")
    private String productId;

    @Schema(description = "商品名称")
    private String productName;

}
