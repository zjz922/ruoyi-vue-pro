package cn.iocoder.yudao.module.finance.controller.admin.reconciliation;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.reconciliation.vo.*;
import cn.iocoder.yudao.module.finance.service.ReconciliationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 对账管理 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 对账管理")
@RestController
@RequestMapping("/finance/reconciliation")
@Validated
public class ReconciliationController {

    @Resource
    private ReconciliationService reconciliationService;

    // ========== 原有接口 ==========

    @PostMapping("/auto")
    @Operation(summary = "执行自动对账")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:auto')")
    public CommonResult<Map<String, Object>> autoReconciliation(
            @RequestParam("shopId") Long shopId,
            @RequestParam("reconciliationDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate reconciliationDate) {
        return success(reconciliationService.autoReconciliation(shopId, reconciliationDate));
    }

    @PostMapping("/manual")
    @Operation(summary = "执行手动对账")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:manual')")
    public CommonResult<Map<String, Object>> manualReconciliation(
            @RequestParam("shopId") Long shopId,
            @RequestParam("platform") String platform,
            @RequestParam("reconciliationDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate reconciliationDate) {
        return success(reconciliationService.manualReconciliation(shopId, platform, reconciliationDate));
    }

    @GetMapping("/diff/page")
    @Operation(summary = "获取对账差异列表")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<PageResult<Map<String, Object>>> getDiffList(ReconciliationPageReqVO pageReqVO) {
        return success(reconciliationService.getDiffList(pageReqVO));
    }

    @PutMapping("/diff/{diffId}/process")
    @Operation(summary = "处理对账差异")
    @Parameter(name = "diffId", description = "差异ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:process')")
    public CommonResult<Boolean> processDiff(
            @PathVariable("diffId") Long diffId,
            @RequestParam("reason") String reason) {
        return success(reconciliationService.processDiff(diffId, reason));
    }

    @GetMapping("/stats")
    @Operation(summary = "获取对账统计")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<Map<String, Object>> getReconciliationStats(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(reconciliationService.getReconciliationStats(shopId, startDate, endDate));
    }

    @GetMapping("/detail")
    @Operation(summary = "获取对账详情")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<Map<String, Object>> getReconciliationDetail(
            @RequestParam("shopId") Long shopId,
            @RequestParam("platform") String platform,
            @RequestParam("reconciliationDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate reconciliationDate) {
        return success(reconciliationService.getReconciliationDetail(shopId, platform, reconciliationDate));
    }

    // ========== 新增接口 - 勾稽仪表盘 ==========

    @GetMapping("/dashboard")
    @Operation(summary = "获取勾稽仪表盘数据")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<ReconciliationDashboardRespVO> getDashboard(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "month", required = false) String month) {
        return success(reconciliationService.getDashboard(shopId, month));
    }

    @GetMapping("/orders")
    @Operation(summary = "获取订单勾稽列表")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<PageResult<ReconciliationOrderVO>> getOrders(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(reconciliationService.getOrders(shopId, status, startDate, endDate, pageNum, pageSize));
    }

    @GetMapping("/costs")
    @Operation(summary = "获取成本勾稽列表")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<PageResult<ReconciliationCostVO>> getCosts(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(reconciliationService.getCosts(shopId, status, pageNum, pageSize));
    }

    @GetMapping("/inventory")
    @Operation(summary = "获取库存勾稽列表")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<PageResult<ReconciliationInventoryVO>> getInventory(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(reconciliationService.getInventory(shopId, status, pageNum, pageSize));
    }

    @GetMapping("/promotion")
    @Operation(summary = "获取推广费用勾稽列表")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<PageResult<ReconciliationPromotionVO>> getPromotion(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(reconciliationService.getPromotion(shopId, status, pageNum, pageSize));
    }

    @GetMapping("/daily-stats")
    @Operation(summary = "获取日度勾稽统计")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<List<ReconciliationDailyStatsVO>> getDailyStats(
            @RequestParam("shopId") String shopId,
            @RequestParam("month") String month) {
        return success(reconciliationService.getDailyStats(shopId, month));
    }

    @PostMapping("/match")
    @Operation(summary = "执行勾稽匹配")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:auto')")
    public CommonResult<Map<String, Object>> executeMatch(@RequestBody ReconciliationMatchReqVO reqVO) {
        return success(reconciliationService.executeMatch(reqVO));
    }

    @PostMapping("/resolve")
    @Operation(summary = "处理勾稽差异")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:process')")
    public CommonResult<Map<String, Object>> resolveDifference(@RequestBody ReconciliationResolveReqVO reqVO) {
        return success(reconciliationService.resolveDifference(reqVO));
    }

    @GetMapping("/rules")
    @Operation(summary = "获取勾稽规则")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<List<ReconciliationRuleVO>> getRules(@RequestParam("shopId") String shopId) {
        return success(reconciliationService.getRules(shopId));
    }

    @PostMapping("/rules")
    @Operation(summary = "保存勾稽规则")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:auto')")
    public CommonResult<Map<String, Object>> saveRule(@RequestBody ReconciliationRuleVO reqVO) {
        return success(reconciliationService.saveRule(reqVO));
    }

    @PostMapping("/export")
    @Operation(summary = "导出勾稽报表")
    @PreAuthorize("@ss.hasPermission('finance:reconciliation:query')")
    public CommonResult<Map<String, Object>> exportReconciliation(@RequestBody ReconciliationExportReqVO reqVO) {
        return success(reconciliationService.exportReconciliation(reqVO));
    }
}
