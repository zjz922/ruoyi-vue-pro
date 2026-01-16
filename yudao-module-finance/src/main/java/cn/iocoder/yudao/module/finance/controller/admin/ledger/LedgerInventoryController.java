package cn.iocoder.yudao.module.finance.controller.admin.ledger;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;
import cn.iocoder.yudao.module.finance.service.LedgerInventoryService;
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
 * 总账管理 - 库存成本 Controller
 * 
 * 对应前端页面：Inventory.tsx
 * API路径前缀：/api/ledger/inventory
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 库存成本")
@RestController
@RequestMapping("/api/ledger/inventory")
@Validated
@RequiredArgsConstructor
public class LedgerInventoryController {

    private final LedgerInventoryService inventoryService;

    @GetMapping("/overview")
    @Operation(summary = "获取库存成本概览")
    public CommonResult<InventoryOverviewRespVO> getOverview(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(inventoryService.getOverview(shopId));
    }

    @GetMapping("/sku-cost")
    @Operation(summary = "获取SKU成本追踪")
    public CommonResult<PageResult<InventorySkuCostVO>> getSkuCost(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "关键词") @RequestParam(value = "keyword", required = false) String keyword,
            @Parameter(description = "成本趋势") @RequestParam(value = "costTrend", required = false) String costTrend,
            @Parameter(description = "页码") @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量") @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(inventoryService.getSkuCost(shopId, keyword, costTrend, pageNum, pageSize));
    }

    @PostMapping("/costing-config")
    @Operation(summary = "设置成本计价方式")
    public CommonResult<Map<String, Object>> setCostingConfig(@RequestBody InventoryCostingConfigReqVO reqVO) {
        return success(inventoryService.setCostingConfig(reqVO));
    }

    @PostMapping("/sync")
    @Operation(summary = "同步库存数据")
    public CommonResult<Map<String, Object>> syncInventory(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(inventoryService.syncInventory(shopId));
    }

    @GetMapping("/optimization")
    @Operation(summary = "获取周转优化建议")
    public CommonResult<InventoryOptimizationRespVO> getOptimization(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(inventoryService.getOptimization(shopId));
    }

    @PostMapping("/export")
    @Operation(summary = "导出库存报表")
    public CommonResult<Map<String, Object>> exportInventory(@RequestBody InventoryExportReqVO reqVO) {
        return success(inventoryService.exportInventory(reqVO));
    }

    @GetMapping("/cost-alerts")
    @Operation(summary = "获取成本波动预警")
    public CommonResult<List<InventoryCostAlertVO>> getCostAlerts(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(inventoryService.getCostAlerts(shopId));
    }

    @GetMapping("/costing-comparison")
    @Operation(summary = "获取成本计价对比")
    public CommonResult<InventoryCostingComparisonRespVO> getCostingComparison(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "SKU编码") @RequestParam(value = "skuCode", required = false) String skuCode) {
        return success(inventoryService.getCostingComparison(shopId, skuCode));
    }

    @GetMapping("/slow-moving")
    @Operation(summary = "获取滞销商品")
    public CommonResult<List<InventorySlowMovingVO>> getSlowMoving(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "天数阈值") @RequestParam(value = "days", defaultValue = "90") Integer days) {
        return success(inventoryService.getSlowMoving(shopId, days));
    }
}
