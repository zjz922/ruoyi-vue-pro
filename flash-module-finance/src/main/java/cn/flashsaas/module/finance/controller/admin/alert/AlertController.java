package cn.flashsaas.module.finance.controller.admin.alert;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 预警管理 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 预警管理")
@RestController
@RequestMapping("/finance/alert")
@Validated
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // ==================== 预警规则管理 ====================

    @GetMapping("/rule/page")
    @Operation(summary = "获取预警规则分页列表")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<PageResult<Map<String, Object>>> getRulePage(
            @RequestParam(value = "shopId", required = false) Long shopId,
            @RequestParam(value = "ruleType", required = false) String ruleType,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(alertService.getRulePage(shopId, ruleType, status, pageNo, pageSize));
    }

    @GetMapping("/rule/{ruleId}")
    @Operation(summary = "获取预警规则详情")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<Map<String, Object>> getRuleDetail(
            @PathVariable("ruleId") Long ruleId) {
        return success(alertService.getRuleDetail(ruleId));
    }

    @PostMapping("/rule/create")
    @Operation(summary = "创建预警规则")
    @PreAuthorize("@ss.hasPermission('finance:alert:create')")
    public CommonResult<Long> createRule(@RequestBody Map<String, Object> reqVO) {
        return success(alertService.createRule(reqVO));
    }

    @PutMapping("/rule/update")
    @Operation(summary = "更新预警规则")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Boolean> updateRule(@RequestBody Map<String, Object> reqVO) {
        alertService.updateRule(reqVO);
        return success(true);
    }

    @DeleteMapping("/rule/{ruleId}")
    @Operation(summary = "删除预警规则")
    @PreAuthorize("@ss.hasPermission('finance:alert:delete')")
    public CommonResult<Boolean> deleteRule(
            @PathVariable("ruleId") Long ruleId) {
        alertService.deleteRule(ruleId);
        return success(true);
    }

    @PostMapping("/rule/{ruleId}/enable")
    @Operation(summary = "启用预警规则")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Boolean> enableRule(
            @PathVariable("ruleId") Long ruleId) {
        alertService.enableRule(ruleId);
        return success(true);
    }

    @PostMapping("/rule/{ruleId}/disable")
    @Operation(summary = "禁用预警规则")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Boolean> disableRule(
            @PathVariable("ruleId") Long ruleId) {
        alertService.disableRule(ruleId);
        return success(true);
    }

    // ==================== 预警记录管理 ====================

    @GetMapping("/record/page")
    @Operation(summary = "获取预警记录分页列表")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<PageResult<Map<String, Object>>> getRecordPage(
            @RequestParam(value = "shopId", required = false) Long shopId,
            @RequestParam(value = "alertType", required = false) String alertType,
            @RequestParam(value = "alertLevel", required = false) String alertLevel,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "startTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(value = "endTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(alertService.getRecordPage(shopId, alertType, alertLevel, status, startTime, endTime, pageNo, pageSize));
    }

    @GetMapping("/record/{recordId}")
    @Operation(summary = "获取预警记录详情")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<Map<String, Object>> getRecordDetail(
            @PathVariable("recordId") Long recordId) {
        return success(alertService.getRecordDetail(recordId));
    }

    @PostMapping("/record/{recordId}/handle")
    @Operation(summary = "处理预警")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Boolean> handleAlert(
            @PathVariable("recordId") Long recordId,
            @RequestParam("handleResult") String handleResult,
            @RequestParam(value = "handleRemark", required = false) String handleRemark) {
        alertService.handleAlert(recordId, handleResult, handleRemark);
        return success(true);
    }

    @PostMapping("/record/{recordId}/ignore")
    @Operation(summary = "忽略预警")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Boolean> ignoreAlert(
            @PathVariable("recordId") Long recordId,
            @RequestParam(value = "ignoreReason", required = false) String ignoreReason) {
        alertService.ignoreAlert(recordId, ignoreReason);
        return success(true);
    }

    @PostMapping("/record/batch-handle")
    @Operation(summary = "批量处理预警")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Map<String, Object>> batchHandleAlerts(@RequestBody Map<String, Object> reqVO) {
        return success(alertService.batchHandleAlerts(reqVO));
    }

    // ==================== 预警统计 ====================

    @GetMapping("/stat")
    @Operation(summary = "获取预警统计")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<Map<String, Object>> getAlertStat(
            @RequestParam(value = "shopId", required = false) Long shopId,
            @RequestParam(value = "days", defaultValue = "7") Integer days) {
        return success(alertService.getAlertStat(shopId, days));
    }

    @GetMapping("/unhandled-count")
    @Operation(summary = "获取未处理预警数量")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<Map<String, Object>> getUnhandledCount(
            @RequestParam(value = "shopId", required = false) Long shopId) {
        return success(alertService.getUnhandledCount(shopId));
    }

    // ==================== 预警通知配置 ====================

    @GetMapping("/notify-config")
    @Operation(summary = "获取预警通知配置")
    @PreAuthorize("@ss.hasPermission('finance:alert:query')")
    public CommonResult<Map<String, Object>> getNotifyConfig(
            @RequestParam("shopId") Long shopId) {
        return success(alertService.getNotifyConfig(shopId));
    }

    @PostMapping("/notify-config/save")
    @Operation(summary = "保存预警通知配置")
    @PreAuthorize("@ss.hasPermission('finance:alert:update')")
    public CommonResult<Boolean> saveNotifyConfig(@RequestBody Map<String, Object> reqVO) {
        alertService.saveNotifyConfig(reqVO);
        return success(true);
    }

}
