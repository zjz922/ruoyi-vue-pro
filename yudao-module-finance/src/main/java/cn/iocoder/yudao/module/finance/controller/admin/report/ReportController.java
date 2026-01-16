package cn.iocoder.yudao.module.finance.controller.admin.report;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 财务报表 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 财务报表")
@RestController
@RequestMapping("/finance/report")
@Validated
public class ReportController {

    @Resource
    private ReportService reportService;

    @GetMapping("/daily")
    @Operation(summary = "生成日报表")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> generateDailyReport(
            @RequestParam("shopId") Long shopId,
            @RequestParam("reportDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate reportDate) {
        return success(reportService.generateDailyReport(shopId, reportDate));
    }

    @GetMapping("/weekly")
    @Operation(summary = "生成周报表")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> generateWeeklyReport(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.generateWeeklyReport(shopId, startDate, endDate));
    }

    @GetMapping("/monthly")
    @Operation(summary = "生成月报表")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> generateMonthlyReport(
            @RequestParam("shopId") Long shopId,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month) {
        return success(reportService.generateMonthlyReport(shopId, year, month));
    }

    @GetMapping("/order-stats")
    @Operation(summary = "获取订单统计")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getOrderStats(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.getOrderStats(shopId, startDate, endDate));
    }

    @GetMapping("/income-expense-stats")
    @Operation(summary = "获取收支统计")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getIncomeExpenseStats(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.getIncomeExpenseStats(shopId, startDate, endDate));
    }

    @GetMapping("/product-cost-stats")
    @Operation(summary = "获取商品成本统计")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getProductCostStats(@RequestParam("shopId") Long shopId) {
        return success(reportService.getProductCostStats(shopId));
    }

    @GetMapping("/gross-profit-analysis")
    @Operation(summary = "获取毛利分析")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getGrossProfitAnalysis(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.getGrossProfitAnalysis(shopId, startDate, endDate));
    }

    @PostMapping("/export")
    @Operation(summary = "导出报表")
    @PreAuthorize("@ss.hasPermission('finance:report:export')")
    public CommonResult<String> exportReport(
            @RequestParam("shopId") Long shopId,
            @RequestParam("reportType") String reportType,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.exportReport(shopId, reportType, startDate, endDate));
    }

}
