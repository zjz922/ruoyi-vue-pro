package cn.iocoder.yudao.module.finance.controller.admin.analysis;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.service.analysis.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 经营分析 Controller
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 经营分析")
@RestController
@RequestMapping("/finance/analysis")
@Validated
public class AnalysisController {

    @Resource
    private AnalysisService analysisService;

    // ==================== 运营仪表盘 ====================

    @GetMapping("/dashboard")
    @Operation(summary = "获取仪表盘数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getDashboard() {
        return success(analysisService.getDashboard());
    }

    @GetMapping("/dashboard/realtime")
    @Operation(summary = "获取实时数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getRealtimeData() {
        return success(analysisService.getRealtimeData());
    }

    @GetMapping("/dashboard/health-score")
    @Operation(summary = "获取健康度评分")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getHealthScore() {
        return success(analysisService.getHealthScore());
    }

    // ==================== 租户活跃度分析 ====================

    @GetMapping("/tenant/active")
    @Operation(summary = "获取租户活跃度数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getTenantActive(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getTenantActive(startDate, endDate));
    }

    @GetMapping("/tenant/retention")
    @Operation(summary = "获取留存分析数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getTenantRetention(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getTenantRetention(startDate, endDate));
    }

    @GetMapping("/tenant/distribution")
    @Operation(summary = "获取租户分布数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getTenantDistribution() {
        return success(analysisService.getTenantDistribution());
    }

    // ==================== 收入分析 ====================

    @GetMapping("/revenue/overview")
    @Operation(summary = "获取收入概览数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getRevenueOverview(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "granularity", required = false) String granularity) {
        return success(analysisService.getRevenueOverview(startDate, endDate, granularity));
    }

    @GetMapping("/revenue/trend")
    @Operation(summary = "获取收入趋势数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getRevenueTrend(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "granularity", required = false) String granularity) {
        return success(analysisService.getRevenueTrend(startDate, endDate, granularity));
    }

    @GetMapping("/revenue/composition")
    @Operation(summary = "获取收入构成数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getRevenueComposition(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getRevenueComposition(startDate, endDate));
    }

    @GetMapping("/revenue/arpu")
    @Operation(summary = "获取ARPU分析数据")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getArpuData(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getArpuData(startDate, endDate));
    }

    // ==================== 趋势分析 ====================

    @GetMapping("/trend/user-growth")
    @Operation(summary = "获取用户增长趋势")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getUserGrowthTrend(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "granularity", required = false) String granularity) {
        return success(analysisService.getUserGrowthTrend(startDate, endDate, granularity));
    }

    @GetMapping("/trend/data-volume")
    @Operation(summary = "获取数据量趋势")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getDataVolumeTrend(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "granularity", required = false) String granularity) {
        return success(analysisService.getDataVolumeTrend(startDate, endDate, granularity));
    }

    @GetMapping("/trend/usage")
    @Operation(summary = "获取使用趋势")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getUsageTrend(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getUsageTrend(startDate, endDate));
    }

    @GetMapping("/trend/forecast")
    @Operation(summary = "获取趋势预测")
    @PreAuthorize("@ss.hasPermission('finance:analysis:query')")
    public CommonResult<Map<String, Object>> getTrendForecast() {
        return success(analysisService.getTrendForecast());
    }
}
