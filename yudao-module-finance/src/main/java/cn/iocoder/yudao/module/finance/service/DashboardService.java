package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.module.finance.controller.admin.dashboard.vo.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 经营概览 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface DashboardService {

    /**
     * 获取经营概览数据
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 经营概览数据
     */
    DashboardOverviewVO getOverview(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取销售趋势
     *
     * @param shopId 店铺ID
     * @param period 周期（day/week/month）
     * @param days 天数
     * @return 销售趋势数据
     */
    List<SalesTrendVO> getSalesTrend(Long shopId, String period, Integer days);

    /**
     * 获取商品销售排行
     *
     * @param shopId 店铺ID
     * @param limit 数量限制
     * @return 商品排行数据
     */
    List<ProductRankVO> getProductRank(Long shopId, Integer limit);

    /**
     * 获取订单状态统计
     *
     * @param shopId 店铺ID
     * @return 订单状态统计
     */
    OrderStatusStatVO getOrderStatusStat(Long shopId);

    /**
     * 获取资金概览
     *
     * @param shopId 店铺ID
     * @return 资金概览数据
     */
    FundOverviewVO getFundOverview(Long shopId);

    /**
     * 获取利润分析
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 利润分析数据
     */
    ProfitAnalysisVO getProfitAnalysis(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取实时数据
     *
     * @param shopId 店铺ID
     * @return 实时数据
     */
    RealtimeDataVO getRealtimeData(Long shopId);

}
