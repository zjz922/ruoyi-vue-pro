package cn.iocoder.yudao.module.finance.service;

import java.time.LocalDate;
import java.util.Map;

/**
 * 财务报表 Service 接口
 *
 * @author 闪电账PRO
 */
public interface ReportService {

    /**
     * 生成日报表
     *
     * @param shopId 店铺ID
     * @param reportDate 报表日期
     * @return 报表数据
     */
    Map<String, Object> generateDailyReport(Long shopId, LocalDate reportDate);

    /**
     * 生成周报表
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 报表数据
     */
    Map<String, Object> generateWeeklyReport(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 生成月报表
     *
     * @param shopId 店铺ID
     * @param year 年份
     * @param month 月份
     * @return 报表数据
     */
    Map<String, Object> generateMonthlyReport(Long shopId, Integer year, Integer month);

    /**
     * 获取订单统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单统计
     */
    Map<String, Object> getOrderStats(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取收支统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 收支统计
     */
    Map<String, Object> getIncomeExpenseStats(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取商品成本统计
     *
     * @param shopId 店铺ID
     * @return 商品成本统计
     */
    Map<String, Object> getProductCostStats(Long shopId);

    /**
     * 获取毛利分析
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 毛利分析
     */
    Map<String, Object> getGrossProfitAnalysis(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 导出报表
     *
     * @param shopId 店铺ID
     * @param reportType 报表类型
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 导出文件路径
     */
    String exportReport(Long shopId, String reportType, LocalDate startDate, LocalDate endDate);

}
