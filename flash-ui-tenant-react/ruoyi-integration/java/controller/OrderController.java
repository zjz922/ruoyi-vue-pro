package cn.flashsaas.module.finance.controller.admin.order;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.excel.core.util.ExcelUtils;
import cn.flashsaas.framework.operatelog.core.annotations.OperateLog;
import cn.flashsaas.module.finance.controller.admin.order.vo.*;
import cn.flashsaas.module.finance.convert.order.OrderConvert;
import cn.flashsaas.module.finance.dal.dataobject.order.OrderDO;
import cn.flashsaas.module.finance.service.order.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;
import static cn.flashsaas.framework.operatelog.core.enums.OperateTypeEnum.EXPORT;

/**
 * 管理后台 - 订单
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 订单")
@RestController
@RequestMapping("/finance/order")
@Validated
public class OrderController {

    @Resource
    private OrderService orderService;

    @PostMapping("/create")
    @Operation(summary = "创建订单")
    @PreAuthorize("@ss.hasPermission('finance:order:create')")
    public CommonResult<Long> createOrder(@Valid @RequestBody OrderCreateReqVO createReqVO) {
        return success(orderService.createOrder(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新订单")
    @PreAuthorize("@ss.hasPermission('finance:order:update')")
    public CommonResult<Boolean> updateOrder(@Valid @RequestBody OrderUpdateReqVO updateReqVO) {
        orderService.updateOrder(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除订单")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:order:delete')")
    public CommonResult<Boolean> deleteOrder(@RequestParam("id") Long id) {
        orderService.deleteOrder(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得订单")
    @Parameter(name = "id", description = "编号", required = true, example = "1024")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<OrderRespVO> getOrder(@RequestParam("id") Long id) {
        OrderDO order = orderService.getOrder(id);
        return success(OrderConvert.INSTANCE.convert(order));
    }

    @GetMapping("/page")
    @Operation(summary = "获得订单分页")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<PageResult<OrderRespVO>> getOrderPage(@Valid OrderPageReqVO pageVO) {
        PageResult<OrderDO> pageResult = orderService.getOrderPage(pageVO);
        return success(OrderConvert.INSTANCE.convertPage(pageResult));
    }

    @GetMapping("/stats")
    @Operation(summary = "获得订单统计数据")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<OrderStatsRespVO> getOrderStats() {
        return success(orderService.getOrderStats());
    }

    @GetMapping("/export-excel")
    @Operation(summary = "导出订单 Excel")
    @PreAuthorize("@ss.hasPermission('finance:order:export')")
    @OperateLog(type = EXPORT)
    public void exportOrderExcel(@Valid OrderPageReqVO pageVO,
                                 HttpServletResponse response) throws IOException {
        pageVO.setPageSize(PageResult.PAGE_SIZE_NONE);
        List<OrderDO> list = orderService.getOrderPage(pageVO).getList();
        // 导出 Excel
        ExcelUtils.write(response, "订单.xls", "数据", OrderExcelVO.class,
                OrderConvert.INSTANCE.convertList02(list));
    }

    @PostMapping("/import")
    @Operation(summary = "导入订单")
    @PreAuthorize("@ss.hasPermission('finance:order:import')")
    public CommonResult<OrderImportRespVO> importOrders(
            @RequestParam("file") MultipartFile file) throws IOException {
        List<OrderImportReqVO> list = ExcelUtils.read(file, OrderImportReqVO.class);
        return success(orderService.importOrders(list));
    }

    @GetMapping("/provinces")
    @Operation(summary = "获得省份列表")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<List<String>> getProvinces() {
        return success(orderService.getProvinces());
    }

    @GetMapping("/statuses")
    @Operation(summary = "获得订单状态列表")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<List<String>> getStatuses() {
        return success(orderService.getStatuses());
    }

}
