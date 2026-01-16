package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.ordersync.vo.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单同步 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface OrderSyncService {

    /**
     * 同步抖店订单
     *
     * @param shopId 店铺ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 同步结果
     */
    OrderSyncResultVO syncDoudianOrders(String shopId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 同步单个订单
     *
     * @param shopId 店铺ID
     * @param orderId 订单ID
     * @return 同步结果
     */
    OrderSyncResultVO syncSingleOrder(String shopId, String orderId);

    /**
     * 批量同步订单
     *
     * @param shopId 店铺ID
     * @param orderIds 订单ID列表
     * @return 同步结果
     */
    OrderSyncResultVO batchSyncOrders(String shopId, List<String> orderIds);

    /**
     * 获取同步状态
     *
     * @param shopId 店铺ID
     * @return 同步状态
     */
    SyncStatusVO getSyncStatus(String shopId);

    /**
     * 获取同步日志（分页）
     *
     * @param reqVO 分页请求
     * @return 同步日志列表
     */
    PageResult<SyncLogVO> getSyncLogs(SyncLogPageReqVO reqVO);

    /**
     * 重试失败的同步
     *
     * @param syncLogId 同步日志ID
     * @return 同步结果
     */
    OrderSyncResultVO retrySyncFailed(Long syncLogId);

    /**
     * 设置自动同步
     *
     * @param shopId 店铺ID
     * @param enabled 是否启用
     * @param intervalMinutes 同步间隔（分钟）
     */
    void setAutoSync(String shopId, Boolean enabled, Integer intervalMinutes);

    /**
     * 获取自动同步配置
     *
     * @param shopId 店铺ID
     * @return 自动同步配置
     */
    AutoSyncConfigVO getAutoSyncConfig(String shopId);

    /**
     * 获取同步统计
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步统计
     */
    SyncStatVO getSyncStat(String shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 清理同步日志
     *
     * @param shopId 店铺ID
     * @param beforeDays 清理多少天前的日志
     * @return 清理数量
     */
    Integer cleanSyncLogs(String shopId, Integer beforeDays);

}
