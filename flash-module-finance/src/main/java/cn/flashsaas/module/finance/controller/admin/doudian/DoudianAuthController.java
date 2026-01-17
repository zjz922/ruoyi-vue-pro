package cn.flashsaas.module.finance.controller.admin.doudian;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.module.finance.service.DoudianAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 抖店授权管理 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 抖店授权管理")
@RestController
@RequestMapping("/finance/doudian/auth")
@Validated
@RequiredArgsConstructor
public class DoudianAuthController {

    private final DoudianAuthService doudianAuthService;

    @GetMapping("/url")
    @Operation(summary = "获取授权URL")
    @PreAuthorize("@ss.hasPermission('finance:doudian:auth')")
    public CommonResult<Map<String, Object>> getAuthUrl(
            @RequestParam("tenantId") Long tenantId,
            @RequestParam(value = "redirectUrl", required = false) String redirectUrl) {
        return success(doudianAuthService.getAuthUrl(tenantId, redirectUrl));
    }

    @GetMapping("/callback")
    @Operation(summary = "授权回调")
    public CommonResult<Map<String, Object>> callback(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state) {
        return success(doudianAuthService.handleCallback(code, state));
    }

    @GetMapping("/status")
    @Operation(summary = "获取授权状态")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getAuthStatus(
            @RequestParam("shopId") String shopId) {
        return success(doudianAuthService.getAuthStatus(shopId));
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新Token")
    @PreAuthorize("@ss.hasPermission('finance:doudian:auth')")
    public CommonResult<Map<String, Object>> refreshToken(
            @RequestParam("shopId") String shopId) {
        return success(doudianAuthService.refreshToken(shopId));
    }

    @DeleteMapping("/revoke")
    @Operation(summary = "撤销授权")
    @PreAuthorize("@ss.hasPermission('finance:doudian:auth')")
    public CommonResult<Boolean> revokeAuth(
            @RequestParam("shopId") String shopId) {
        doudianAuthService.revokeAuth(shopId);
        return success(true);
    }

    @GetMapping("/shops")
    @Operation(summary = "获取已授权店铺列表")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getAuthorizedShops(
            @RequestParam("tenantId") Long tenantId) {
        return success(doudianAuthService.getAuthorizedShops(tenantId));
    }

    @GetMapping("/shop/info")
    @Operation(summary = "获取店铺信息")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getShopInfo(
            @RequestParam("shopId") String shopId) {
        return success(doudianAuthService.getShopInfo(shopId));
    }

    @PostMapping("/shop/sync")
    @Operation(summary = "同步店铺信息")
    @PreAuthorize("@ss.hasPermission('finance:doudian:sync')")
    public CommonResult<Boolean> syncShopInfo(
            @RequestParam("shopId") String shopId) {
        doudianAuthService.syncShopInfo(shopId);
        return success(true);
    }

}
