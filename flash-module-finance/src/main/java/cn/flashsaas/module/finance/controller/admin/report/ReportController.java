package cn.flashsaas.module.finance.controller.admin.report;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.module.finance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

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

    // ==================== 管理员端报表API ====================

    @GetMapping("/overview")
    @Operation(summary = "获取报表总览数据")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getOverview(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "tenantId", required = false) Long tenantId,
            @RequestParam(value = "platformType", required = false) String platformType) {
        return success(reportService.getReportOverview(startDate, endDate, tenantId, platformType));
    }

    @GetMapping("/trend")
    @Operation(summary = "获取趋势数据")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getTrend(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "tenantId", required = false) Long tenantId,
            @RequestParam(value = "platformType", required = false) String platformType) {
        return success(reportService.getReportTrend(startDate, endDate, tenantId, platformType));
    }

    @GetMapping("/tenant-ranking")
    @Operation(summary = "获取租户排行榜")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<java.util.List<Map<String, Object>>> getTenantRanking(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "type", required = false, defaultValue = "revenue") String type,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit) {
        return success(reportService.getTenantRanking(startDate, endDate, type, limit));
    }

    @GetMapping("/platform-distribution")
    @Operation(summary = "获取平台分布数据")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<java.util.List<Map<String, Object>>> getPlatformDistribution(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "tenantId", required = false) Long tenantId) {
        return success(reportService.getPlatformDistribution(startDate, endDate, tenantId));
    }

    @GetMapping("/tenant/{tenantId}")
    @Operation(summary = "获取租户详细报表")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getTenantReport(
            @PathVariable("tenantId") Long tenantId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.getTenantReport(tenantId, startDate, endDate));
    }

    @GetMapping("/tenant/{tenantId}/shop-comparison")
    @Operation(summary = "获取店铺对比数据")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getShopComparison(
            @PathVariable("tenantId") Long tenantId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reportService.getShopComparison(tenantId, startDate, endDate));
    }

    @PostMapping("/export/create")
    @Operation(summary = "创建导出任务")
    @PreAuthorize("@ss.hasPermission('finance:report:export')")
    public CommonResult<Long> createExportTask(@RequestBody Map<String, Object> params) {
        return success(reportService.createExportTask(params));
    }

    @GetMapping("/export/history")
    @Operation(summary = "获取导出历史")
    @PreAuthorize("@ss.hasPermission('finance:report:query')")
    public CommonResult<Map<String, Object>> getExportHistory(
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(reportService.getExportHistory(pageNo, pageSize));
    }

    @GetMapping("/export/download/{id}")
    @Operation(summary = "下载导出文件")
    @PreAuthorize("@ss.hasPermission('finance:report:export')")
    public void downloadExportFile(@PathVariable("id") Long id, javax.servlet.http.HttpServletResponse response) throws Exception {
        reportService.downloadExportFile(id, response);
    }
