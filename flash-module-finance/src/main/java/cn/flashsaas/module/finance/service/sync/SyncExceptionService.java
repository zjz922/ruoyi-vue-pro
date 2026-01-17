package cn.flashsaas.module.finance.service.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;

import java.util.List;

/**
 * 同步异常 Service 接口
 */
public interface SyncExceptionService {

    /**
     * 获得同步异常
     *
     * @param id 编号
     * @return 同步异常
     */
    SyncExceptionRespVO getSyncException(Long id);

    /**
     * 获得同步异常分页
     *
     * @param pageReqVO 分页查询
     * @return 同步异常分页
     */
    PageResult<SyncExceptionRespVO> getSyncExceptionPage(SyncExceptionPageReqVO pageReqVO);

    /**
     * 重试同步异常
     *
     * @param id 编号
     */
    void retrySyncException(Long id);

    /**
     * 忽略同步异常
     *
     * @param id 编号
     */
    void ignoreSyncException(Long id);

    /**
     * 批量重试同步异常
     *
     * @param ids 编号列表
     */
    void batchRetrySyncException(List<Long> ids);

    /**
     * 批量忽略同步异常
     *
     * @param ids 编号列表
     */
    void batchIgnoreSyncException(List<Long> ids);
}
