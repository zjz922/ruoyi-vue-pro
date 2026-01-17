package cn.flashsaas.module.finance.controller.admin.order.vo;

import cn.flashsaas.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 订单分页请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "订单分页请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPageReqVO extends PageParam {

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "订单状态")
    private String status;

}
