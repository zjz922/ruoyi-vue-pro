package cn.iocoder.yudao.module.finance.service.oauth;

import cn.iocoder.yudao.module.finance.controller.admin.oauth.vo.DoudianAuthStatusRespVO;
import cn.iocoder.yudao.module.finance.controller.admin.oauth.vo.DoudianTokenRespVO;

/**
 * 抖店OAuth授权 Service接口
 *
 * @author 闪电帐PRO
 */
public interface DoudianOAuthService {

    /**
     * 获取抖店授权URL
     *
     * @param tenantId 租户ID
     * @return 授权URL
     */
    String getAuthorizeUrl(Long tenantId);

    /**
     * 处理OAuth回调
     *
     * @param code  授权码
     * @param state 状态参数（包含租户ID等信息）
     */
    void handleCallback(String code, String state);

    /**
     * 使用授权码换取Access Token
     *
     * @param code     授权码
     * @param tenantId 租户ID
     * @return Token响应
     */
    DoudianTokenRespVO exchangeToken(String code, Long tenantId);

    /**
     * 刷新Access Token
     *
     * @param tenantId 租户ID
     * @param shopId   店铺ID
     * @return Token响应
     */
    DoudianTokenRespVO refreshToken(Long tenantId, Long shopId);

    /**
     * 获取授权状态
     *
     * @param tenantId 租户ID
     * @return 授权状态
     */
    DoudianAuthStatusRespVO getAuthStatus(Long tenantId);

    /**
     * 撤销授权
     *
     * @param tenantId 租户ID
     * @param shopId   店铺ID
     */
    void revokeAuth(Long tenantId, Long shopId);
}
