package cn.flashsaas.module.finance.service;

import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 总账管理 - 财务核算 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerAccountingService {

    /**
     * 获取财务核算报表
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @param reportType 报表类型
     * @return 财务核算报表
     */
    AccountingReportRespVO getReport(String shopId, String month, String reportType);

    /**
     * 获取利润表
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 利润表
     */
    List<IncomeStatementItemVO> getIncomeStatement(String shopId, String month);

    /**
     * 获取资产负债表
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 资产负债表
     */
    BalanceSheetRespVO getBalanceSheet(String shopId, String month);

    /**
     * 获取现金流量表
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 现金流量表
     */
    List<CashFlowCategoryVO> getCashFlowStatement(String shopId, String month);

    /**
     * 导出财务报表
     *
     * @param reqVO 导出请求
     * @return 导出结果
     */
    Map<String, Object> exportReport(AccountingExportReqVO reqVO);

    /**
     * 获取日报数据
     *
     * @param shopId 店铺ID
     * @param date 日期
     * @return 日报数据
     */
    DailyReportRespVO getDailyReport(String shopId, String date);

    /**
     * 获取收入分类数据
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 收入分类数据
     */
    List<RevenueTypeItemVO> getRevenueByType(String shopId, String month);

    /**
     * 获取退款分析数据
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 退款分析数据
     */
    RefundAnalysisRespVO getRefundAnalysis(String shopId, String startDate, String endDate);
}
