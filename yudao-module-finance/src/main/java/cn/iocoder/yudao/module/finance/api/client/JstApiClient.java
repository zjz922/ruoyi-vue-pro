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
 * 聚水潭API客户端
 * 
 * 负责与聚水潭ERP API对接，获取入库、出库、库存等数据
 * 
 * @author 闪电帐PRO
 */
@Slf4j
@Component
public class JstApiClient {

    @Value("${jst.api.url:https://openapi.jushuitan.com}")
    private String apiUrl;

    @Value("${jst.app.key:}")
    private String appKey;

    @Value("${jst.app.secret:}")
    private String appSecret;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 获取入库汇总数据
     * 
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 入库汇总数据
     */
    public JstInboundSummaryDTO getInboundSummary(String accessToken, LocalDate startDate, LocalDate endDate) {
        JstInboundSummaryDTO summary = new JstInboundSummaryDTO();
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("modified_begin", startDate.atStartOfDay().format(DATE_FORMATTER));
            params.put("modified_end", endDate.atTime(23, 59, 59).format(DATE_FORMATTER));
            params.put("page_index", 1);
            params.put("page_size", 100);
            
            JSONObject response = callApi("/open/purchasein/query", params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                
                BigDecimal totalAmount = BigDecimal.ZERO;
                int totalQuantity = 0;
                int orderCount = 0;
                
                if (data != null && data.containsKey("datas")) {
                    for (Object item : data.getJSONArray("datas")) {
                        JSONObject inbound = (JSONObject) item;
                        orderCount++;
                        
                        // 入库金额
                        BigDecimal amount = inbound.getBigDecimal("amount");
                        if (amount != null) {
                            totalAmount = totalAmount.add(amount);
                        }
                        
                        // 入库数量
                        Integer qty = inbound.getInteger("qty");
                        if (qty != null) {
                            totalQuantity += qty;
                        }
                    }
                }
                
                summary.setTotalAmount(totalAmount);
                summary.setTotalQuantity(totalQuantity);
                summary.setOrderCount(orderCount);
                summary.setSyncTime(LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("获取聚水潭入库汇总失败: error={}", e.getMessage(), e);
        }
        
        return summary;
    }

    /**
     * 获取出库汇总数据
     * 
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 出库汇总数据
     */
    public JstOutboundSummaryDTO getOutboundSummary(String accessToken, LocalDate startDate, LocalDate endDate) {
        JstOutboundSummaryDTO summary = new JstOutboundSummaryDTO();
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("modified_begin", startDate.atStartOfDay().format(DATE_FORMATTER));
            params.put("modified_end", endDate.atTime(23, 59, 59).format(DATE_FORMATTER));
            params.put("page_index", 1);
            params.put("page_size", 100);
            
            JSONObject response = callApi("/open/saleout/query", params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                
                BigDecimal totalAmount = BigDecimal.ZERO;
                BigDecimal totalCost = BigDecimal.ZERO;
                int totalQuantity = 0;
                int orderCount = 0;
                
                if (data != null && data.containsKey("datas")) {
                    for (Object item : data.getJSONArray("datas")) {
                        JSONObject outbound = (JSONObject) item;
                        orderCount++;
                        
                        // 出库金额
                        BigDecimal amount = outbound.getBigDecimal("amount");
                        if (amount != null) {
                            totalAmount = totalAmount.add(amount);
                        }
                        
                        // 成本
                        BigDecimal cost = outbound.getBigDecimal("cost_amount");
                        if (cost != null) {
                            totalCost = totalCost.add(cost);
                        }
                        
                        // 出库数量
                        Integer qty = outbound.getInteger("qty");
                        if (qty != null) {
                            totalQuantity += qty;
                        }
                    }
                }
                
                summary.setTotalAmount(totalAmount);
                summary.setTotalCost(totalCost);
                summary.setTotalQuantity(totalQuantity);
                summary.setOrderCount(orderCount);
                summary.setSyncTime(LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("获取聚水潭出库汇总失败: error={}", e.getMessage(), e);
        }
        
        return summary;
    }

    /**
     * 获取库存汇总数据
     * 
     * @param accessToken 访问令牌
     * @return 库存汇总数据
     */
    public JstInventorySummaryDTO getInventorySummary(String accessToken) {
        JstInventorySummaryDTO summary = new JstInventorySummaryDTO();
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("page_index", 1);
            params.put("page_size", 100);
            
            JSONObject response = callApi("/open/inventory/query", params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                
                BigDecimal totalValue = BigDecimal.ZERO;
                int totalQuantity = 0;
                int skuCount = 0;
                int lowStockCount = 0;
                int outOfStockCount = 0;
                
                if (data != null && data.containsKey("datas")) {
                    for (Object item : data.getJSONArray("datas")) {
                        JSONObject inventory = (JSONObject) item;
                        skuCount++;
                        
                        // 库存数量
                        Integer qty = inventory.getInteger("qty");
                        if (qty != null) {
                            totalQuantity += qty;
                            
                            if (qty == 0) {
                                outOfStockCount++;
                            } else if (qty < 10) {
                                lowStockCount++;
                            }
                        }
                        
                        // 库存价值
                        BigDecimal cost = inventory.getBigDecimal("cost_price");
                        if (cost != null && qty != null) {
                            totalValue = totalValue.add(cost.multiply(new BigDecimal(qty)));
                        }
                    }
                }
                
                summary.setTotalValue(totalValue);
                summary.setTotalQuantity(totalQuantity);
                summary.setSkuCount(skuCount);
                summary.setLowStockCount(lowStockCount);
                summary.setOutOfStockCount(outOfStockCount);
                summary.setSyncTime(LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("获取聚水潭库存汇总失败: error={}", e.getMessage(), e);
        }
        
        return summary;
    }

    /**
     * 获取SKU列表
     * 
     * @param accessToken 访问令牌
     * @param page 页码
     * @param pageSize 每页条数
     * @return SKU列表
     */
    public JstSkuListDTO getSkuList(String accessToken, int page, int pageSize) {
        JstSkuListDTO result = new JstSkuListDTO();
        result.setSkus(new ArrayList<>());
        result.setTotal(0L);
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("page_index", page);
            params.put("page_size", pageSize);
            
            JSONObject response = callApi("/open/sku/query", params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    result.setTotal(data.getLong("data_count"));
                    
                    if (data.containsKey("datas")) {
                        for (Object item : data.getJSONArray("datas")) {
                            JSONObject sku = (JSONObject) item;
                            JstSkuDTO dto = new JstSkuDTO();
                            dto.setSkuId(sku.getString("sku_id"));
                            dto.setSkuName(sku.getString("name"));
                            dto.setCostPrice(sku.getBigDecimal("cost_price"));
                            dto.setSalePrice(sku.getBigDecimal("sale_price"));
                            dto.setQuantity(sku.getInteger("qty"));
                            result.getSkus().add(dto);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取聚水潭SKU列表失败: error={}", e.getMessage(), e);
        }
        
        return result;
    }

    /**
     * 获取入库单列表
     * 
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param page 页码
     * @param pageSize 每页条数
     * @return 入库单列表
     */
    public JstInboundListDTO getInboundList(String accessToken, LocalDate startDate, LocalDate endDate, int page, int pageSize) {
        JstInboundListDTO result = new JstInboundListDTO();
        result.setInbounds(new ArrayList<>());
        result.setTotal(0L);
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("modified_begin", startDate.atStartOfDay().format(DATE_FORMATTER));
            params.put("modified_end", endDate.atTime(23, 59, 59).format(DATE_FORMATTER));
            params.put("page_index", page);
            params.put("page_size", pageSize);
            
            JSONObject response = callApi("/open/purchasein/query", params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    result.setTotal(data.getLong("data_count"));
                    
                    if (data.containsKey("datas")) {
                        for (Object item : data.getJSONArray("datas")) {
                            JSONObject inbound = (JSONObject) item;
                            JstInboundDTO dto = new JstInboundDTO();
                            dto.setInboundId(inbound.getString("io_id"));
                            dto.setInboundNo(inbound.getString("io_id"));
                            dto.setStatus(inbound.getString("status"));
                            dto.setAmount(inbound.getBigDecimal("amount"));
                            dto.setQuantity(inbound.getInteger("qty"));
                            dto.setCreateTime(inbound.getString("created"));
                            result.getInbounds().add(dto);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取聚水潭入库单列表失败: error={}", e.getMessage(), e);
        }
        
        return result;
    }

    /**
     * 调用聚水潭API
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
            requestBody.put("access_token", accessToken);
            requestBody.put("timestamp", String.valueOf(System.currentTimeMillis() / 1000));
            requestBody.put("charset", "utf-8");
            requestBody.put("biz", JSON.toJSONString(params));
            
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
            log.error("调用聚水潭API失败: method={}, error={}", method, e.getMessage(), e);
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
        
        return DigestUtils.md5Hex(sb.toString()).toUpperCase();
    }
}
