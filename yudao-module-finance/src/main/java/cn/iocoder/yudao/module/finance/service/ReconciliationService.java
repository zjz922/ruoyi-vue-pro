package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.reconciliation.vo.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 对账管理 Service 接口
 *
 * @author 闪电账PRO
 */
public interface ReconciliationService {

    // ========== 原有接口 ==========

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

    // ========== 新增接口 - 勾稽仪表盘 ==========

    /**
     * 获取勾稽仪表盘数据
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 仪表盘数据
     */
    ReconciliationDashboardRespVO getDashboard(String shopId, String month);

    /**
     * 获取订单勾稽列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单勾稽列表
     */
    PageResult<ReconciliationOrderVO> getOrders(String shopId, String status, String startDate, 
            String endDate, Integer pageNum, Integer pageSize);

    /**
     * 获取成本勾稽列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 成本勾稽列表
     */
    PageResult<ReconciliationCostVO> getCosts(String shopId, String status, Integer pageNum, Integer pageSize);

    /**
     * 获取库存勾稽列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 库存勾稽列表
     */
    PageResult<ReconciliationInventoryVO> getInventory(String shopId, String status, Integer pageNum, Integer pageSize);

    /**
     * 获取推广费用勾稽列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 推广费用勾稽列表
     */
    PageResult<ReconciliationPromotionVO> getPromotion(String shopId, String status, Integer pageNum, Integer pageSize);

    /**
     * 获取日度勾稽统计
     *
     * @param shopId 店铺ID
     * @param month 月份
     * @return 日度统计列表
     */
    List<ReconciliationDailyStatsVO> getDailyStats(String shopId, String month);

    /**
     * 执行勾稽匹配
     *
     * @param reqVO 匹配请求
     * @return 匹配结果
     */
    Map<String, Object> executeMatch(ReconciliationMatchReqVO reqVO);

    /**
     * 处理勾稽差异
     *
     * @param reqVO 处理请求
     * @return 处理结果
     */
    Map<String, Object> resolveDifference(ReconciliationResolveReqVO reqVO);

    /**
     * 获取勾稽规则
     *
     * @param shopId 店铺ID
     * @return 规则列表
     */
    List<ReconciliationRuleVO> getRules(String shopId);

    /**
     * 保存勾稽规则
     *
     * @param reqVO 规则
     * @return 保存结果
     */
    Map<String, Object> saveRule(ReconciliationRuleVO reqVO);

    /**
     * 导出勾稽报表
     *
     * @param reqVO 导出请求
     * @return 导出结果
     */
    Map<String, Object> exportReconciliation(ReconciliationExportReqVO reqVO);
}

    // ========== 管理员端对账方法 ==========

    /**
     * 获取对账总览数据
     */
    Map<String, Object> getReconciliationOverview();

    /**
     * 发起对账任务
     */
    Long startReconciliationTask(Map<String, Object> params);

    /**
     * 获取对账进度
     */
    Map<String, Object> getReconciliationProgress();

    /**
     * 获取差异详情
     */
    Map<String, Object> getDiffDetail(Long id);

    /**
     * 处理差异
     */
    void handleDiff(Map<String, Object> params);

    /**
     * 批量处理差异
     */
    void batchHandleDiff(Map<String, Object> params);

    /**
     * 获取异常分页列表
     */
    Map<String, Object> getExceptionPage(Integer pageNo, Integer pageSize, String exceptionType, 
            Integer handleStatus, String startDate, String endDate);

    /**
     * 获取异常统计数据
     */
    Map<String, Object> getExceptionStatistics();

    /**
     * 处理异常
     */
    void handleException(Map<String, Object> params);
