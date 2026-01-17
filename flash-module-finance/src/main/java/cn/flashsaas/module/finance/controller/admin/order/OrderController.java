package cn.flashsaas.module.finance.controller.admin.order;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.common.util.object.BeanUtils;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderCreateReqVO;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderPageReqVO;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderRespVO;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderUpdateReqVO;
import cn.flashsaas.module.finance.dal.dataobject.OrderDO;
import cn.flashsaas.module.finance.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 订单管理 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 订单管理")
@RestController
@RequestMapping("/finance/order")
@Validated
public class OrderController {

    @Resource
    private OrderService orderService;

    @PostMapping
    @Operation(summary = "创建订单")
    @PreAuthorize("@ss.hasPermission('finance:order:create')")
    public CommonResult<Long> createOrder(@Valid @RequestBody OrderCreateReqVO createReqVO) {
        return success(orderService.createOrder(createReqVO));
    }

    @PutMapping
    @Operation(summary = "更新订单")
    @PreAuthorize("@ss.hasPermission('finance:order:update')")
    public CommonResult<Boolean> updateOrder(@Valid @RequestBody OrderUpdateReqVO updateReqVO) {
        orderService.updateOrder(updateReqVO);
        return success(true);
    }

    @DeleteMapping
    @Operation(summary = "删除订单")
    @Parameter(name = "id", description = "订单ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:order:delete')")
    public CommonResult<Boolean> deleteOrder(@RequestParam("id") Long id) {
        orderService.deleteOrder(id);
        return success(true);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取订单")
    @Parameter(name = "id", description = "订单ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<OrderRespVO> getOrder(@PathVariable("id") Long id) {
        OrderDO order = orderService.getOrder(id);
        return success(BeanUtils.toBean(order, OrderRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获取订单分页")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<PageResult<OrderRespVO>> getOrderPage(@Valid OrderPageReqVO pageReqVO) {
        PageResult<OrderDO> pageResult = orderService.getOrderPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, OrderRespVO.class));
    }

}
