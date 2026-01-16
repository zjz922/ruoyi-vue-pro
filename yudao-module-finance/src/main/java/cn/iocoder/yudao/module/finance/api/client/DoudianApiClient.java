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

    @Value("${doudian.app.key:}")
    private String appKey;

    @Value("${doudian.app.secret:}")
    private String appSecret;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 获取订单汇总数据
     * 
     * @param shopId 店铺ID
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单汇总数据
     */
    public DoudianOrderSummaryDTO getOrderSummary(Long shopId, String accessToken, LocalDate startDate, LocalDate endDate) {
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
                BigDecimal totalSales = BigDecimal.ZERO;
                BigDecimal totalRefund = BigDecimal.ZERO;
                BigDecimal totalCommission = BigDecimal.ZERO;
                BigDecimal totalServiceFee = BigDecimal.ZERO;
                BigDecimal totalShipping = BigDecimal.ZERO;
                BigDecimal totalInsurance = BigDecimal.ZERO;
                BigDecimal totalAfterSale = BigDecimal.ZERO;
                int orderCount = 0;
                
                if (data != null && data.containsKey("shop_order_list")) {
                    for (Object orderObj : data.getJSONArray("shop_order_list")) {
                        JSONObject order = (JSONObject) orderObj;
                        orderCount++;
                        
                        // 订单金额
                        BigDecimal orderAmount = order.getBigDecimal("order_amount");
                        if (orderAmount != null) {
                            totalSales = totalSales.add(orderAmount.divide(new BigDecimal("100")));
                        }
                        
                        // 退款金额
                        BigDecimal refundAmount = order.getBigDecimal("refund_amount");
                        if (refundAmount != null) {
                            totalRefund = totalRefund.add(refundAmount.divide(new BigDecimal("100")));
                        }
                        
                        // 达人佣金
                        BigDecimal commission = order.getBigDecimal("author_cost_amount");
                        if (commission != null) {
                            totalCommission = totalCommission.add(commission.divide(new BigDecimal("100")));
                        }
                        
                        // 平台服务费
                        BigDecimal serviceFee = order.getBigDecimal("platform_cost_amount");
                        if (serviceFee != null) {
                            totalServiceFee = totalServiceFee.add(serviceFee.divide(new BigDecimal("100")));
                        }
                        
                        // 快递费
                        BigDecimal shipping = order.getBigDecimal("post_amount");
                        if (shipping != null) {
                            totalShipping = totalShipping.add(shipping.divide(new BigDecimal("100")));
                        }
                        
                        // 运费险
                        BigDecimal insurance = order.getBigDecimal("post_insurance_amount");
                        if (insurance != null) {
                            totalInsurance = totalInsurance.add(insurance.divide(new BigDecimal("100")));
                        }
                    }
                }
                
                summary.setSalesRevenue(totalSales);
                summary.setRefundAmount(totalRefund);
                summary.setCommissionFee(totalCommission);
                summary.setServiceFee(totalServiceFee);
                summary.setShippingFee(totalShipping);
                summary.setInsuranceFee(totalInsurance);
                summary.setAfterSaleCost(totalAfterSale);
                summary.setOrderCount(orderCount);
                summary.setSyncTime(LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("获取抖店订单汇总失败: shopId={}, error={}", shopId, e.getMessage(), e);
        }
        
        return summary;
    }

    /**
     * 获取订单列表
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
            log.error("获取抖店订单列表失败: shopId={}, error={}", shopId, e.getMessage(), e);
        }
        
        return result;
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
            requestBody.put("access_token", accessToken);
            
            // 计算签名
            String sign = calculateSign(requestBody);
            requestBody.put("sign", sign);
            
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setEntity(new StringEntity(JSON.toJSONString(requestBody), StandardCharsets.UTF_8));
            
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
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
