package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.cashier.vo.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 出纳管理 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface CashierService {

    // ========== 原有接口 ==========

    /**
     * 获取出纳工作台数据
     */
    Map<String, Object> getDashboard(Long shopId);

    /**
     * 获取待处理事项
     */
    Map<String, Object> getPendingTasks(Long shopId);

    /**
     * 获取渠道列表
     */
    Map<String, Object> getChannels(Long shopId);

    /**
     * 配置渠道
     */
    void configChannel(Map<String, Object> reqVO);

    /**
     * 执行平台对账
     */
    Map<String, Object> executeReconciliation(Long shopId, LocalDate date, String platform);

    /**
     * 获取对账结果
     */
    Map<String, Object> getReconciliationResult(Long shopId, LocalDate checkDate);

    /**
     * 获取差异列表（分页）
     */
    PageResult<Map<String, Object>> getDifferencePage(Long shopId, LocalDate startDate, LocalDate endDate, 
            String status, Integer pageNo, Integer pageSize);

    /**
     * 处理差异
     */
    void handleDifference(Long diffId, String handleType, String remark);

    /**
     * 获取日报
     */
    Map<String, Object> getDailyReport(Long shopId, LocalDate date);

    /**
     * 获取月报
     */
    Map<String, Object> getMonthlyReport(Long shopId, Integer year, Integer month);

    /**
     * 获取店铺统计
     */
    Map<String, Object> getShopStat(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取预警列表
     */
    Map<String, Object> getAlerts(Long shopId, String status);

    /**
     * 配置预警规则
     */
    void configAlertRule(Map<String, Object> reqVO);

    /**
     * 获取资金流水汇总
     */
    Map<String, Object> getCashflowSummary(Long shopId, LocalDate startDate, LocalDate endDate);

    // ========== V2接口 - 租户端API ==========

    /**
     * 获取出纳仪表盘数据V2
     */
    CashierDashboardRespVO getDashboardV2(String shopId, String date);

    /**
     * 获取出纳概览V2
     */
    CashierOverviewRespVO getOverviewV2(String shopId, String month);

    /**
     * 获取日报数据V2
     */
    CashierDailyReportRespVO getDailyReportV2(String shopId, String date);

    /**
     * 获取月报数据V2
     */
    CashierMonthlyReportRespVO getMonthlyReportV2(String shopId, String month);

    /**
     * 获取店铺报表V2
     */
    CashierShopReportRespVO getShopReportV2(String shopId, String startDate, String endDate);

    /**
     * 获取银行对账列表V2
     */
    PageResult<CashierReconciliationVO> getReconciliationListV2(String shopId, String status, 
            String startDate, String endDate, Integer pageNum, Integer pageSize);

    /**
     * 执行银行对账匹配V2
     */
    Map<String, Object> executeReconciliationMatchV2(CashierReconciliationMatchReqVO reqVO);

    /**
     * 处理银行对账差异V2
     */
    Map<String, Object> resolveReconciliationV2(CashierReconciliationResolveReqVO reqVO);

    /**
     * 获取差异分析数据V2
     */
    CashierDifferencesRespVO getDifferencesV2(String shopId, String month);

    /**
     * 获取差异趋势V2
     */
    List<CashierDifferenceTrendVO> getDifferenceTrendV2(String shopId, Integer months);

    /**
     * 获取预警列表V2
     */
    PageResult<CashierAlertVO> getAlertsV2(String shopId, String status, String level, 
            Integer pageNum, Integer pageSize);

    /**
     * 处理预警V2
     */
    Map<String, Object> processAlertV2(CashierAlertProcessReqVO reqVO);

    /**
     * 标记预警已读V2
     */
    Map<String, Object> markAlertReadV2(CashierAlertMarkReadReqVO reqVO);

    /**
     * 获取预警规则列表V2
     */
    List<CashierAlertRuleVO> getAlertRulesV2(String shopId);

    /**
     * 创建预警规则V2
     */
    Map<String, Object> createAlertRuleV2(CashierAlertRuleCreateReqVO reqVO);

    /**
     * 更新预警规则V2
     */
    Map<String, Object> updateAlertRuleV2(Long id, CashierAlertRuleUpdateReqVO reqVO);

    /**
     * 删除预警规则V2
     */
    Map<String, Object> deleteAlertRuleV2(Long id);

    /**
     * 获取渠道列表V2
     */
    List<CashierChannelVO> getChannelsV2(String shopId);

    /**
     * 创建渠道V2
     */
    Map<String, Object> createChannelV2(CashierChannelCreateReqVO reqVO);

    /**
     * 更新渠道V2
     */
    Map<String, Object> updateChannelV2(Long id, CashierChannelUpdateReqVO reqVO);

    /**
     * 删除渠道V2
     */
    Map<String, Object> deleteChannelV2(Long id);

    /**
     * 获取渠道统计V2
     */
    List<CashierChannelStatsVO> getChannelStatsV2(String shopId, String month);

    /**
     * 导出出纳报表V2
     */
    Map<String, Object> exportReportV2(CashierExportReqVO reqVO);
}
