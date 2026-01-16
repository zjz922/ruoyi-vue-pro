package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.cashier.vo.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 出纳管理 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface CashierService {

    /**
     * 获取出纳工作台数据
     *
     * @param shopId 店铺ID
     * @return 出纳工作台数据
     */
    CashierDashboardVO getDashboard(Long shopId);

    /**
     * 获取待处理事项
     *
     * @param shopId 店铺ID
     * @return 待处理事项列表
     */
    List<PendingTaskVO> getPendingTasks(Long shopId);

    /**
     * 获取渠道列表
     *
     * @param shopId 店铺ID
     * @return 渠道列表
     */
    List<ChannelVO> getChannels(Long shopId);

    /**
     * 配置渠道
     *
     * @param reqVO 渠道配置请求
     */
    void configChannel(ChannelConfigReqVO reqVO);

    /**
     * 执行平台对账
     *
     * @param shopId 店铺ID
     * @param date 对账日期
     * @param platform 平台
     * @return 对账结果
     */
    ReconciliationResultVO executeReconciliation(Long shopId, LocalDate date, String platform);

    /**
     * 获取差异列表（分页）
     *
     * @param reqVO 分页请求
     * @return 差异列表
     */
    PageResult<DifferenceVO> getDifferences(DifferencePageReqVO reqVO);

    /**
     * 处理差异
     *
     * @param diffId 差异ID
     * @param handleType 处理类型
     * @param remark 备注
     */
    void handleDifference(Long diffId, String handleType, String remark);

    /**
     * 生成日报
     *
     * @param shopId 店铺ID
     * @param date 日期
     * @return 日报数据
     */
    DailyReportVO generateDailyReport(Long shopId, LocalDate date);

    /**
     * 生成月报
     *
     * @param shopId 店铺ID
     * @param year 年份
     * @param month 月份
     * @return 月报数据
     */
    MonthlyReportVO generateMonthlyReport(Long shopId, Integer year, Integer month);

    /**
     * 获取店铺统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 店铺统计数据
     */
    ShopStatVO getShopStat(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取预警列表
     *
     * @param shopId 店铺ID
     * @return 预警列表
     */
    List<AlertVO> getAlerts(Long shopId);

    /**
     * 配置预警规则
     *
     * @param reqVO 预警规则配置请求
     */
    void configAlertRule(AlertRuleConfigReqVO reqVO);

    /**
     * 获取资金流水汇总
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 资金流水汇总
     */
    CashflowSummaryVO getCashflowSummary(Long shopId, LocalDate startDate, LocalDate endDate);

}
