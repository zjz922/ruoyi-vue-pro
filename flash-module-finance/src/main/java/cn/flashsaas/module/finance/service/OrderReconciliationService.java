package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.order.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 订单对账 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface OrderReconciliationService {

    /**
     * 获取订单对账概览
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单对账概览
     */
    OrderReconciliationOverviewRespVO getOverview(String shopId, String startDate, String endDate);

    /**
     * 同步订单数据
     *
     * @param reqVO 同步请求
     * @return 同步结果
     */
    Map<String, Object> syncOrders(OrderSyncReqVO reqVO);

    /**
     * 订单对比分析
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 对比结果
     */
    OrderCompareRespVO compareOrders(String shopId, String startDate, String endDate);

    /**
     * 获取差异订单列表
     *
     * @param shopId 店铺ID
     * @param type 差异类型
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 差异订单列表
     */
    PageResult<OrderDifferenceVO> getDifferences(String shopId, String type, String status, 
            Integer pageNum, Integer pageSize);

    /**
     * 处理差异订单
     *
     * @param reqVO 处理请求
     * @return 处理结果
     */
    Map<String, Object> resolveDifference(OrderResolveReqVO reqVO);

    /**
     * 获取月度订单统计
     *
     * @param shopId 店铺ID
     * @param year 年份
     * @return 月度统计列表
     */
    List<OrderMonthlyStatsVO> getMonthlyStats(String shopId, Integer year);

    /**
     * 获取年度订单统计
     *
     * @param shopId 店铺ID
     * @param year 年份
     * @return 年度统计
     */
    OrderYearlyStatsRespVO getYearlyStats(String shopId, Integer year);

    /**
     * 获取日度订单统计
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 日度统计列表
     */
    List<OrderDailyStatsVO> getDailyStats(String shopId, String month);

    /**
     * 导出订单对账报表
     *
     * @param reqVO 导出请求
     * @return 导出结果
     */
    Map<String, Object> exportReconciliation(OrderExportReqVO reqVO);

    /**
     * 获取同步状态
     *
     * @param shopId 店铺ID
     * @return 同步状态
     */
    OrderSyncStatusRespVO getSyncStatus(String shopId);
}
