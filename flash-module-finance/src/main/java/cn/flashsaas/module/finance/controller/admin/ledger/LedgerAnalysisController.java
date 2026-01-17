package cn.flashsaas.module.finance.controller.admin.ledger;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;
import cn.flashsaas.module.finance.service.LedgerAnalysisService;
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
 * 总账管理 - 经营分析 Controller
 * 
 * 对应前端页面：Analysis.tsx
 * API路径前缀：/api/ledger/analysis
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 经营分析")
@RestController
@RequestMapping("/api/ledger/analysis")
@Validated
@RequiredArgsConstructor
public class LedgerAnalysisController {

    private final LedgerAnalysisService analysisService;

    @GetMapping("/roi")
    @Operation(summary = "获取ROI分析数据")
    public CommonResult<AnalysisRoiRespVO> getRoi(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "日期范围") @RequestParam(value = "dateRange", required = false) String dateRange,
            @Parameter(description = "开始日期") @RequestParam(value = "startDate", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getRoi(shopId, dateRange, startDate, endDate));
    }

    @GetMapping("/break-even")
    @Operation(summary = "获取盈亏平衡分析")
    public CommonResult<AnalysisBreakEvenRespVO> getBreakEven(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(analysisService.getBreakEven(shopId, month));
    }

    @GetMapping("/profit-contribution")
    @Operation(summary = "获取利润贡献分析")
    public CommonResult<List<AnalysisProfitContributionVO>> getProfitContribution(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "维度") @RequestParam(value = "dimension", defaultValue = "product") String dimension) {
        return success(analysisService.getProfitContribution(shopId, dimension));
    }

    @PostMapping("/export")
    @Operation(summary = "导出经营分析报告")
    public CommonResult<Map<String, Object>> exportAnalysis(@RequestBody AnalysisExportReqVO reqVO) {
        return success(analysisService.exportAnalysis(reqVO));
    }

    @GetMapping("/channel-roi")
    @Operation(summary = "获取渠道ROI分析")
    public CommonResult<List<AnalysisChannelRoiVO>> getChannelRoi(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "开始日期") @RequestParam(value = "startDate", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "endDate", required = false) String endDate) {
        return success(analysisService.getChannelRoi(shopId, startDate, endDate));
    }

    @GetMapping("/roi-trend")
    @Operation(summary = "获取ROI趋势")
    public CommonResult<List<AnalysisRoiTrendVO>> getRoiTrend(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "天数") @RequestParam(value = "days", defaultValue = "30") Integer days) {
        return success(analysisService.getRoiTrend(shopId, days));
    }

    @GetMapping("/cvp")
    @Operation(summary = "获取本量利分析")
    public CommonResult<AnalysisCvpRespVO> getCvp(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "月份") @RequestParam(value = "month", required = false) String month) {
        return success(analysisService.getCvp(shopId, month));
    }

    @GetMapping("/sensitivity")
    @Operation(summary = "获取敏感性分析")
    public CommonResult<AnalysisSensitivityRespVO> getSensitivity(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "变量") @RequestParam(value = "variable", defaultValue = "price") String variable) {
        return success(analysisService.getSensitivity(shopId, variable));
    }
}
