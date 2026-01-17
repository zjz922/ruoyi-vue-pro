package cn.flashsaas.module.finance.service.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;

/**
 * 同步任务 Service 接口
 */
public interface SyncTaskService {

    /**
     * 创建同步任务
     *
     * @param createReqVO 创建信息
     * @return 编号
     */
    Long createSyncTask(SyncTaskCreateReqVO createReqVO);

    /**
     * 更新同步任务
     *
     * @param updateReqVO 更新信息
     */
    void updateSyncTask(SyncTaskUpdateReqVO updateReqVO);

    /**
     * 删除同步任务
     *
     * @param id 编号
     */
    void deleteSyncTask(Long id);

    /**
     * 获得同步任务
     *
     * @param id 编号
     * @return 同步任务
     */
    SyncTaskRespVO getSyncTask(Long id);

    /**
     * 获得同步任务分页
     *
     * @param pageReqVO 分页查询
     * @return 同步任务分页
     */
    PageResult<SyncTaskRespVO> getSyncTaskPage(SyncTaskPageReqVO pageReqVO);

    /**
     * 立即执行同步任务
     *
     * @param id 编号
     */
    void executeSyncTask(Long id);
}
