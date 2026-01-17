package cn.flashsaas.module.finance.service;

import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 总账管理 - 税务管理 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerTaxService {

    /**
     * 获取税务概览
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 税务概览
     */
    TaxOverviewRespVO getOverview(String shopId, String month);

    /**
     * 获取风险预警列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @return 风险预警列表
     */
    List<TaxRiskVO> getRisks(String shopId, String status);

    /**
     * 获取申报日历
     *
     * @param shopId 店铺ID
     * @param year 年份
     * @return 申报日历
     */
    List<TaxDeclarationVO> getDeclarations(String shopId, Integer year);

    /**
     * 设置税务预警规则
     *
     * @param reqVO 配置请求
     * @return 设置结果
     */
    Map<String, Object> setAlertConfig(TaxAlertConfigReqVO reqVO);

    /**
     * 忽略风险预警
     *
     * @param reqVO 忽略请求
     * @return 忽略结果
     */
    Map<String, Object> ignoreRisk(TaxIgnoreRiskReqVO reqVO);

    /**
     * 获取发票统计
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 发票统计
     */
    TaxInvoiceStatsRespVO getInvoiceStats(String shopId, String month);

    /**
     * 生成税务报表
     *
     * @param reqVO 报表请求
     * @return 生成结果
     */
    Map<String, Object> generateReport(TaxReportReqVO reqVO);

    /**
     * 获取税负率趋势
     *
     * @param shopId 店铺ID
     * @param months 月数
     * @return 税负率趋势
     */
    List<TaxBurdenTrendVO> getBurdenTrend(String shopId, Integer months);

    /**
     * 获取可抵扣项目
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 可抵扣项目
     */
    List<TaxDeductionItemVO> getDeductionItems(String shopId, String month);
}
