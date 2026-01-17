package cn.flashsaas.module.finance.service;

import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 总账管理 - 经营分析 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerAnalysisService {

    /**
     * 获取ROI分析数据
     *
     * @param shopId 店铺ID
     * @param dateRange 日期范围
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return ROI分析数据
     */
    AnalysisRoiRespVO getRoi(String shopId, String dateRange, String startDate, String endDate);

    /**
     * 获取盈亏平衡分析
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 盈亏平衡分析
     */
    AnalysisBreakEvenRespVO getBreakEven(String shopId, String month);

    /**
     * 获取利润贡献分析
     *
     * @param shopId 店铺ID
     * @param dimension 维度
     * @return 利润贡献分析
     */
    List<AnalysisProfitContributionVO> getProfitContribution(String shopId, String dimension);

    /**
     * 导出经营分析报告
     *
     * @param reqVO 导出请求
     * @return 导出结果
     */
    Map<String, Object> exportAnalysis(AnalysisExportReqVO reqVO);

    /**
     * 获取渠道ROI分析
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 渠道ROI分析
     */
    List<AnalysisChannelRoiVO> getChannelRoi(String shopId, String startDate, String endDate);

    /**
     * 获取ROI趋势
     *
     * @param shopId 店铺ID
     * @param days 天数
     * @return ROI趋势
     */
    List<AnalysisRoiTrendVO> getRoiTrend(String shopId, Integer days);

    /**
     * 获取本量利分析
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 本量利分析
     */
    AnalysisCvpRespVO getCvp(String shopId, String month);

    /**
     * 获取敏感性分析
     *
     * @param shopId 店铺ID
     * @param variable 变量
     * @return 敏感性分析
     */
    AnalysisSensitivityRespVO getSensitivity(String shopId, String variable);
}
