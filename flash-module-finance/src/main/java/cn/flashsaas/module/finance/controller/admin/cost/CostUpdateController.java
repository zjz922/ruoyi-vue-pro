package cn.flashsaas.module.finance.controller.admin.cost;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.service.CostUpdateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 成本更新 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 成本更新")
@RestController
@RequestMapping("/finance/cost")
@Validated
@RequiredArgsConstructor
public class CostUpdateController {

    private final CostUpdateService costUpdateService;

    @PostMapping("/update")
    @Operation(summary = "更新商品成本")
    @PreAuthorize("@ss.hasPermission('finance:cost:update')")
    public CommonResult<Boolean> updateCost(
            @RequestParam("shopId") Long shopId,
            @RequestParam("skuCode") String skuCode,
            @RequestParam("purchaseCost") BigDecimal purchaseCost,
            @RequestParam(value = "logisticsCost", required = false) BigDecimal logisticsCost,
            @RequestParam(value = "packagingCost", required = false) BigDecimal packagingCost,
            @RequestParam(value = "otherCost", required = false) BigDecimal otherCost,
            @RequestParam(value = "effectiveDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate effectiveDate) {
        costUpdateService.updateCost(shopId, skuCode, purchaseCost, logisticsCost, packagingCost, otherCost, effectiveDate);
        return success(true);
    }

    @PostMapping("/batch-update")
    @Operation(summary = "批量更新商品成本")
    @PreAuthorize("@ss.hasPermission('finance:cost:update')")
    public CommonResult<Map<String, Object>> batchUpdateCost(
            @RequestParam("shopId") Long shopId,
            @RequestBody Map<String, Object> reqVO) {
        return success(costUpdateService.batchUpdateCost(shopId, reqVO));
    }

    @PostMapping("/import")
    @Operation(summary = "导入成本数据")
    @PreAuthorize("@ss.hasPermission('finance:cost:import')")
    public CommonResult<Map<String, Object>> importCost(
            @RequestParam("shopId") Long shopId,
            @RequestParam("file") MultipartFile file) {
        return success(costUpdateService.importCost(shopId, file));
    }

    @GetMapping("/export")
    @Operation(summary = "导出成本数据")
    @PreAuthorize("@ss.hasPermission('finance:cost:export')")
    public CommonResult<Map<String, Object>> exportCost(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "category", required = false) String category) {
        return success(costUpdateService.exportCost(shopId, category));
    }

    @GetMapping("/template/download")
    @Operation(summary = "下载导入模板")
    @PreAuthorize("@ss.hasPermission('finance:cost:query')")
    public CommonResult<Map<String, Object>> downloadTemplate() {
        return success(costUpdateService.downloadTemplate());
    }

    @GetMapping("/history/page")
    @Operation(summary = "获取成本变更历史分页列表")
    @PreAuthorize("@ss.hasPermission('finance:cost:query')")
    public CommonResult<PageResult<Map<String, Object>>> getCostHistoryPage(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "skuCode", required = false) String skuCode,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(costUpdateService.getCostHistoryPage(shopId, skuCode, startDate, endDate, pageNo, pageSize));
    }

    @PostMapping("/sync-from-jst")
    @Operation(summary = "从聚水潭同步成本")
    @PreAuthorize("@ss.hasPermission('finance:cost:sync')")
    public CommonResult<Map<String, Object>> syncCostFromJst(
            @RequestParam("shopId") Long shopId) {
        return success(costUpdateService.syncCostFromJst(shopId));
    }

    @GetMapping("/config")
    @Operation(summary = "获取成本配置")
    @PreAuthorize("@ss.hasPermission('finance:cost:query')")
    public CommonResult<Map<String, Object>> getCostConfig(
            @RequestParam("shopId") Long shopId) {
        return success(costUpdateService.getCostConfig(shopId));
    }

    @PostMapping("/config/save")
    @Operation(summary = "保存成本配置")
    @PreAuthorize("@ss.hasPermission('finance:cost:update')")
    public CommonResult<Boolean> saveCostConfig(@RequestBody Map<String, Object> reqVO) {
        costUpdateService.saveCostConfig(reqVO);
        return success(true);
    }

    @GetMapping("/stat")
    @Operation(summary = "获取成本统计")
    @PreAuthorize("@ss.hasPermission('finance:cost:query')")
    public CommonResult<Map<String, Object>> getCostStat(
            @RequestParam("shopId") Long shopId) {
        return success(costUpdateService.getCostStat(shopId));
    }

}
