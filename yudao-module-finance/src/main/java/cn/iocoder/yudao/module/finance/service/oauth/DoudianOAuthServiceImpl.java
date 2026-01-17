package cn.iocoder.yudao.module.finance.service.oauth;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import cn.iocoder.yudao.module.finance.controller.admin.oauth.vo.DoudianAuthStatusRespVO;
import cn.iocoder.yudao.module.finance.controller.admin.oauth.vo.DoudianTokenRespVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianAuthTokenDO;
import cn.iocoder.yudao.module.finance.dal.mysql.DoudianAuthTokenMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 抖店OAuth授权 Service实现类
 *
 * @author 闪电帐PRO
 */
@Service
@Slf4j
public class DoudianOAuthServiceImpl implements DoudianOAuthService {

    /**
     * 抖店OAuth授权地址
     */
    private static final String OAUTH_AUTHORIZE_URL = "https://fuwu.jinritemai.com/authorize";
    
    /**
     * 抖店Token获取地址
     */
    private static final String OAUTH_TOKEN_URL = "https://openapi-fxg.jinritemai.com/token/create";
    
    /**
     * 抖店Token刷新地址
     */
    private static final String OAUTH_REFRESH_URL = "https://openapi-fxg.jinritemai.com/token/refresh";

    @Value("${finance.doudian.app-key}")
    private String appKey;

    @Value("${finance.doudian.app-secret}")
    private String appSecret;

    @Value("${finance.doudian.callback-url:}")
    private String callbackUrl;

    @Resource
    private DoudianAuthTokenMapper doudianAuthTokenMapper;

    @Override
    public String getAuthorizeUrl(Long tenantId) {
        // 构建state参数，包含租户ID和随机字符串
        String state = tenantId + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        
        // 构建授权URL
        StringBuilder urlBuilder = new StringBuilder(OAUTH_AUTHORIZE_URL);
        urlBuilder.append("?response_type=code");
        urlBuilder.append("&app_key=").append(appKey);
        urlBuilder.append("&state=").append(state);
        
        // 如果配置了回调地址，则添加
        if (StrUtil.isNotBlank(callbackUrl)) {
            try {
                urlBuilder.append("&redirect_uri=").append(URLEncoder.encode(callbackUrl, StandardCharsets.UTF_8.name()));
            } catch (Exception e) {
                log.error("[getAuthorizeUrl] URL编码失败: {}", e.getMessage());
            }
        }
        
        String authorizeUrl = urlBuilder.toString();
        log.info("[getAuthorizeUrl] 生成授权URL: tenantId={}, url={}", tenantId, authorizeUrl);
        
        return authorizeUrl;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleCallback(String code, String state) {
        log.info("[handleCallback] 处理授权回调: code={}, state={}", code, state);
        
        // 解析state获取租户ID
        Long tenantId = parseStateToTenantId(state);
        if (tenantId == null) {
            throw new RuntimeException("无效的state参数");
        }
        
        // 使用授权码换取Token
        exchangeToken(code, tenantId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DoudianTokenRespVO exchangeToken(String code, Long tenantId) {
        log.info("[exchangeToken] 使用授权码换取Token: code={}, tenantId={}", code, tenantId);
        
        // 构建请求参数
        Map<String, Object> params = new TreeMap<>();
        params.put("app_key", appKey);
        params.put("app_secret", appSecret);
        params.put("code", code);
        params.put("grant_type", "authorization_code");
        
        // 生成签名
        String sign = generateSign(params);
        params.put("sign", sign);
        
        // 发送请求
        String requestBody = JSONUtil.toJsonStr(params);
        log.info("[exchangeToken] 请求参数: {}", requestBody);
        
        HttpResponse response = HttpRequest.post(OAUTH_TOKEN_URL)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .timeout(30000)
                .execute();
        
        String responseBody = response.body();
        log.info("[exchangeToken] 响应结果: {}", responseBody);
        
        // 解析响应
        JSONObject jsonResponse = JSONUtil.parseObj(responseBody);
        
        // 检查错误
        Integer errNo = jsonResponse.getInt("err_no");
        if (errNo != null && errNo != 0) {
            String errMsg = jsonResponse.getStr("message");
            log.error("[exchangeToken] 获取Token失败: errNo={}, message={}", errNo, errMsg);
            throw new RuntimeException("获取Token失败: " + errMsg);
        }
        
        // 解析Token数据
        JSONObject data = jsonResponse.getJSONObject("data");
        if (data == null) {
            throw new RuntimeException("获取Token失败: 响应数据为空");
        }
        
        String accessToken = data.getStr("access_token");
        String refreshToken = data.getStr("refresh_token");
        Integer expiresIn = data.getInt("expires_in");
        String shopIdStr = data.getStr("shop_id");
        String shopName = data.getStr("shop_name");
        String scope = data.getStr("scope");
        
        // 计算过期时间
        LocalDateTime expireTime = LocalDateTime.now().plusSeconds(expiresIn);
        
        // 保存或更新Token到数据库
        saveOrUpdateToken(tenantId, shopIdStr, shopName, accessToken, refreshToken, expiresIn, expireTime, scope);
        
        // 构建响应
        DoudianTokenRespVO respVO = new DoudianTokenRespVO();
        respVO.setAccessToken(accessToken);
        respVO.setRefreshToken(refreshToken);
        respVO.setExpireTime(expireTime);
        try {
            respVO.setShopId(Long.parseLong(shopIdStr));
        } catch (NumberFormatException e) {
            log.warn("[exchangeToken] 店铺ID转换失败: {}", shopIdStr);
        }
        respVO.setShopName(shopName);
        respVO.setScope(scope);
        
        log.info("[exchangeToken] Token获取成功: shopId={}, shopName={}, expireTime={}", shopIdStr, shopName, expireTime);
        
        return respVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DoudianTokenRespVO refreshToken(Long tenantId, Long shopId) {
        log.info("[refreshToken] 刷新Token: tenantId={}, shopId={}", tenantId, shopId);
        
        // 查询现有Token
        DoudianAuthTokenDO tokenDO = doudianAuthTokenMapper.selectByTenantIdAndShopId(tenantId, shopId.toString());
        if (tokenDO == null) {
            throw new RuntimeException("未找到授权信息");
        }
        
        // 构建请求参数
        Map<String, Object> params = new TreeMap<>();
        params.put("app_key", appKey);
        params.put("app_secret", appSecret);
        params.put("refresh_token", tokenDO.getRefreshToken());
        params.put("grant_type", "refresh_token");
        
        // 生成签名
        String sign = generateSign(params);
        params.put("sign", sign);
        
        // 发送请求
        String requestBody = JSONUtil.toJsonStr(params);
        log.info("[refreshToken] 请求参数: {}", requestBody);
        
        HttpResponse response = HttpRequest.post(OAUTH_REFRESH_URL)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .timeout(30000)
                .execute();
        
        String responseBody = response.body();
        log.info("[refreshToken] 响应结果: {}", responseBody);
        
        // 解析响应
        JSONObject jsonResponse = JSONUtil.parseObj(responseBody);
        
        // 检查错误
        Integer errNo = jsonResponse.getInt("err_no");
        if (errNo != null && errNo != 0) {
            String errMsg = jsonResponse.getStr("message");
            log.error("[refreshToken] 刷新Token失败: errNo={}, message={}", errNo, errMsg);
            throw new RuntimeException("刷新Token失败: " + errMsg);
        }
        
        // 解析Token数据
        JSONObject data = jsonResponse.getJSONObject("data");
        if (data == null) {
            throw new RuntimeException("刷新Token失败: 响应数据为空");
        }
        
        String accessToken = data.getStr("access_token");
        String refreshToken = data.getStr("refresh_token");
        Integer expiresIn = data.getInt("expires_in");
        String scope = data.getStr("scope");
        
        // 计算过期时间
        LocalDateTime expireTime = LocalDateTime.now().plusSeconds(expiresIn);
        
        // 更新Token到数据库
        tokenDO.setAccessToken(accessToken);
        tokenDO.setRefreshToken(refreshToken);
        tokenDO.setExpiresIn(expiresIn);
        tokenDO.setExpireTime(expireTime);
        tokenDO.setScope(scope);
        tokenDO.setLastRefreshTime(LocalDateTime.now());
        doudianAuthTokenMapper.updateById(tokenDO);
        
        // 构建响应
        DoudianTokenRespVO respVO = new DoudianTokenRespVO();
        respVO.setAccessToken(accessToken);
        respVO.setRefreshToken(refreshToken);
        respVO.setExpireTime(expireTime);
        respVO.setShopId(shopId);
        respVO.setShopName(tokenDO.getShopName());
        respVO.setScope(scope);
        
        log.info("[refreshToken] Token刷新成功: shopId={}, expireTime={}", shopId, expireTime);
        
        return respVO;
    }

    @Override
    public DoudianAuthStatusRespVO getAuthStatus(Long tenantId) {
        log.info("[getAuthStatus] 获取授权状态: tenantId={}", tenantId);
        
        // 查询租户的所有授权Token
        List<DoudianAuthTokenDO> tokenList = doudianAuthTokenMapper.selectListByTenantId(tenantId);
        
        DoudianAuthStatusRespVO respVO = new DoudianAuthStatusRespVO();
        
        if (tokenList == null || tokenList.isEmpty()) {
            respVO.setAuthorized(false);
            respVO.setShops(Collections.emptyList());
            return respVO;
        }
        
        respVO.setAuthorized(true);
        
        // 转换店铺列表
        List<DoudianAuthStatusRespVO.AuthorizedShop> shops = tokenList.stream().map(token -> {
            DoudianAuthStatusRespVO.AuthorizedShop shop = new DoudianAuthStatusRespVO.AuthorizedShop();
            try {
                shop.setShopId(Long.parseLong(token.getShopId()));
            } catch (NumberFormatException e) {
                log.warn("[getAuthStatus] 店铺ID转换失败: {}", token.getShopId());
            }
            shop.setShopName(token.getShopName());
            shop.setExpireTime(token.getExpireTime());
            shop.setAuthorizeTime(token.getAuthTime());
            shop.setScope(token.getScope());
            
            // 判断状态
            if (token.getExpireTime() != null && token.getExpireTime().isBefore(LocalDateTime.now())) {
                shop.setStatus("expired");
            } else if (token.getAuthStatus() != null && token.getAuthStatus() == 1) {
                shop.setStatus("valid");
            } else {
                shop.setStatus("invalid");
            }
            
            return shop;
        }).collect(Collectors.toList());
        
        respVO.setShops(shops);
        
        return respVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void revokeAuth(Long tenantId, Long shopId) {
        log.info("[revokeAuth] 撤销授权: tenantId={}, shopId={}", tenantId, shopId);
        
        // 删除Token记录
        doudianAuthTokenMapper.deleteByTenantIdAndShopId(tenantId, shopId.toString());
        
        log.info("[revokeAuth] 授权已撤销: tenantId={}, shopId={}", tenantId, shopId);
    }

    /**
     * 解析state参数获取租户ID
     */
    private Long parseStateToTenantId(String state) {
        if (StrUtil.isBlank(state)) {
            return null;
        }
        
        try {
            String[] parts = state.split("_");
            if (parts.length >= 1) {
                return Long.parseLong(parts[0]);
            }
        } catch (NumberFormatException e) {
            log.error("[parseStateToTenantId] 解析state失败: state={}", state);
        }
        
        return null;
    }

    /**
     * 保存或更新Token到数据库
     */
    private void saveOrUpdateToken(Long tenantId, String shopId, String shopName, 
                                   String accessToken, String refreshToken, 
                                   Integer expiresIn, LocalDateTime expireTime, String scope) {
        // 查询是否已存在
        DoudianAuthTokenDO existToken = doudianAuthTokenMapper.selectByTenantIdAndShopId(tenantId, shopId);
        
        LocalDateTime now = LocalDateTime.now();
        
        if (existToken != null) {
            // 更新
            existToken.setAccessToken(accessToken);
            existToken.setRefreshToken(refreshToken);
            existToken.setExpiresIn(expiresIn);
            existToken.setExpireTime(expireTime);
            existToken.setShopName(shopName);
            existToken.setScope(scope);
            existToken.setAuthStatus(1); // 已授权
            existToken.setLastRefreshTime(now);
            doudianAuthTokenMapper.updateById(existToken);
            log.info("[saveOrUpdateToken] Token已更新: tenantId={}, shopId={}", tenantId, shopId);
        } else {
            // 新增
            DoudianAuthTokenDO newToken = DoudianAuthTokenDO.builder()
                    .tenantId(tenantId)
                    .shopId(shopId)
                    .shopName(shopName)
                    .appKey(appKey)
                    .appSecret(appSecret)
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(expiresIn)
                    .tokenType("Bearer")
                    .scope(scope)
                    .authStatus(1) // 已授权
                    .authTime(now)
                    .expireTime(expireTime)
                    .lastRefreshTime(now)
                    .build();
            doudianAuthTokenMapper.insert(newToken);
            log.info("[saveOrUpdateToken] Token已保存: tenantId={}, shopId={}", tenantId, shopId);
        }
    }

    /**
     * 生成抖店API签名
     */
    private String generateSign(Map<String, Object> params) {
        // 按key排序
        TreeMap<String, Object> sortedParams = new TreeMap<>(params);
        
        // 拼接参数
        StringBuilder sb = new StringBuilder();
        sb.append(appSecret);
        for (Map.Entry<String, Object> entry : sortedParams.entrySet()) {
            if (entry.getValue() != null && StrUtil.isNotBlank(entry.getValue().toString())) {
                sb.append(entry.getKey()).append(entry.getValue());
            }
        }
        sb.append(appSecret);
        
        // MD5加密
        return SecureUtil.md5(sb.toString());
    }
}
