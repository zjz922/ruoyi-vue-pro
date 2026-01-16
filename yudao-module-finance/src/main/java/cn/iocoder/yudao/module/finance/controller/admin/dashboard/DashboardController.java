package cn.iocoder.yudao.module.finance.controller.admin.dashboard;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 经营概览 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 经营概览")
@RestController
@RequestMapping("/finance/dashboard")
@Validated
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(summary = "获取经营概览")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getOverview(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(dashboardService.getOverview(shopId, startDate, endDate));
    }

    @GetMapping("/sales-trend")
    @Operation(summary = "获取销售趋势")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getSalesTrend(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "dimension", defaultValue = "day") String dimension) {
        return success(dashboardService.getSalesTrend(shopId, startDate, endDate, dimension));
    }

    @GetMapping("/product-rank")
    @Operation(summary = "获取商品排行")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getProductRank(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "rankBy", defaultValue = "sales") String rankBy,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit) {
        return success(dashboardService.getProductRank(shopId, startDate, endDate, rankBy, limit));
    }

    @GetMapping("/order-status-stat")
    @Operation(summary = "获取订单状态统计")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getOrderStatusStat(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(dashboardService.getOrderStatusStat(shopId, startDate, endDate));
    }

    @GetMapping("/fund-overview")
    @Operation(summary = "获取资金概览")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getFundOverview(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(dashboardService.getFundOverview(shopId, startDate, endDate));
    }

    @GetMapping("/profit-analysis")
    @Operation(summary = "获取利润分析")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getProfitAnalysis(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(dashboardService.getProfitAnalysis(shopId, startDate, endDate));
    }

    @GetMapping("/realtime")
    @Operation(summary = "获取实时数据")
    @PreAuthorize("@ss.hasPermission('finance:dashboard:query')")
    public CommonResult<Map<String, Object>> getRealtimeData(
            @RequestParam("shopId") Long shopId) {
        return success(dashboardService.getRealtimeData(shopId));
    }

}
