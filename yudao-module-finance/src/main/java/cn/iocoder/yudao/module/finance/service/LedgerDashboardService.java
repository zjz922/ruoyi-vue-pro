package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;

import java.util.List;

/**
 * 总账管理 - 经营概览 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerDashboardService {

    /**
     * 获取经营概览数据
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 经营概览数据
     */
    DashboardOverviewRespVO getOverview(String shopId, String startDate, String endDate);

    /**
     * 获取KPI数据
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return KPI数据
     */
    DashboardKpiRespVO getKpi(String shopId, String startDate, String endDate);

    /**
     * 获取趋势数据
     *
     * @param shopId 店铺ID
     * @param days 天数
     * @return 趋势数据
     */
    List<DashboardTrendItemVO> getTrends(String shopId, Integer days);

    /**
     * 获取费用分布
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 费用分布
     */
    List<DashboardExpenseItemVO> getExpenseBreakdown(String shopId, String month);
}
