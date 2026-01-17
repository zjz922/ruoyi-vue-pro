package cn.iocoder.yudao.module.finance.api.client;

import cn.iocoder.yudao.module.finance.api.client.dto.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 抖店API客户端
 * 
 * 负责与抖店开放平台API对接，获取订单、商品、达人等数据
 * 
 * @author 闪电帐PRO
 */
@Slf4j
@Component
public class DoudianApiClient {

    @Value("${doudian.api.url:https://openapi-fxg.jinritemai.com}")
    private String apiUrl;

    @Value("${finance.doudian.app-key:}")
    private String appKey;

    @Value("${finance.doudian.app-secret:}")
    private String appSecret;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 获取订单汇总数据（重载方法，兼容新接口）
     * 
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单汇总数据
     */
    public DoudianOrderSummaryDTO getOrderSummary(String accessToken, LocalDate startDate, LocalDate endDate) {
        DoudianOrderSummaryDTO summary = new DoudianOrderSummaryDTO();
        
        try {
            // 调用抖店订单搜索API
            Map<String, Object> params = new HashMap<>();
            params.put("start_time", startDate.atStartOfDay().format(DATE_FORMATTER));
            params.put("end_time", endDate.atTime(23, 59, 59).format(DATE_FORMATTER));
            params.put("page", 0);
            params.put("size", 100);
            
            JSONObject response = callApi("/order/searchList", params, accessToken);
            
            if (response != null && response.getInteger("err_no") == 0) {
                JSONObject data = response.getJSONObject("data");
                
                // 统计订单数据
                BigDecimal totalAmount = BigDecimal.ZERO;
                BigDecimal totalRefund = BigDecimal.ZERO;
                int orderCount = 0;
                int refundCount = 0;
                
                if (data != null && data.containsKey("shop_order_list")) {
                    for (Object orderObj : data.getJSONArray("shop_order_list")) {
                        JSONObject order = (JSONObject) orderObj;
                        orderCount++;
                        
                        // 订单金额（分）
                        BigDecimal orderAmount = order.getBigDecimal("order_amount");
                        if (orderAmount != null) {
                            totalAmount = totalAmount.add(orderAmount);
                        }
                        
                        // 退款金额（分）
                        BigDecimal refundAmount = order.getBigDecimal("refund_amount");
                        if (refundAmount != null && refundAmount.compareTo(BigDecimal.ZERO) > 0) {
                            totalRefund = totalRefund.add(refundAmount);
                            refundCount++;
                        }
                    }
                }
                
                summary.setTotalAmount(totalAmount);
                summary.setRefundAmount(totalRefund);
                summary.setOrderCount(orderCount);
                summary.setRefundCount(refundCount);
                summary.setSyncTime(LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("获取抖店订单汇总失败: error={}", e.getMessage(), e);
        }
        
        return summary;
    }

    /**
     * 获取订单汇总数据（原方法，保持兼容）
     * 
     * @param shopId 店铺ID
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单汇总数据
     */
    public DoudianOrderSummaryDTO getOrderSummary(Long shopId, String accessToken, LocalDate startDate, LocalDate endDate) {
        return getOrderSummary(accessToken, startDate, endDate);
    }

    /**
     * 获取订单列表（重载方法，兼容新接口）
     * 
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param page 页码
     * @param size 每页条数
     * @return 订单列表
     */
    public DoudianOrderListDTO getOrderList(String accessToken, LocalDate startDate, LocalDate endDate, int page, int size) {
        DoudianOrderListDTO result = new DoudianOrderListDTO();
        result.setOrders(new ArrayList<>());
        result.setTotal(0L);
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("start_time", startDate.atStartOfDay().format(DATE_FORMATTER));
            params.put("end_time", endDate.atTime(23, 59, 59).format(DATE_FORMATTER));
            params.put("page", page);
            params.put("size", size);
            
            JSONObject response = callApi("/order/searchList", params, accessToken);
            
            if (response != null && response.getInteger("err_no") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    result.setTotal(data.getLong("total"));
                    
                    if (data.containsKey("shop_order_list")) {
                        for (Object orderObj : data.getJSONArray("shop_order_list")) {
                            JSONObject order = (JSONObject) orderObj;
                            DoudianOrderDTO orderDTO = new DoudianOrderDTO();
                            orderDTO.setOrderId(order.getString("order_id"));
                            orderDTO.setOrderStatus(order.getInteger("order_status"));
                            orderDTO.setOrderAmount(order.getBigDecimal("order_amount"));
                            orderDTO.setPayAmount(order.getBigDecimal("pay_amount"));
                            orderDTO.setRefundAmount(order.getBigDecimal("refund_amount"));
                            orderDTO.setCreateTime(order.getString("create_time"));
                            orderDTO.setUpdateTime(order.getString("update_time"));
                            result.getOrders().add(orderDTO);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取抖店订单列表失败: error={}", e.getMessage(), e);
        }
        
        return result;
    }

    /**
     * 获取订单列表（原方法，保持兼容）
     * 
     * @param shopId 店铺ID
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param page 页码
     * @param size 每页条数
     * @return 订单列表
     */
    public DoudianOrderListDTO getOrderList(Long shopId, String accessToken, LocalDate startDate, LocalDate endDate, int page, int size) {
        return getOrderList(accessToken, startDate, endDate, page, size);
    }

    /**
     * 获取资金流水列表
     * 
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param page 页码
     * @param size 每页条数
     * @return 资金流水列表
     */
    public DoudianCashflowListDTO getCashflowList(String accessToken, LocalDate startDate, LocalDate endDate, int page, int size) {
        DoudianCashflowListDTO result = new DoudianCashflowListDTO();
        result.setCashflows(new ArrayList<>());
        result.setTotal(0);
        result.setPage(page);
        result.setPageSize(size);
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("start_time", startDate.atStartOfDay().format(DATE_FORMATTER));
            params.put("end_time", endDate.atTime(23, 59, 59).format(DATE_FORMATTER));
            params.put("page", page);
            params.put("size", size);
            
            // 调用抖店资金流水API
            JSONObject response = callApi("/shop/getShopAccountFlowList", params, accessToken);
            
            if (response != null && response.getInteger("err_no") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    result.setTotal(data.getInteger("total"));
                    
                    if (data.containsKey("flow_list")) {
                        for (Object flowObj : data.getJSONArray("flow_list")) {
                            JSONObject flow = (JSONObject) flowObj;
                            DoudianCashflowDTO cashflowDTO = new DoudianCashflowDTO();
                            cashflowDTO.setFlowId(flow.getString("flow_id"));
                            cashflowDTO.setTradeType(flow.getString("trade_type"));
                            cashflowDTO.setAmount(flow.getBigDecimal("amount"));
                            cashflowDTO.setBalance(flow.getBigDecimal("balance"));
                            cashflowDTO.setTradeTime(flow.getString("trade_time"));
                            cashflowDTO.setDescription(flow.getString("description"));
                            cashflowDTO.setOrderId(flow.getString("order_id"));
                            result.getCashflows().add(cashflowDTO);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取抖店资金流水列表失败: error={}", e.getMessage(), e);
        }
        
        return result;
    }

    /**
     * 刷新访问令牌
     * 
     * @param appKey 应用Key
     * @param appSecret 应用Secret
     * @param refreshToken 刷新令牌
     * @return 新的令牌信息
     */
    public DoudianTokenDTO refreshToken(String appKey, String appSecret, String refreshToken) {
        DoudianTokenDTO tokenDTO = new DoudianTokenDTO();
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("grant_type", "refresh_token");
            params.put("refresh_token", refreshToken);
            
            // 使用传入的appKey和appSecret
            String originalAppKey = this.appKey;
            String originalAppSecret = this.appSecret;
            this.appKey = appKey;
            this.appSecret = appSecret;
            
            JSONObject response = callApi("/token/refresh", params, null);
            
            // 恢复原始配置
            this.appKey = originalAppKey;
            this.appSecret = originalAppSecret;
            
            if (response != null && response.getInteger("err_no") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    tokenDTO.setAccessToken(data.getString("access_token"));
                    tokenDTO.setRefreshToken(data.getString("refresh_token"));
                    tokenDTO.setExpiresIn(data.getLong("expires_in"));
                    tokenDTO.setScope(data.getString("scope"));
                    tokenDTO.setShopId(data.getString("shop_id"));
                    tokenDTO.setShopName(data.getString("shop_name"));
                }
            }
        } catch (Exception e) {
            log.error("刷新抖店令牌失败: error={}", e.getMessage(), e);
        }
        
        return tokenDTO;
    }

    /**
     * 获取店铺信息
     * 
     * @param accessToken 访问令牌
     * @return 店铺信息
     */
    public DoudianShopDTO getShopInfo(String accessToken) {
        DoudianShopDTO shop = new DoudianShopDTO();
        
        try {
            Map<String, Object> params = new HashMap<>();
            JSONObject response = callApi("/shop/getShopCategory", params, accessToken);
            
            if (response != null && response.getInteger("err_no") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    shop.setShopId(data.getLong("shop_id"));
                    shop.setShopName(data.getString("shop_name"));
                }
            }
        } catch (Exception e) {
            log.error("获取抖店店铺信息失败: error={}", e.getMessage(), e);
        }
        
        return shop;
    }

    /**
     * 获取账户余额
     * 
     * @param accessToken 访问令牌
     * @return 账户余额
     */
    public BigDecimal getAccountBalance(String accessToken) {
        try {
            Map<String, Object> params = new HashMap<>();
            JSONObject response = callApi("/shop/getShopAccountInfo", params, accessToken);
            
            if (response != null && response.getInteger("err_no") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    BigDecimal balance = data.getBigDecimal("available_amount");
                    if (balance != null) {
                        return balance.divide(new BigDecimal("100"));
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取抖店账户余额失败: error={}", e.getMessage(), e);
        }
        
        return BigDecimal.ZERO;
    }

    /**
     * 调用抖店API
     * 
     * @param method API方法
     * @param params 请求参数
     * @param accessToken 访问令牌
     * @return 响应结果
     */
    private JSONObject callApi(String method, Map<String, Object> params, String accessToken) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String url = apiUrl + method;
            HttpPost httpPost = new HttpPost(url);
            
            // 构建请求参数
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("app_key", appKey);
            requestBody.put("method", method);
            requestBody.put("param_json", JSON.toJSONString(params));
            requestBody.put("timestamp", String.valueOf(System.currentTimeMillis() / 1000));
            requestBody.put("v", "2");
            if (accessToken != null) {
                requestBody.put("access_token", accessToken);
            }
            
            // 计算签名
            String sign = calculateSign(requestBody);
            requestBody.put("sign", sign);
            
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setEntity(new StringEntity(JSON.toJSONString(requestBody), StandardCharsets.UTF_8));
            
            log.debug("[callApi] 请求URL: {}, 参数: {}", url, JSON.toJSONString(requestBody));
            
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                log.debug("[callApi] 响应: {}", responseBody);
                return JSON.parseObject(responseBody);
            }
        } catch (Exception e) {
            log.error("调用抖店API失败: method={}, error={}", method, e.getMessage(), e);
            return null;
        }
    }

    /**
     * 计算签名
     * 
     * @param params 请求参数
     * @return 签名
     */
    private String calculateSign(Map<String, Object> params) {
        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);
        
        StringBuilder sb = new StringBuilder();
        sb.append(appSecret);
        for (String key : keys) {
            if (!"sign".equals(key)) {
                sb.append(key).append(params.get(key));
            }
        }
        sb.append(appSecret);
        
        return DigestUtils.md5Hex(sb.toString());
    }
}
