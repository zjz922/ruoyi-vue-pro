package cn.iocoder.yudao.module.finance.controller.admin.order;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.*;
import cn.iocoder.yudao.module.finance.service.OrderReconciliationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 订单对账 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "订单对账")
@RestController
@RequestMapping("/finance/order/reconciliation")
@Validated
@RequiredArgsConstructor
public class OrderReconciliationController {

    private final OrderReconciliationService orderReconciliationService;

    @GetMapping("/overview")
    @Operation(summary = "获取订单对账概览")
    public CommonResult<OrderReconciliationOverviewRespVO> getOverview(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(orderReconciliationService.getOverview(shopId, startDate, endDate));
    }

    @PostMapping("/sync")
    @Operation(summary = "同步订单数据")
    public CommonResult<Map<String, Object>> syncOrders(@RequestBody OrderSyncReqVO reqVO) {
        return success(orderReconciliationService.syncOrders(reqVO));
    }

    @GetMapping("/compare")
    @Operation(summary = "订单对比分析")
    public CommonResult<OrderCompareRespVO> compareOrders(
            @RequestParam("shopId") String shopId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        return success(orderReconciliationService.compareOrders(shopId, startDate, endDate));
    }

    @GetMapping("/differences")
    @Operation(summary = "获取差异订单列表")
    public CommonResult<PageResult<OrderDifferenceVO>> getDifferences(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(orderReconciliationService.getDifferences(shopId, type, status, pageNum, pageSize));
    }

    @PostMapping("/resolve")
    @Operation(summary = "处理差异订单")
    public CommonResult<Map<String, Object>> resolveDifference(@RequestBody OrderResolveReqVO reqVO) {
        return success(orderReconciliationService.resolveDifference(reqVO));
    }

    @GetMapping("/monthly")
    @Operation(summary = "获取月度订单统计")
    public CommonResult<List<OrderMonthlyStatsVO>> getMonthlyStats(
            @RequestParam("shopId") String shopId,
            @RequestParam("year") Integer year) {
        return success(orderReconciliationService.getMonthlyStats(shopId, year));
    }

    @GetMapping("/yearly")
    @Operation(summary = "获取年度订单统计")
    public CommonResult<OrderYearlyStatsRespVO> getYearlyStats(
            @RequestParam("shopId") String shopId,
            @RequestParam("year") Integer year) {
        return success(orderReconciliationService.getYearlyStats(shopId, year));
    }

    @GetMapping("/daily")
    @Operation(summary = "获取日度订单统计")
    public CommonResult<List<OrderDailyStatsVO>> getDailyStats(
            @RequestParam("shopId") String shopId,
            @RequestParam("month") String month) {
        return success(orderReconciliationService.getDailyStats(shopId, month));
    }

    @PostMapping("/export")
    @Operation(summary = "导出订单对账报表")
    public CommonResult<Map<String, Object>> exportReconciliation(@RequestBody OrderExportReqVO reqVO) {
        return success(orderReconciliationService.exportReconciliation(reqVO));
    }

    @GetMapping("/sync-status")
    @Operation(summary = "获取同步状态")
    public CommonResult<OrderSyncStatusRespVO> getSyncStatus(@RequestParam("shopId") String shopId) {
        return success(orderReconciliationService.getSyncStatus(shopId));
    }
}
