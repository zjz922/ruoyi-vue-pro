package cn.iocoder.yudao.module.finance.controller.admin.reconciliation;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.reconciliation.vo.ReconciliationPageReqVO;
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

}
