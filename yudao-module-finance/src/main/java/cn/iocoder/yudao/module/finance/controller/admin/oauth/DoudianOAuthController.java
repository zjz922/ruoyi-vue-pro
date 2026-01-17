package cn.iocoder.yudao.module.finance.controller.admin.oauth;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.controller.admin.oauth.vo.*;
import cn.iocoder.yudao.module.finance.service.oauth.DoudianOAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 抖店OAuth授权 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 抖店OAuth授权")
@RestController
@RequestMapping("/finance/oauth/doudian")
@Validated
@Slf4j
public class DoudianOAuthController {

    @Resource
    private DoudianOAuthService doudianOAuthService;

    @GetMapping("/authorize-url")
    @Operation(summary = "获取抖店授权URL")
    @Parameter(name = "tenantId", description = "租户ID", required = true)
    public CommonResult<DoudianAuthUrlRespVO> getAuthorizeUrl(@RequestParam("tenantId") Long tenantId) {
        String authorizeUrl = doudianOAuthService.getAuthorizeUrl(tenantId);
        DoudianAuthUrlRespVO respVO = new DoudianAuthUrlRespVO();
        respVO.setAuthorizeUrl(authorizeUrl);
        return success(respVO);
    }

    @GetMapping("/callback")
    @Operation(summary = "抖店OAuth授权回调")
    public void callback(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String errorDescription,
            HttpServletResponse response) throws IOException {
        
        log.info("[callback] 收到抖店授权回调: code={}, state={}, error={}", code, state, error);
        
        if (error != null) {
            // 授权失败，重定向到错误页面
            log.error("[callback] 抖店授权失败: error={}, description={}", error, errorDescription);
            response.sendRedirect("/finance/oauth/result?success=false&message=" + errorDescription);
            return;
        }
        
        try {
            // 使用授权码换取Access Token
            doudianOAuthService.handleCallback(code, state);
            // 授权成功，重定向到成功页面
            response.sendRedirect("/finance/oauth/result?success=true");
        } catch (Exception e) {
            log.error("[callback] 处理抖店授权回调失败: {}", e.getMessage(), e);
            response.sendRedirect("/finance/oauth/result?success=false&message=" + e.getMessage());
        }
    }

    @PostMapping("/exchange-token")
    @Operation(summary = "使用授权码换取Access Token")
    public CommonResult<DoudianTokenRespVO> exchangeToken(@RequestBody @Validated DoudianExchangeTokenReqVO reqVO) {
        DoudianTokenRespVO tokenRespVO = doudianOAuthService.exchangeToken(reqVO.getCode(), reqVO.getTenantId());
        return success(tokenRespVO);
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "刷新Access Token")
    public CommonResult<DoudianTokenRespVO> refreshToken(@RequestBody @Validated DoudianRefreshTokenReqVO reqVO) {
        DoudianTokenRespVO tokenRespVO = doudianOAuthService.refreshToken(reqVO.getTenantId(), reqVO.getShopId());
        return success(tokenRespVO);
    }

    @GetMapping("/status")
    @Operation(summary = "获取授权状态")
    @Parameter(name = "tenantId", description = "租户ID", required = true)
    public CommonResult<DoudianAuthStatusRespVO> getAuthStatus(@RequestParam("tenantId") Long tenantId) {
        DoudianAuthStatusRespVO statusRespVO = doudianOAuthService.getAuthStatus(tenantId);
        return success(statusRespVO);
    }

    @DeleteMapping("/revoke")
    @Operation(summary = "撤销授权")
    @Parameter(name = "tenantId", description = "租户ID", required = true)
    @Parameter(name = "shopId", description = "店铺ID", required = true)
    public CommonResult<Boolean> revokeAuth(
            @RequestParam("tenantId") Long tenantId,
            @RequestParam("shopId") Long shopId) {
        doudianOAuthService.revokeAuth(tenantId, shopId);
        return success(true);
    }
}
