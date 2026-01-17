package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 总账管理 - 费用中心 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerExpenseService {

    /**
     * 获取费用概览
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 费用概览
     */
    ExpenseOverviewRespVO getOverview(String shopId, String month);

    /**
     * 获取多维度费用分摊
     *
     * @param shopId 店铺ID
     * @param dimension 维度
     * @param month 月份
     * @return 费用分摊
     */
    ExpenseAllocationRespVO getAllocation(String shopId, String dimension, String month);

    /**
     * 设置费用预算
     *
     * @param reqVO 预算请求
     * @return 设置结果
     */
    Map<String, Object> setBudget(ExpenseBudgetReqVO reqVO);

    /**
     * 录入费用
     *
     * @param reqVO 费用请求
     * @return 录入结果
     */
    Map<String, Object> createExpense(ExpenseCreateReqVO reqVO);

    /**
     * 获取异常费用列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @return 异常费用列表
     */
    List<ExpenseAnomalyVO> getAnomalies(String shopId, String status);

    /**
     * 确认异常费用
     *
     * @param reqVO 确认请求
     * @return 确认结果
     */
    Map<String, Object> confirmAnomaly(ExpenseConfirmAnomalyReqVO reqVO);

    /**
     * 审批费用
     *
     * @param reqVO 审批请求
     * @return 审批结果
     */
    Map<String, Object> approveExpense(ExpenseApproveReqVO reqVO);

    /**
     * 获取费用明细
     *
     * @param shopId 店铺ID
     * @param category 费用类别
     * @param status 状态
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 费用明细
     */
    PageResult<ExpenseDetailVO> getDetails(String shopId, String category, String status, 
            String startDate, String endDate, Integer pageNum, Integer pageSize);

    /**
     * 导出费用报表
     *
     * @param reqVO 导出请求
     * @return 导出结果
     */
    Map<String, Object> exportExpense(ExpenseExportReqVO reqVO);

    /**
     * 获取预算预警
     *
     * @param shopId 店铺ID
     * @return 预算预警
     */
    List<ExpenseBudgetAlertVO> getBudgetAlerts(String shopId);

    /**
     * 获取预算执行趋势
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 预算执行趋势
     */
    List<ExpenseBudgetTrendVO> getBudgetTrend(String shopId, String month);
}
