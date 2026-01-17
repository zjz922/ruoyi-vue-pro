package cn.flashsaas.module.finance.controller.admin.ledger;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;
import cn.flashsaas.module.finance.service.LedgerTaxService;
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
 * 总账管理 - 税务管理 Controller
 * 
 * 对应前端页面：Tax.tsx
 * API路径前缀：/api/ledger/tax
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 税务管理")
@RestController
@RequestMapping("/api/ledger/tax")
@Validated
@RequiredArgsConstructor
public class LedgerTaxController {

    private final LedgerTaxService taxService;

    @GetMapping("/overview")
    @Operation(summary = "获取税务概览")
    public CommonResult<TaxOverviewRespVO> getOverview(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(taxService.getOverview(shopId, month));
    }

    @GetMapping("/risks")
    @Operation(summary = "获取风险预警列表")
    public CommonResult<List<TaxRiskVO>> getRisks(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) String status) {
        return success(taxService.getRisks(shopId, status));
    }

    @GetMapping("/declarations")
    @Operation(summary = "获取申报日历")
    public CommonResult<List<TaxDeclarationVO>> getDeclarations(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "年份") @RequestParam(value = "year", required = false) Integer year) {
        return success(taxService.getDeclarations(shopId, year));
    }

    @PostMapping("/alert-config")
    @Operation(summary = "设置税务预警规则")
    public CommonResult<Map<String, Object>> setAlertConfig(@RequestBody TaxAlertConfigReqVO reqVO) {
        return success(taxService.setAlertConfig(reqVO));
    }

    @PostMapping("/ignore-risk")
    @Operation(summary = "忽略风险预警")
    public CommonResult<Map<String, Object>> ignoreRisk(@RequestBody TaxIgnoreRiskReqVO reqVO) {
        return success(taxService.ignoreRisk(reqVO));
    }

    @GetMapping("/invoice-stats")
    @Operation(summary = "获取发票统计")
    public CommonResult<TaxInvoiceStatsRespVO> getInvoiceStats(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(taxService.getInvoiceStats(shopId, month));
    }

    @PostMapping("/report")
    @Operation(summary = "生成税务报表")
    public CommonResult<Map<String, Object>> generateReport(@RequestBody TaxReportReqVO reqVO) {
        return success(taxService.generateReport(reqVO));
    }

    @GetMapping("/burden-trend")
    @Operation(summary = "获取税负率趋势")
    public CommonResult<List<TaxBurdenTrendVO>> getBurdenTrend(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月数") @RequestParam(value = "months", defaultValue = "12") Integer months) {
        return success(taxService.getBurdenTrend(shopId, months));
    }

    @GetMapping("/deduction-items")
    @Operation(summary = "获取可抵扣项目")
    public CommonResult<List<TaxDeductionItemVO>> getDeductionItems(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(taxService.getDeductionItems(shopId, month));
    }
}
