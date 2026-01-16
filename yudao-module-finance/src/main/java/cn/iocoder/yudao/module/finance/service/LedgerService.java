package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 总账管理 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerService {

    /**
     * 获取总账列表（分页）
     *
     * @param reqVO 分页请求
     * @return 总账列表
     */
    PageResult<LedgerVO> getLedgerPage(LedgerPageReqVO reqVO);

    /**
     * 获取财务核算数据
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 财务核算数据
     */
    AccountingVO getAccounting(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取资金流入流出
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 资金流入流出数据
     */
    FundsFlowVO getFundsFlow(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取库存成本
     *
     * @param shopId 店铺ID
     * @return 库存成本数据
     */
    InventoryCostVO getInventoryCost(Long shopId);

    /**
     * 获取销售分析
     *
     * @param shopId 店铺ID
     * @param dimension 分析维度（product/category/channel）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 销售分析数据
     */
    SalesAnalysisVO getSalesAnalysis(Long shopId, String dimension, LocalDate startDate, LocalDate endDate);

    /**
     * 获取费用统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 费用统计数据
     */
    ExpenseStatVO getExpenseStat(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取税务统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 税务统计数据
     */
    TaxStatVO getTaxStat(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取科目余额表
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 科目余额表数据
     */
    List<AccountBalanceVO> getAccountBalance(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取利润表
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 利润表数据
     */
    ProfitStatementVO getProfitStatement(Long shopId, LocalDate startDate, LocalDate endDate);

}
