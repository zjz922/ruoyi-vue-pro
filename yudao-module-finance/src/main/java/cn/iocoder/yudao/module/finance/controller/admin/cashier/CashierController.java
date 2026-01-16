package cn.iocoder.yudao.module.finance.controller.admin.cashier;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.service.CashierService;
import io.swagger.v3.oas.annotations.Operation;
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
 * 出纳管理 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 出纳管理")
@RestController
@RequestMapping("/finance/cashier")
@Validated
@RequiredArgsConstructor
public class CashierController {

    private final CashierService cashierService;

    @GetMapping("/dashboard")
    @Operation(summary = "获取出纳工作台数据")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getDashboard(
            @RequestParam("shopId") Long shopId) {
        return success(cashierService.getDashboard(shopId));
    }

    @GetMapping("/pending-tasks")
    @Operation(summary = "获取待办任务列表")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getPendingTasks(
            @RequestParam("shopId") Long shopId) {
        return success(cashierService.getPendingTasks(shopId));
    }

    @GetMapping("/channels")
    @Operation(summary = "获取渠道列表")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getChannels(
            @RequestParam("shopId") Long shopId) {
        return success(cashierService.getChannels(shopId));
    }

    @PostMapping("/channel/config")
    @Operation(summary = "配置渠道")
    @PreAuthorize("@ss.hasPermission('finance:cashier:update')")
    public CommonResult<Boolean> configChannel(@RequestBody Map<String, Object> reqVO) {
        cashierService.configChannel(reqVO);
        return success(true);
    }

    @PostMapping("/reconciliation/execute")
    @Operation(summary = "执行对账")
    @PreAuthorize("@ss.hasPermission('finance:cashier:reconciliation')")
    public CommonResult<Map<String, Object>> executeReconciliation(
            @RequestParam("shopId") Long shopId,
            @RequestParam("checkDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate checkDate,
            @RequestParam(value = "platform", defaultValue = "doudian") String platform) {
        return success(cashierService.executeReconciliation(shopId, checkDate, platform));
    }

    @GetMapping("/reconciliation/result")
    @Operation(summary = "获取对账结果")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getReconciliationResult(
            @RequestParam("shopId") Long shopId,
            @RequestParam("checkDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate checkDate) {
        return success(cashierService.getReconciliationResult(shopId, checkDate));
    }

    @GetMapping("/differences/page")
    @Operation(summary = "获取差异分页列表")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<PageResult<Map<String, Object>>> getDifferencePage(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(cashierService.getDifferencePage(shopId, startDate, endDate, status, pageNo, pageSize));
    }

    @PostMapping("/difference/handle")
    @Operation(summary = "处理差异")
    @PreAuthorize("@ss.hasPermission('finance:cashier:update')")
    public CommonResult<Boolean> handleDifference(
            @RequestParam("differenceId") Long differenceId,
            @RequestParam("handleType") String handleType,
            @RequestParam(value = "remark", required = false) String remark) {
        cashierService.handleDifference(differenceId, handleType, remark);
        return success(true);
    }

    @GetMapping("/report/daily")
    @Operation(summary = "获取日报表")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getDailyReport(
            @RequestParam("shopId") Long shopId,
            @RequestParam("reportDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate reportDate) {
        return success(cashierService.getDailyReport(shopId, reportDate));
    }

    @GetMapping("/report/monthly")
    @Operation(summary = "获取月报表")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getMonthlyReport(
            @RequestParam("shopId") Long shopId,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month) {
        return success(cashierService.getMonthlyReport(shopId, year, month));
    }

    @GetMapping("/shop-stat")
    @Operation(summary = "获取店铺统计")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getShopStat(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(cashierService.getShopStat(shopId, startDate, endDate));
    }

    @GetMapping("/alerts")
    @Operation(summary = "获取预警列表")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getAlerts(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "status", required = false) String status) {
        return success(cashierService.getAlerts(shopId, status));
    }

    @PostMapping("/alert-rule/config")
    @Operation(summary = "配置预警规则")
    @PreAuthorize("@ss.hasPermission('finance:cashier:update')")
    public CommonResult<Boolean> configAlertRule(@RequestBody Map<String, Object> reqVO) {
        cashierService.configAlertRule(reqVO);
        return success(true);
    }

    @GetMapping("/cashflow-summary")
    @Operation(summary = "获取资金流水汇总")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> getCashflowSummary(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(cashierService.getCashflowSummary(shopId, startDate, endDate));
    }

}
