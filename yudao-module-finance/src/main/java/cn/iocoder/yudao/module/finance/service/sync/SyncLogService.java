package cn.iocoder.yudao.module.finance.service.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;

/**
 * 同步日志 Service 接口
 */
public interface SyncLogService {

    /**
     * 获得同步日志
     *
     * @param id 编号
     * @return 同步日志
     */
    SyncLogRespVO getSyncLog(Long id);

    /**
     * 获得同步日志分页
     *
     * @param pageReqVO 分页查询
     * @return 同步日志分页
     */
    PageResult<SyncLogRespVO> getSyncLogPage(SyncLogPageReqVO pageReqVO);

    /**
     * 删除同步日志
     *
     * @param id 编号
     */
    void deleteSyncLog(Long id);
}
