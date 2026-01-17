package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;

import java.util.List;

/**
 * 数据同步 Service 接口
 */
public interface SyncService {

    // ==================== 同步任务 ====================

    /**
     * 获得同步任务分页
     */
    PageResult<SyncTaskVO> getSyncTaskPage(SyncTaskQueryVO queryVO);

    /**
     * 获得同步任务详情
     */
    SyncTaskVO getSyncTask(Long id);

    /**
     * 创建同步任务
     */
    Long createSyncTask(SyncTaskCreateVO createVO);

    /**
     * 更新同步任务
     */
    void updateSyncTask(SyncTaskUpdateVO updateVO);

    /**
     * 删除同步任务
     */
    void deleteSyncTask(Long id);

    /**
     * 立即执行同步任务
     */
    void executeSyncTask(Long id);

    // ==================== 同步日志 ====================

    /**
     * 获得同步日志分页
     */
    PageResult<SyncLogVO> getSyncLogPage(SyncLogQueryVO queryVO);

    /**
     * 获得同步日志详情
     */
    SyncLogVO getSyncLog(Long id);

    /**
     * 删除同步日志
     */
    void deleteSyncLog(Long id);

    // ==================== 同步异常 ====================

    /**
     * 获得同步异常分页
     */
    PageResult<SyncExceptionVO> getSyncExceptionPage(SyncExceptionQueryVO queryVO);

    /**
     * 获得同步异常详情
     */
    SyncExceptionVO getSyncException(Long id);

    /**
     * 重试同步异常
     */
    void retrySyncException(Long id);

    /**
     * 忽略同步异常
     */
    void ignoreSyncException(Long id);

    /**
     * 批量重试同步异常
     */
    void batchRetrySyncException(List<Long> ids);

    /**
     * 批量忽略同步异常
     */
    void batchIgnoreSyncException(List<Long> ids);
}
