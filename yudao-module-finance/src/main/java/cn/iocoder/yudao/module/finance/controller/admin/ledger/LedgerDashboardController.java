package cn.iocoder.yudao.module.finance.controller.admin.ledger;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;
import cn.iocoder.yudao.module.finance.service.LedgerDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 总账管理 - 经营概览 Controller
 * 
 * 对应前端页面：Dashboard.tsx
 * API路径前缀：/api/ledger/dashboard
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 经营概览")
@RestController
@RequestMapping("/api/ledger/dashboard")
@Validated
@RequiredArgsConstructor
public class LedgerDashboardController {

    private final LedgerDashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(summary = "获取经营概览数据")
    public CommonResult<DashboardOverviewRespVO> getOverview(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "开始日期") @RequestParam(value = "start", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "end", required = false) String endDate) {
        return success(dashboardService.getOverview(shopId, startDate, endDate));
    }

    @GetMapping("/kpi")
    @Operation(summary = "获取KPI数据")
    public CommonResult<DashboardKpiRespVO> getKpi(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "开始日期") @RequestParam(value = "start", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "end", required = false) String endDate) {
        return success(dashboardService.getKpi(shopId, startDate, endDate));
    }

    @GetMapping("/trends")
    @Operation(summary = "获取趋势数据")
    public CommonResult<List<DashboardTrendItemVO>> getTrends(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "天数") @RequestParam(value = "days", defaultValue = "30") Integer days) {
        return success(dashboardService.getTrends(shopId, days));
    }

    @GetMapping("/expense-breakdown")
    @Operation(summary = "获取费用分布")
    public CommonResult<List<DashboardExpenseItemVO>> getExpenseBreakdown(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(dashboardService.getExpenseBreakdown(shopId, month));
    }
}
