package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.synclog.vo.SyncLogCreateReqVO;
import cn.flashsaas.module.finance.controller.admin.synclog.vo.SyncLogPageReqVO;
import cn.flashsaas.module.finance.dal.dataobject.SyncLogDO;

import javax.validation.Valid;

/**
 * 数据同步日志 Service 接口
 *
 * @author 闪电账PRO
 */
public interface SyncLogService {

    /**
     * 创建同步日志
     *
     * @param createReqVO 创建信息
     * @return 同步日志ID
     */
    Long createSyncLog(@Valid SyncLogCreateReqVO createReqVO);

    /**
     * 获取同步日志
     *
     * @param id 同步日志ID
     * @return 同步日志
     */
    SyncLogDO getSyncLog(Long id);

    /**
     * 获取同步日志分页
     *
     * @param pageReqVO 分页请求
     * @return 同步日志分页
     */
    PageResult<SyncLogDO> getSyncLogPage(SyncLogPageReqVO pageReqVO);

}
