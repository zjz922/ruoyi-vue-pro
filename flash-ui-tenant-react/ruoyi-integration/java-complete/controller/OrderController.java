package com.flash.module.finance.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.flash.framework.common.pojo.CommonResult;
import com.flash.framework.common.pojo.PageResult;
import com.flash.framework.common.util.object.BeanUtils;
import com.flash.module.finance.entity.OrderDO;
import com.flash.module.finance.service.OrderService;
import com.flash.module.finance.vo.OrderVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 订单 Controller
 */
@Slf4j
@Tag(name = "订单管理")
@RestController
@RequestMapping("/finance/order")
public class OrderController {

    @Resource
    private OrderService orderService;

    @Operation(summary = "分页查询订单列表")
    @GetMapping("/page")
    public CommonResult<PageResult<OrderVO>> getOrderPage(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String productTitle,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String orderStatus,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            Page<OrderDO> page = orderService.getOrderPage(tenantId, pageNo, pageSize,
                    orderNo, productTitle, province, orderStatus, startDate, endDate);
            return CommonResult.success(new PageResult<>(
                    BeanUtils.toBean(page.getRecords(), OrderVO.class),
                    page.getTotal()
            ));
        } catch (Exception e) {
            log.error("查询订单列表失败", e);
            return CommonResult.error("查询订单列表失败");
        }
    }

    @Operation(summary = "按日期范围查询订单")
    @GetMapping("/list")
    public CommonResult<List<OrderVO>> getOrdersByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            List<OrderDO> orders = orderService.getOrdersByDateRange(tenantId, startDate, endDate);
            return CommonResult.success(BeanUtils.toBean(orders, OrderVO.class));
        } catch (Exception e) {
            log.error("查询订单列表失败", e);
            return CommonResult.error("查询订单列表失败");
        }
    }

    @Operation(summary = "查询订单统计")
    @GetMapping("/count")
    public CommonResult<Integer> getOrderCount(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            Integer count = orderService.getOrderCount(tenantId, startDate, endDate);
            return CommonResult.success(count);
        } catch (Exception e) {
            log.error("查询订单统计失败", e);
            return CommonResult.error("查询订单统计失败");
        }
    }

    @Operation(summary = "按订单号查询订单")
    @GetMapping("/{orderNo}")
    public CommonResult<OrderVO> getByOrderNo(@PathVariable String orderNo) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            OrderDO order = orderService.getByOrderNo(tenantId, orderNo);
            return CommonResult.success(BeanUtils.toBean(order, OrderVO.class));
        } catch (Exception e) {
            log.error("查询订单失败", e);
            return CommonResult.error("查询订单失败");
        }
    }

    @Operation(summary = "创建订单")
    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody OrderVO orderVO) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            OrderDO order = BeanUtils.toBean(orderVO, OrderDO.class);
            Long orderId = orderService.createOrder(tenantId, order);
            return CommonResult.success(orderId);
        } catch (Exception e) {
            log.error("创建订单失败", e);
            return CommonResult.error("创建订单失败");
        }
    }

    @Operation(summary = "更新订单")
    @PutMapping("/{orderId}")
    public CommonResult<Boolean> updateOrder(
            @PathVariable Long orderId,
            @RequestBody OrderVO orderVO) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            OrderDO order = BeanUtils.toBean(orderVO, OrderDO.class);
            order.setId(orderId);
            Boolean result = orderService.updateOrder(tenantId, order);
            return CommonResult.success(result);
        } catch (Exception e) {
            log.error("更新订单失败", e);
            return CommonResult.error("更新订单失败");
        }
    }

    @Operation(summary = "删除订单")
    @DeleteMapping("/{orderId}")
    public CommonResult<Boolean> deleteOrder(@PathVariable Long orderId) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            Boolean result = orderService.deleteOrder(tenantId, orderId);
            return CommonResult.success(result);
        } catch (Exception e) {
            log.error("删除订单失败", e);
            return CommonResult.error("删除订单失败");
        }
    }

    @Operation(summary = "按省份统计订单")
    @GetMapping("/stats/province")
    public CommonResult<List<Map<String, Object>>> getOrderCountByProvince(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            List<Map<String, Object>> stats = orderService.getOrderCountByProvince(tenantId, startDate, endDate);
            return CommonResult.success(stats);
        } catch (Exception e) {
            log.error("查询订单统计失败", e);
            return CommonResult.error("查询订单统计失败");
        }
    }

    @Operation(summary = "批量导入订单")
    @PostMapping("/import")
    public CommonResult<Map<String, Object>> batchImportOrders(@RequestBody List<OrderVO> orderVOs) {
        try {
            // TODO: 获取当前租户ID
            Long tenantId = 1L;
            List<OrderDO> orders = BeanUtils.toBean(orderVOs, OrderDO.class);
            Map<String, Object> result = orderService.batchImportOrders(tenantId, orders);
            return CommonResult.success(result);
        } catch (Exception e) {
            log.error("批量导入订单失败", e);
            return CommonResult.error("批量导入订单失败");
        }
    }
}
