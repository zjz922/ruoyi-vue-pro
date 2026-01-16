package cn.iocoder.yudao.module.finance.controller.admin.jst;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.service.JstService;
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
 * 聚水潭集成 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 聚水潭集成")
@RestController
@RequestMapping("/finance/jst")
@Validated
@RequiredArgsConstructor
public class JstController {

    private final JstService jstService;

    @PostMapping("/config/save")
    @Operation(summary = "保存聚水潭配置")
    @PreAuthorize("@ss.hasPermission('finance:jst:update')")
    public CommonResult<Boolean> saveConfig(@RequestBody Map<String, Object> reqVO) {
        jstService.saveConfig(reqVO);
        return success(true);
    }

    @GetMapping("/config")
    @Operation(summary = "获取聚水潭配置")
    @PreAuthorize("@ss.hasPermission('finance:jst:query')")
    public CommonResult<Map<String, Object>> getConfig(
            @RequestParam("shopId") Long shopId) {
        return success(jstService.getConfig(shopId));
    }

    @PostMapping("/connection/test")
    @Operation(summary = "测试聚水潭连接")
    @PreAuthorize("@ss.hasPermission('finance:jst:query')")
    public CommonResult<Map<String, Object>> testConnection(
            @RequestParam("shopId") Long shopId) {
        return success(jstService.testConnection(shopId));
    }

    @GetMapping("/connection/status")
    @Operation(summary = "获取聚水潭连接状态")
    @PreAuthorize("@ss.hasPermission('finance:jst:query')")
    public CommonResult<Map<String, Object>> getConnectionStatus(
            @RequestParam("shopId") Long shopId) {
        return success(jstService.getConnectionStatus(shopId));
    }

    @PostMapping("/inbound/sync")
    @Operation(summary = "同步入库单")
    @PreAuthorize("@ss.hasPermission('finance:jst:sync')")
    public CommonResult<Map<String, Object>> syncInboundOrders(
            @RequestParam("shopId") Long shopId,
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(jstService.syncInboundOrders(shopId, startDate, endDate));
    }

    @GetMapping("/inbound/page")
    @Operation(summary = "获取入库单分页列表")
    @PreAuthorize("@ss.hasPermission('finance:jst:query')")
    public CommonResult<PageResult<Map<String, Object>>> getInboundOrderPage(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(jstService.getInboundOrderPage(shopId, startDate, endDate, status, pageNo, pageSize));
    }

    @GetMapping("/inventory")
    @Operation(summary = "获取库存信息")
    @PreAuthorize("@ss.hasPermission('finance:jst:query')")
    public CommonResult<Map<String, Object>> getInventory(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "skuCode", required = false) String skuCode) {
        return success(jstService.getInventory(shopId, skuCode));
    }

    @PostMapping("/cost/batch-update")
    @Operation(summary = "批量更新成本")
    @PreAuthorize("@ss.hasPermission('finance:jst:update')")
    public CommonResult<Map<String, Object>> batchUpdateCost(
            @RequestParam("shopId") Long shopId) {
        return success(jstService.batchUpdateCost(shopId));
    }

    @GetMapping("/sync-log/page")
    @Operation(summary = "获取同步日志分页列表")
    @PreAuthorize("@ss.hasPermission('finance:jst:query')")
    public CommonResult<PageResult<Map<String, Object>>> getSyncLogPage(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "syncType", required = false) String syncType,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(jstService.getSyncLogPage(shopId, syncType, status, pageNo, pageSize));
    }

}
