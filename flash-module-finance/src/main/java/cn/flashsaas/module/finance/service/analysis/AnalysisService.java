package cn.flashsaas.module.finance.service.analysis;

import java.util.Map;

/**
 * 经营分析 Service 接口
 *
 * @author 闪电账PRO
 */
public interface AnalysisService {

    // ==================== 运营仪表盘 ====================

    /**
     * 获取仪表盘数据
     */
    Map<String, Object> getDashboard();

    /**
     * 获取实时数据
     */
    Map<String, Object> getRealtimeData();

    /**
     * 获取健康度评分
     */
    Map<String, Object> getHealthScore();

    // ==================== 租户活跃度分析 ====================

    /**
     * 获取租户活跃度数据
     */
    Map<String, Object> getTenantActive(String startDate, String endDate);

    /**
     * 获取留存分析数据
     */
    Map<String, Object> getTenantRetention(String startDate, String endDate);

    /**
     * 获取租户分布数据
     */
    Map<String, Object> getTenantDistribution();

    // ==================== 收入分析 ====================

    /**
     * 获取收入概览数据
     */
    Map<String, Object> getRevenueOverview(String startDate, String endDate, String granularity);

    /**
     * 获取收入趋势数据
     */
    Map<String, Object> getRevenueTrend(String startDate, String endDate, String granularity);

    /**
     * 获取收入构成数据
     */
    Map<String, Object> getRevenueComposition(String startDate, String endDate);

    /**
     * 获取ARPU分析数据
     */
    Map<String, Object> getArpuData(String startDate, String endDate);

    // ==================== 趋势分析 ====================

    /**
     * 获取用户增长趋势
     */
    Map<String, Object> getUserGrowthTrend(String startDate, String endDate, String granularity);

    /**
     * 获取数据量趋势
     */
    Map<String, Object> getDataVolumeTrend(String startDate, String endDate, String granularity);

    /**
     * 获取使用趋势
     */
    Map<String, Object> getUsageTrend(String startDate, String endDate);

    /**
     * 获取趋势预测
     */
    Map<String, Object> getTrendForecast();
}
