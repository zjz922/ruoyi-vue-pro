package cn.flashsaas.module.finance.controller.admin.ledger;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.service.LedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 总账管理 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理")
@RestController
@RequestMapping("/finance/ledger")
@Validated
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    @GetMapping("/accounting")
    @Operation(summary = "获取会计核算数据")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getAccounting(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(ledgerService.getAccounting(shopId, startDate, endDate));
    }

    @GetMapping("/funds-flow")
    @Operation(summary = "获取资金流向")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getFundsFlow(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(ledgerService.getFundsFlow(shopId, startDate, endDate));
    }

    @GetMapping("/inventory-cost")
    @Operation(summary = "获取库存成本")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getInventoryCost(
            @RequestParam("shopId") Long shopId) {
        return success(ledgerService.getInventoryCost(shopId));
    }

    @GetMapping("/sales-analysis")
    @Operation(summary = "获取销售分析")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getSalesAnalysis(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "dimension", defaultValue = "product") String dimension) {
        return success(ledgerService.getSalesAnalysis(shopId, startDate, endDate, dimension));
    }

    @GetMapping("/expense-stat")
    @Operation(summary = "获取费用统计")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getExpenseStat(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(ledgerService.getExpenseStat(shopId, startDate, endDate));
    }

    @GetMapping("/tax-stat")
    @Operation(summary = "获取税务统计")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getTaxStat(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(ledgerService.getTaxStat(shopId, startDate, endDate));
    }

    @GetMapping("/account-balance")
    @Operation(summary = "获取科目余额")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getAccountBalance(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(ledgerService.getAccountBalance(shopId, startDate, endDate));
    }

    @GetMapping("/profit-statement")
    @Operation(summary = "获取利润表")
    @PreAuthorize("@ss.hasPermission('finance:ledger:query')")
    public CommonResult<Map<String, Object>> getProfitStatement(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(ledgerService.getProfitStatement(shopId, startDate, endDate));
    }

}
