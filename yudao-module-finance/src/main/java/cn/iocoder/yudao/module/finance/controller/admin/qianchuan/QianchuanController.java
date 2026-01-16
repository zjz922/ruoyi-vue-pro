package cn.iocoder.yudao.module.finance.controller.admin.qianchuan;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.service.QianchuanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 千川集成 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 千川集成")
@RestController
@RequestMapping("/finance/qianchuan")
@Validated
@RequiredArgsConstructor
public class QianchuanController {

    private final QianchuanService qianchuanService;

    @GetMapping("/auth/url")
    @Operation(summary = "获取千川授权URL")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:auth')")
    public CommonResult<Map<String, Object>> getAuthUrl(
            @RequestParam("tenantId") Long tenantId,
            @RequestParam(value = "redirectUrl", required = false) String redirectUrl) {
        return success(qianchuanService.getAuthUrl(tenantId, redirectUrl));
    }

    @GetMapping("/auth/callback")
    @Operation(summary = "千川授权回调")
    public CommonResult<Map<String, Object>> authCallback(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state) {
        return success(qianchuanService.handleCallback(code, state));
    }

    @GetMapping("/auth/status")
    @Operation(summary = "获取千川授权状态")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:query')")
    public CommonResult<Map<String, Object>> getAuthStatus(
            @RequestParam("shopId") Long shopId) {
        return success(qianchuanService.getAuthStatus(shopId));
    }

    @PostMapping("/config/save")
    @Operation(summary = "保存千川配置")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:update')")
    public CommonResult<Boolean> saveConfig(@RequestBody Map<String, Object> reqVO) {
        qianchuanService.saveConfig(reqVO);
        return success(true);
    }

    @PostMapping("/sync")
    @Operation(summary = "同步千川数据")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:sync')")
    public CommonResult<Map<String, Object>> syncData(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(qianchuanService.syncData(shopId, startDate, endDate));
    }

    @GetMapping("/promotion-cost")
    @Operation(summary = "获取推广费用")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:query')")
    public CommonResult<Map<String, Object>> getPromotionCost(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(qianchuanService.getPromotionCost(shopId, startDate, endDate));
    }

    @GetMapping("/promotion-stat")
    @Operation(summary = "获取推广统计")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:query')")
    public CommonResult<Map<String, Object>> getPromotionStat(
            @RequestParam("shopId") Long shopId,
            @RequestParam("statDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate statDate) {
        return success(qianchuanService.getPromotionStat(shopId, statDate));
    }

    @GetMapping("/plans")
    @Operation(summary = "获取推广计划列表")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:query')")
    public CommonResult<Map<String, Object>> getPlans(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "status", required = false) String status) {
        return success(qianchuanService.getPlans(shopId, status));
    }

    @GetMapping("/data/page")
    @Operation(summary = "获取推广数据分页列表")
    @PreAuthorize("@ss.hasPermission('finance:qianchuan:query')")
    public CommonResult<PageResult<Map<String, Object>>> getDataPage(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "planId", required = false) String planId,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(qianchuanService.getDataPage(shopId, startDate, endDate, planId, pageNo, pageSize));
    }

}
