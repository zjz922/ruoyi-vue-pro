package cn.flashsaas.module.finance.controller.admin.ledger;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;
import cn.flashsaas.module.finance.service.LedgerExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 总账管理 - 费用中心 Controller
 * 
 * 对应前端页面：Expense.tsx
 * API路径前缀：/api/ledger/expense
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 费用中心")
@RestController
@RequestMapping("/api/ledger/expense")
@Validated
@RequiredArgsConstructor
public class LedgerExpenseController {

    private final LedgerExpenseService expenseService;

    @GetMapping("/overview")
    @Operation(summary = "获取费用概览")
    public CommonResult<ExpenseOverviewRespVO> getOverview(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(expenseService.getOverview(shopId, month));
    }

    @GetMapping("/allocation")
    @Operation(summary = "获取多维度费用分摊")
    public CommonResult<ExpenseAllocationRespVO> getAllocation(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "维度") @RequestParam("dimension") String dimension,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(expenseService.getAllocation(shopId, dimension, month));
    }

    @PostMapping("/budget")
    @Operation(summary = "设置费用预算")
    public CommonResult<Map<String, Object>> setBudget(@RequestBody ExpenseBudgetReqVO reqVO) {
        return success(expenseService.setBudget(reqVO));
    }

    @PostMapping("/create")
    @Operation(summary = "录入费用")
    public CommonResult<Map<String, Object>> createExpense(@RequestBody ExpenseCreateReqVO reqVO) {
        return success(expenseService.createExpense(reqVO));
    }

    @GetMapping("/anomalies")
    @Operation(summary = "获取异常费用列表")
    public CommonResult<List<ExpenseAnomalyVO>> getAnomalies(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) String status) {
        return success(expenseService.getAnomalies(shopId, status));
    }

    @PostMapping("/confirm-anomaly")
    @Operation(summary = "确认异常费用")
    public CommonResult<Map<String, Object>> confirmAnomaly(@RequestBody ExpenseConfirmAnomalyReqVO reqVO) {
        return success(expenseService.confirmAnomaly(reqVO));
    }

    @PostMapping("/approve")
    @Operation(summary = "审批费用")
    public CommonResult<Map<String, Object>> approveExpense(@RequestBody ExpenseApproveReqVO reqVO) {
        return success(expenseService.approveExpense(reqVO));
    }

    @GetMapping("/details")
    @Operation(summary = "获取费用明细")
    public CommonResult<PageResult<ExpenseDetailVO>> getDetails(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "费用类别") @RequestParam(value = "category", required = false) String category,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) String status,
            @Parameter(description = "开始日期") @RequestParam(value = "startDate", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "endDate", required = false) String endDate,
            @Parameter(description = "页码") @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量") @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(expenseService.getDetails(shopId, category, status, startDate, endDate, pageNum, pageSize));
    }

    @PostMapping("/export")
    @Operation(summary = "导出费用报表")
    public CommonResult<Map<String, Object>> exportExpense(@RequestBody ExpenseExportReqVO reqVO) {
        return success(expenseService.exportExpense(reqVO));
    }

    @GetMapping("/budget-alerts")
    @Operation(summary = "获取预算预警")
    public CommonResult<List<ExpenseBudgetAlertVO>> getBudgetAlerts(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(expenseService.getBudgetAlerts(shopId));
    }

    @GetMapping("/budget-trend")
    @Operation(summary = "获取预算执行趋势")
    public CommonResult<List<ExpenseBudgetTrendVO>> getBudgetTrend(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(expenseService.getBudgetTrend(shopId, month));
    }
}
