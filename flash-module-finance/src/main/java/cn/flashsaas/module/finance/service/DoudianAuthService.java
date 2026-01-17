package cn.flashsaas.module.finance.service;

import cn.flashsaas.module.finance.controller.admin.doudianauth.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.DoudianAuthTokenDO;
import cn.flashsaas.module.finance.dal.dataobject.DoudianShopDO;

import java.util.List;

/**
 * 抖店授权 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface DoudianAuthService {

    /**
     * 获取授权URL
     *
     * @param userId 用户ID
     * @param redirectUri 回调地址
     * @return 授权URL
     */
    String getAuthUrl(Long userId, String redirectUri);

    /**
     * 处理授权回调
     *
     * @param code 授权码
     * @param userId 用户ID
     * @return 授权Token
     */
    DoudianAuthTokenDO handleCallback(String code, Long userId);

    /**
     * 刷新Token
     *
     * @param tokenId Token ID
     * @return 刷新后的Token
     */
    DoudianAuthTokenDO refreshToken(Long tokenId);

    /**
     * 获取用户的授权店铺列表
     *
     * @param userId 用户ID
     * @return 授权店铺列表
     */
    List<DoudianShopDO> getAuthorizedShops(Long userId);

    /**
     * 检查授权状态
     *
     * @param shopId 店铺ID
     * @return 授权状态
     */
    AuthStatusVO checkAuthStatus(String shopId);

    /**
     * 撤销授权
     *
     * @param shopId 店铺ID
     */
    void revokeAuth(String shopId);

    /**
     * 获取授权Token
     *
     * @param shopId 店铺ID
     * @return 授权Token
     */
    DoudianAuthTokenDO getAuthToken(String shopId);

    /**
     * 批量检查授权状态
     *
     * @param shopIds 店铺ID列表
     * @return 授权状态列表
     */
    List<AuthStatusVO> batchCheckAuthStatus(List<String> shopIds);

    /**
     * 同步店铺信息
     *
     * @param shopId 店铺ID
     * @return 店铺信息
     */
    DoudianShopDO syncShopInfo(String shopId);

}
