package cn.iocoder.yudao.module.finance.controller.admin.ledger;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;
import cn.iocoder.yudao.module.finance.service.LedgerAccountingService;
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
 * 总账管理 - 财务核算 Controller
 * 
 * 对应前端页面：Accounting.tsx
 * API路径前缀：/api/ledger/accounting
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 财务核算")
@RestController
@RequestMapping("/api/ledger/accounting")
@Validated
@RequiredArgsConstructor
public class LedgerAccountingController {

    private final LedgerAccountingService accountingService;

    @GetMapping("/report")
    @Operation(summary = "获取财务核算报表")
    public CommonResult<AccountingReportRespVO> getReport(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month,
            @Parameter(description = "报表类型") @RequestParam(value = "reportType", defaultValue = "income") String reportType) {
        return success(accountingService.getReport(shopId, month, reportType));
    }

    @GetMapping("/income-statement")
    @Operation(summary = "获取利润表")
    public CommonResult<List<IncomeStatementItemVO>> getIncomeStatement(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(accountingService.getIncomeStatement(shopId, month));
    }

    @GetMapping("/balance-sheet")
    @Operation(summary = "获取资产负债表")
    public CommonResult<BalanceSheetRespVO> getBalanceSheet(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(accountingService.getBalanceSheet(shopId, month));
    }

    @GetMapping("/cashflow-statement")
    @Operation(summary = "获取现金流量表")
    public CommonResult<List<CashFlowCategoryVO>> getCashFlowStatement(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(accountingService.getCashFlowStatement(shopId, month));
    }

    @PostMapping("/export")
    @Operation(summary = "导出财务报表")
    public CommonResult<Map<String, Object>> exportReport(@RequestBody AccountingExportReqVO reqVO) {
        return success(accountingService.exportReport(reqVO));
    }

    @GetMapping("/daily-report")
    @Operation(summary = "获取日报数据")
    public CommonResult<DailyReportRespVO> getDailyReport(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "日期") @RequestParam("date") String date) {
        return success(accountingService.getDailyReport(shopId, date));
    }

    @GetMapping("/revenue-by-type")
    @Operation(summary = "获取收入分类数据")
    public CommonResult<List<RevenueTypeItemVO>> getRevenueByType(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(accountingService.getRevenueByType(shopId, month));
    }

    @GetMapping("/refund-analysis")
    @Operation(summary = "获取退款分析数据")
    public CommonResult<RefundAnalysisRespVO> getRefundAnalysis(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "开始日期") @RequestParam(value = "startDate", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "endDate", required = false) String endDate) {
        return success(accountingService.getRefundAnalysis(shopId, startDate, endDate));
    }
}
