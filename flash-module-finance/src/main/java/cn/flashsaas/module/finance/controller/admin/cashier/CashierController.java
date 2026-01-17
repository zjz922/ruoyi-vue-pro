package cn.flashsaas.module.finance.controller.admin.cashier;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.cashier.vo.*;
import cn.flashsaas.module.finance.service.CashierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

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

    // ========== 原有接口 ==========

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

    // ========== 新增接口 - 租户端API ==========

    @GetMapping("/v2/dashboard")
    @Operation(summary = "获取出纳仪表盘数据V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<CashierDashboardRespVO> getDashboardV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "date", required = false) String date) {
        return success(cashierService.getDashboardV2(shopId, date));
    }

    @GetMapping("/v2/overview")
    @Operation(summary = "获取出纳概览V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<CashierOverviewRespVO> getOverviewV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "month", required = false) String month) {
        return success(cashierService.getOverviewV2(shopId, month));
    }

    @GetMapping("/v2/daily-report")
    @Operation(summary = "获取日报数据V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<CashierDailyReportRespVO> getDailyReportV2(
            @RequestParam("shopId") String shopId,
            @RequestParam("date") String date) {
        return success(cashierService.getDailyReportV2(shopId, date));
    }

    @GetMapping("/v2/monthly-report")
    @Operation(summary = "获取月报数据V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<CashierMonthlyReportRespVO> getMonthlyReportV2(
            @RequestParam("shopId") String shopId,
            @RequestParam("month") String month) {
        return success(cashierService.getMonthlyReportV2(shopId, month));
    }

    @GetMapping("/v2/shop-report")
    @Operation(summary = "获取店铺报表V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<CashierShopReportRespVO> getShopReportV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(cashierService.getShopReportV2(shopId, startDate, endDate));
    }

    @GetMapping("/v2/reconciliation")
    @Operation(summary = "获取银行对账列表V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<PageResult<CashierReconciliationVO>> getReconciliationListV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(cashierService.getReconciliationListV2(shopId, status, startDate, endDate, pageNum, pageSize));
    }

    @PostMapping("/v2/reconciliation/match")
    @Operation(summary = "执行银行对账匹配V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:reconciliation')")
    public CommonResult<Map<String, Object>> executeReconciliationMatchV2(@RequestBody CashierReconciliationMatchReqVO reqVO) {
        return success(cashierService.executeReconciliationMatchV2(reqVO));
    }

    @PostMapping("/v2/reconciliation/resolve")
    @Operation(summary = "处理银行对账差异V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:reconciliation')")
    public CommonResult<Map<String, Object>> resolveReconciliationV2(@RequestBody CashierReconciliationResolveReqVO reqVO) {
        return success(cashierService.resolveReconciliationV2(reqVO));
    }

    @GetMapping("/v2/differences")
    @Operation(summary = "获取差异分析数据V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<CashierDifferencesRespVO> getDifferencesV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "month", required = false) String month) {
        return success(cashierService.getDifferencesV2(shopId, month));
    }

    @GetMapping("/v2/difference-trend")
    @Operation(summary = "获取差异趋势V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<List<CashierDifferenceTrendVO>> getDifferenceTrendV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "months", defaultValue = "6") Integer months) {
        return success(cashierService.getDifferenceTrendV2(shopId, months));
    }

    @GetMapping("/v2/alerts")
    @Operation(summary = "获取预警列表V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<PageResult<CashierAlertVO>> getAlertsV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "level", required = false) String level,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(cashierService.getAlertsV2(shopId, status, level, pageNum, pageSize));
    }

    @PostMapping("/v2/alerts/process")
    @Operation(summary = "处理预警V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:alert')")
    public CommonResult<Map<String, Object>> processAlertV2(@RequestBody CashierAlertProcessReqVO reqVO) {
        return success(cashierService.processAlertV2(reqVO));
    }

    @PostMapping("/v2/alerts/mark-read")
    @Operation(summary = "标记预警已读V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:alert')")
    public CommonResult<Map<String, Object>> markAlertReadV2(@RequestBody CashierAlertMarkReadReqVO reqVO) {
        return success(cashierService.markAlertReadV2(reqVO));
    }

    @GetMapping("/v2/alert-rules")
    @Operation(summary = "获取预警规则列表V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<List<CashierAlertRuleVO>> getAlertRulesV2(@RequestParam("shopId") String shopId) {
        return success(cashierService.getAlertRulesV2(shopId));
    }

    @PostMapping("/v2/alert-rules")
    @Operation(summary = "创建预警规则V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:alert')")
    public CommonResult<Map<String, Object>> createAlertRuleV2(@RequestBody CashierAlertRuleCreateReqVO reqVO) {
        return success(cashierService.createAlertRuleV2(reqVO));
    }

    @PutMapping("/v2/alert-rules/{id}")
    @Operation(summary = "更新预警规则V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:alert')")
    public CommonResult<Map<String, Object>> updateAlertRuleV2(
            @PathVariable("id") Long id,
            @RequestBody CashierAlertRuleUpdateReqVO reqVO) {
        return success(cashierService.updateAlertRuleV2(id, reqVO));
    }

    @DeleteMapping("/v2/alert-rules/{id}")
    @Operation(summary = "删除预警规则V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:alert')")
    public CommonResult<Map<String, Object>> deleteAlertRuleV2(@PathVariable("id") Long id) {
        return success(cashierService.deleteAlertRuleV2(id));
    }

    @GetMapping("/v2/channels")
    @Operation(summary = "获取渠道列表V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<List<CashierChannelVO>> getChannelsV2(@RequestParam("shopId") String shopId) {
        return success(cashierService.getChannelsV2(shopId));
    }

    @PostMapping("/v2/channels")
    @Operation(summary = "创建渠道V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:channel')")
    public CommonResult<Map<String, Object>> createChannelV2(@RequestBody CashierChannelCreateReqVO reqVO) {
        return success(cashierService.createChannelV2(reqVO));
    }

    @PutMapping("/v2/channels/{id}")
    @Operation(summary = "更新渠道V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:channel')")
    public CommonResult<Map<String, Object>> updateChannelV2(
            @PathVariable("id") Long id,
            @RequestBody CashierChannelUpdateReqVO reqVO) {
        return success(cashierService.updateChannelV2(id, reqVO));
    }

    @DeleteMapping("/v2/channels/{id}")
    @Operation(summary = "删除渠道V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:channel')")
    public CommonResult<Map<String, Object>> deleteChannelV2(@PathVariable("id") Long id) {
        return success(cashierService.deleteChannelV2(id));
    }

    @GetMapping("/v2/channel-stats")
    @Operation(summary = "获取渠道统计V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<List<CashierChannelStatsVO>> getChannelStatsV2(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "month", required = false) String month) {
        return success(cashierService.getChannelStatsV2(shopId, month));
    }

    @PostMapping("/v2/export")
    @Operation(summary = "导出出纳报表V2")
    @PreAuthorize("@ss.hasPermission('finance:cashier:query')")
    public CommonResult<Map<String, Object>> exportReportV2(@RequestBody CashierExportReqVO reqVO) {
        return success(cashierService.exportReportV2(reqVO));
    }
}
