package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.module.finance.controller.admin.doudianauth.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianAuthTokenDO;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianShopDO;
import cn.iocoder.yudao.module.finance.dal.mysql.DoudianAuthTokenMapper;
import cn.iocoder.yudao.module.finance.dal.mysql.DoudianShopMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 抖店授权 Service 实现类
 *
 * @author 闪电帐PRO
 */
@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class DoudianAuthServiceImpl implements DoudianAuthService {

    private final DoudianAuthTokenMapper authTokenMapper;
    private final DoudianShopMapper shopMapper;
    private final RestTemplate restTemplate;

    @Value("${doudian.app-key:}")
    private String appKey;

    @Value("${doudian.app-secret:}")
    private String appSecret;

    @Value("${doudian.oauth-url:https://openapi-fxg.jinritemai.com}")
    private String oauthUrl;

    @Override
    public String getAuthUrl(Long userId, String redirectUri) {
        // 构建抖店OAuth授权URL
        StringBuilder url = new StringBuilder();
        url.append(oauthUrl).append("/oauth2/authorize");
        url.append("?app_key=").append(appKey);
        url.append("&response_type=code");
        url.append("&redirect_uri=").append(redirectUri);
        url.append("&state=").append(userId);
        
        log.info("生成抖店授权URL: {}", url);
        return url.toString();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DoudianAuthTokenDO handleCallback(String code, Long userId) {
        log.info("处理抖店授权回调, code: {}, userId: {}", code, userId);
        
        // TODO: 调用抖店API获取access_token
        // 这里是模拟实现，实际需要调用抖店OAuth接口
        
        DoudianAuthTokenDO tokenDO = new DoudianAuthTokenDO();
        tokenDO.setUserId(userId);
        tokenDO.setShopId("mock_shop_id");
        tokenDO.setShopName("测试店铺");
        tokenDO.setAccessToken("mock_access_token");
        tokenDO.setRefreshToken("mock_refresh_token");
        tokenDO.setExpiresIn(86400);
        tokenDO.setAccessTokenExpireTime(LocalDateTime.now().plusDays(1));
        tokenDO.setRefreshTokenExpireTime(LocalDateTime.now().plusDays(30));
        tokenDO.setAuthStatus(1);
        tokenDO.setScope("shop.all");
        
        authTokenMapper.insert(tokenDO);
        
        // 同步店铺信息
        syncShopInfo(tokenDO.getShopId());
        
        return tokenDO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DoudianAuthTokenDO refreshToken(Long tokenId) {
        DoudianAuthTokenDO tokenDO = authTokenMapper.selectById(tokenId);
        if (tokenDO == null) {
            throw new RuntimeException("Token不存在");
        }
        
        // TODO: 调用抖店API刷新token
        // 这里是模拟实现
        
        tokenDO.setAccessToken("new_access_token_" + System.currentTimeMillis());
        tokenDO.setAccessTokenExpireTime(LocalDateTime.now().plusDays(1));
        authTokenMapper.updateById(tokenDO);
        
        log.info("刷新Token成功, tokenId: {}", tokenId);
        return tokenDO;
    }

    @Override
    public List<DoudianShopDO> getAuthorizedShops(Long userId) {
        return shopMapper.selectListByUserId(userId);
    }

    @Override
    public AuthStatusVO checkAuthStatus(String shopId) {
        AuthStatusVO vo = new AuthStatusVO();
        vo.setShopId(shopId);
        
        DoudianAuthTokenDO tokenDO = authTokenMapper.selectByShopId(shopId);
        if (tokenDO == null) {
            vo.setAuthorized(false);
            vo.setStatus("unauthorized");
            vo.setMessage("未授权");
            return vo;
        }
        
        // 检查token是否过期
        if (tokenDO.getAccessTokenExpireTime().isBefore(LocalDateTime.now())) {
            vo.setAuthorized(false);
            vo.setStatus("expired");
            vo.setMessage("授权已过期");
            vo.setExpireTime(tokenDO.getAccessTokenExpireTime());
        } else {
            vo.setAuthorized(true);
            vo.setStatus("authorized");
            vo.setMessage("已授权");
            vo.setExpireTime(tokenDO.getAccessTokenExpireTime());
        }
        
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void revokeAuth(String shopId) {
        DoudianAuthTokenDO tokenDO = authTokenMapper.selectByShopId(shopId);
        if (tokenDO != null) {
            tokenDO.setAuthStatus(0);
            authTokenMapper.updateById(tokenDO);
            log.info("撤销授权成功, shopId: {}", shopId);
        }
    }

    @Override
    public DoudianAuthTokenDO getAuthToken(String shopId) {
        DoudianAuthTokenDO tokenDO = authTokenMapper.selectByShopId(shopId);
        
        // 检查是否需要刷新token
        if (tokenDO != null && tokenDO.getAccessTokenExpireTime().isBefore(LocalDateTime.now().plusHours(1))) {
            // Token即将过期，尝试刷新
            try {
                tokenDO = refreshToken(tokenDO.getId());
            } catch (Exception e) {
                log.error("刷新Token失败", e);
            }
        }
        
        return tokenDO;
    }

    @Override
    public List<AuthStatusVO> batchCheckAuthStatus(List<String> shopIds) {
        List<AuthStatusVO> result = new ArrayList<>();
        for (String shopId : shopIds) {
            result.add(checkAuthStatus(shopId));
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DoudianShopDO syncShopInfo(String shopId) {
        // TODO: 调用抖店API获取店铺信息
        // 这里是模拟实现
        
        DoudianShopDO shopDO = shopMapper.selectByShopId(shopId);
        if (shopDO == null) {
            shopDO = new DoudianShopDO();
            shopDO.setShopId(shopId);
            shopDO.setShopName("测试店铺");
            shopDO.setShopLogo("");
            shopDO.setShopType("普通店铺");
            shopDO.setShopStatus(1);
            shopMapper.insert(shopDO);
        } else {
            // 更新店铺信息
            shopMapper.updateById(shopDO);
        }
        
        log.info("同步店铺信息成功, shopId: {}", shopId);
        return shopDO;
    }

}
