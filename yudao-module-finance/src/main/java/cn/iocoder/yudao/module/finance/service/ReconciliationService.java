package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.reconciliation.vo.ReconciliationPageReqVO;

import java.time.LocalDate;
import java.util.Map;

/**
 * 对账管理 Service 接口
 *
 * @author 闪电账PRO
 */
public interface ReconciliationService {

    /**
     * 执行自动对账
     *
     * @param shopId 店铺ID
     * @param reconciliationDate 对账日期
     * @return 对账结果
     */
    Map<String, Object> autoReconciliation(Long shopId, LocalDate reconciliationDate);

    /**
     * 执行手动对账
     *
     * @param shopId 店铺ID
     * @param platform 平台
     * @param reconciliationDate 对账日期
     * @return 对账结果
     */
    Map<String, Object> manualReconciliation(Long shopId, String platform, LocalDate reconciliationDate);

    /**
     * 获取对账差异列表
     *
     * @param pageReqVO 分页请求
     * @return 对账差异列表
     */
    PageResult<Map<String, Object>> getDiffList(ReconciliationPageReqVO pageReqVO);

    /**
     * 处理对账差异
     *
     * @param diffId 差异ID
     * @param reason 处理原因
     * @return 是否成功
     */
    Boolean processDiff(Long diffId, String reason);

    /**
     * 获取对账统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 对账统计
     */
    Map<String, Object> getReconciliationStats(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取对账详情
     *
     * @param shopId 店铺ID
     * @param platform 平台
     * @param reconciliationDate 对账日期
     * @return 对账详情
     */
    Map<String, Object> getReconciliationDetail(Long shopId, String platform, LocalDate reconciliationDate);

}
