package cn.iocoder.yudao.module.finance.controller.admin.sync;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.service.OrderSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 订单同步 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 订单同步")
@RestController
@RequestMapping("/finance/sync/order")
@Validated
@RequiredArgsConstructor
public class OrderSyncController {

    private final OrderSyncService orderSyncService;

    @PostMapping("/execute")
    @Operation(summary = "执行订单同步")
    @PreAuthorize("@ss.hasPermission('finance:sync:execute')")
    public CommonResult<Map<String, Object>> syncOrders(
            @RequestParam("shopId") String shopId,
            @RequestParam("startTime") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam("endTime") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        return success(orderSyncService.syncOrders(shopId, startTime, endTime));
    }

    @GetMapping("/status")
    @Operation(summary = "获取同步状态")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<Map<String, Object>> getSyncStatus(
            @RequestParam("shopId") String shopId) {
        return success(orderSyncService.getSyncStatus(shopId));
    }

    @GetMapping("/log/page")
    @Operation(summary = "获取同步日志分页列表")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<PageResult<Map<String, Object>>> getSyncLogPage(
            @RequestParam(value = "shopId", required = false) String shopId,
            @RequestParam(value = "syncType", required = false) String syncType,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "startTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(value = "endTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(orderSyncService.getSyncLogPage(shopId, syncType, status, startTime, endTime, pageNo, pageSize));
    }

    @GetMapping("/log/{logId}")
    @Operation(summary = "获取同步日志详情")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<Map<String, Object>> getSyncLogDetail(
            @PathVariable("logId") Long logId) {
        return success(orderSyncService.getSyncLogDetail(logId));
    }

    @PostMapping("/retry/{logId}")
    @Operation(summary = "重试同步")
    @PreAuthorize("@ss.hasPermission('finance:sync:execute')")
    public CommonResult<Map<String, Object>> retrySyncTask(
            @PathVariable("logId") Long logId) {
        return success(orderSyncService.retrySyncTask(logId));
    }

    @PostMapping("/auto-sync/enable")
    @Operation(summary = "启用自动同步")
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> enableAutoSync(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "intervalMinutes", defaultValue = "30") Integer intervalMinutes) {
        orderSyncService.enableAutoSync(shopId, intervalMinutes);
        return success(true);
    }

    @PostMapping("/auto-sync/disable")
    @Operation(summary = "禁用自动同步")
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> disableAutoSync(
            @RequestParam("shopId") String shopId) {
        orderSyncService.disableAutoSync(shopId);
        return success(true);
    }

    @GetMapping("/auto-sync/config")
    @Operation(summary = "获取自动同步配置")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<Map<String, Object>> getAutoSyncConfig(
            @RequestParam("shopId") String shopId) {
        return success(orderSyncService.getAutoSyncConfig(shopId));
    }

    @GetMapping("/stat")
    @Operation(summary = "获取同步统计")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<Map<String, Object>> getSyncStat(
            @RequestParam("shopId") String shopId,
            @RequestParam(value = "days", defaultValue = "7") Integer days) {
        return success(orderSyncService.getSyncStat(shopId, days));
    }

}
