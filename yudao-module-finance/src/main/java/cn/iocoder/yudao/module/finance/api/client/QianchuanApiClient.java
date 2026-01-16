package cn.iocoder.yudao.module.finance.api.client;

import cn.iocoder.yudao.module.finance.api.client.dto.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
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
 * 千川API客户端
 * 
 * 负责与巨量千川API对接，获取推广数据、投放费用等
 * 
 * @author 闪电帐PRO
 */
@Slf4j
@Component
public class QianchuanApiClient {

    @Value("${qianchuan.api.url:https://ad.oceanengine.com/open_api}")
    private String apiUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 获取推广费用汇总
     * 
     * @param advertiserId 广告主ID
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 推广费用汇总
     */
    public QianchuanCostSummaryDTO getCostSummary(Long advertiserId, String accessToken, LocalDate startDate, LocalDate endDate) {
        QianchuanCostSummaryDTO summary = new QianchuanCostSummaryDTO();
        
        try {
            // 调用千川报表API
            String url = apiUrl + "/2/report/advertiser/get/";
            Map<String, Object> params = new HashMap<>();
            params.put("advertiser_id", advertiserId);
            params.put("start_date", startDate.format(DATE_FORMATTER));
            params.put("end_date", endDate.format(DATE_FORMATTER));
            params.put("group_by", "[\"STAT_GROUP_BY_FIELD_STAT_TIME\"]");
            params.put("order_field", "stat_cost");
            params.put("order_type", "DESC");
            
            JSONObject response = callApi(url, params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                
                BigDecimal totalCost = BigDecimal.ZERO;
                BigDecimal totalShow = BigDecimal.ZERO;
                BigDecimal totalClick = BigDecimal.ZERO;
                BigDecimal totalConvert = BigDecimal.ZERO;
                
                if (data != null && data.containsKey("list")) {
                    for (Object item : data.getJSONArray("list")) {
                        JSONObject stat = (JSONObject) item;
                        
                        // 消耗金额
                        BigDecimal cost = stat.getBigDecimal("stat_cost");
                        if (cost != null) {
                            totalCost = totalCost.add(cost);
                        }
                        
                        // 展示次数
                        Long show = stat.getLong("show_cnt");
                        if (show != null) {
                            totalShow = totalShow.add(new BigDecimal(show));
                        }
                        
                        // 点击次数
                        Long click = stat.getLong("click_cnt");
                        if (click != null) {
                            totalClick = totalClick.add(new BigDecimal(click));
                        }
                        
                        // 转化次数
                        Long convert = stat.getLong("convert_cnt");
                        if (convert != null) {
                            totalConvert = totalConvert.add(new BigDecimal(convert));
                        }
                    }
                }
                
                summary.setTotalCost(totalCost);
                summary.setTotalShow(totalShow.longValue());
                summary.setTotalClick(totalClick.longValue());
                summary.setTotalConvert(totalConvert.longValue());
                summary.setSyncTime(LocalDateTime.now());
                
                // 计算ROI
                if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
                    // 假设转化价值 = 转化数 * 100（需要根据实际业务调整）
                    BigDecimal convertValue = totalConvert.multiply(new BigDecimal("100"));
                    summary.setRoi(convertValue.divide(totalCost, 2, BigDecimal.ROUND_HALF_UP));
                } else {
                    summary.setRoi(BigDecimal.ZERO);
                }
            }
        } catch (Exception e) {
            log.error("获取千川推广费用汇总失败: advertiserId={}, error={}", advertiserId, e.getMessage(), e);
        }
        
        return summary;
    }

    /**
     * 获取推广计划列表
     * 
     * @param advertiserId 广告主ID
     * @param accessToken 访问令牌
     * @param page 页码
     * @param pageSize 每页条数
     * @return 推广计划列表
     */
    public QianchuanCampaignListDTO getCampaignList(Long advertiserId, String accessToken, int page, int pageSize) {
        QianchuanCampaignListDTO result = new QianchuanCampaignListDTO();
        result.setCampaigns(new ArrayList<>());
        result.setTotal(0L);
        
        try {
            String url = apiUrl + "/2/ad/get/";
            Map<String, Object> params = new HashMap<>();
            params.put("advertiser_id", advertiserId);
            params.put("page", page);
            params.put("page_size", pageSize);
            
            JSONObject response = callApi(url, params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    result.setTotal(data.getLong("total_number"));
                    
                    if (data.containsKey("list")) {
                        for (Object item : data.getJSONArray("list")) {
                            JSONObject campaign = (JSONObject) item;
                            QianchuanCampaignDTO dto = new QianchuanCampaignDTO();
                            dto.setCampaignId(campaign.getLong("ad_id"));
                            dto.setCampaignName(campaign.getString("name"));
                            dto.setStatus(campaign.getString("status"));
                            dto.setBudget(campaign.getBigDecimal("budget"));
                            result.getCampaigns().add(dto);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取千川推广计划列表失败: advertiserId={}, error={}", advertiserId, e.getMessage(), e);
        }
        
        return result;
    }

    /**
     * 获取账户余额
     * 
     * @param advertiserId 广告主ID
     * @param accessToken 访问令牌
     * @return 账户余额
     */
    public BigDecimal getAccountBalance(Long advertiserId, String accessToken) {
        try {
            String url = apiUrl + "/2/advertiser/fund/get/";
            Map<String, Object> params = new HashMap<>();
            params.put("advertiser_id", advertiserId);
            
            JSONObject response = callApi(url, params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                if (data != null) {
                    BigDecimal balance = data.getBigDecimal("balance");
                    if (balance != null) {
                        return balance;
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取千川账户余额失败: advertiserId={}, error={}", advertiserId, e.getMessage(), e);
        }
        
        return BigDecimal.ZERO;
    }

    /**
     * 获取每日推广数据
     * 
     * @param advertiserId 广告主ID
     * @param accessToken 访问令牌
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 每日推广数据列表
     */
    public List<QianchuanDailyStatDTO> getDailyStats(Long advertiserId, String accessToken, LocalDate startDate, LocalDate endDate) {
        List<QianchuanDailyStatDTO> stats = new ArrayList<>();
        
        try {
            String url = apiUrl + "/2/report/advertiser/get/";
            Map<String, Object> params = new HashMap<>();
            params.put("advertiser_id", advertiserId);
            params.put("start_date", startDate.format(DATE_FORMATTER));
            params.put("end_date", endDate.format(DATE_FORMATTER));
            params.put("group_by", "[\"STAT_GROUP_BY_FIELD_STAT_TIME\"]");
            
            JSONObject response = callApi(url, params, accessToken);
            
            if (response != null && response.getInteger("code") == 0) {
                JSONObject data = response.getJSONObject("data");
                
                if (data != null && data.containsKey("list")) {
                    for (Object item : data.getJSONArray("list")) {
                        JSONObject stat = (JSONObject) item;
                        QianchuanDailyStatDTO dto = new QianchuanDailyStatDTO();
                        dto.setStatDate(stat.getString("stat_datetime"));
                        dto.setCost(stat.getBigDecimal("stat_cost"));
                        dto.setShowCount(stat.getLong("show_cnt"));
                        dto.setClickCount(stat.getLong("click_cnt"));
                        dto.setConvertCount(stat.getLong("convert_cnt"));
                        stats.add(dto);
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取千川每日推广数据失败: advertiserId={}, error={}", advertiserId, e.getMessage(), e);
        }
        
        return stats;
    }

    /**
     * 调用千川API
     * 
     * @param url API地址
     * @param params 请求参数
     * @param accessToken 访问令牌
     * @return 响应结果
     */
    private JSONObject callApi(String url, Map<String, Object> params, String accessToken) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            StringBuilder urlBuilder = new StringBuilder(url);
            urlBuilder.append("?");
            
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                urlBuilder.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
            }
            
            HttpGet httpGet = new HttpGet(urlBuilder.toString());
            httpGet.setHeader("Access-Token", accessToken);
            
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                return JSON.parseObject(responseBody);
            }
        } catch (Exception e) {
            log.error("调用千川API失败: url={}, error={}", url, e.getMessage(), e);
            return null;
        }
    }
}
