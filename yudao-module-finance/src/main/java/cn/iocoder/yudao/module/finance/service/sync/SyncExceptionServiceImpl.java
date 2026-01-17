package cn.iocoder.yudao.module.finance.service.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.convert.sync.SyncExceptionConvert;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncExceptionDO;
import cn.iocoder.yudao.module.finance.dal.mysql.sync.SyncExceptionMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.finance.enums.ErrorCodeConstants.SYNC_EXCEPTION_NOT_EXISTS;

/**
 * 同步异常 Service 实现类
 */
@Service
@Validated
public class SyncExceptionServiceImpl implements SyncExceptionService {

    @Resource
    private SyncExceptionMapper syncExceptionMapper;

    @Override
    public SyncExceptionRespVO getSyncException(Long id) {
        SyncExceptionDO syncException = syncExceptionMapper.selectById(id);
        return SyncExceptionConvert.INSTANCE.convert(syncException);
    }

    @Override
    public PageResult<SyncExceptionRespVO> getSyncExceptionPage(SyncExceptionPageReqVO pageReqVO) {
        PageResult<SyncExceptionDO> pageResult = syncExceptionMapper.selectPage(pageReqVO);
        return SyncExceptionConvert.INSTANCE.convertPage(pageResult);
    }

    @Override
    public void retrySyncException(Long id) {
        SyncExceptionDO syncException = syncExceptionMapper.selectById(id);
        if (syncException == null) {
            throw exception(SYNC_EXCEPTION_NOT_EXISTS);
        }
        // TODO: 调用实际的重试逻辑
        // 更新状态
        SyncExceptionDO updateObj = new SyncExceptionDO();
        updateObj.setId(id);
        updateObj.setHandleStatus(1); // 已重试
        updateObj.setRetryCount(syncException.getRetryCount() + 1);
        updateObj.setLastRetryTime(LocalDateTime.now());
        syncExceptionMapper.updateById(updateObj);
    }

    @Override
    public void ignoreSyncException(Long id) {
        SyncExceptionDO syncException = syncExceptionMapper.selectById(id);
        if (syncException == null) {
            throw exception(SYNC_EXCEPTION_NOT_EXISTS);
        }
        SyncExceptionDO updateObj = new SyncExceptionDO();
        updateObj.setId(id);
        updateObj.setHandleStatus(2); // 已忽略
        syncExceptionMapper.updateById(updateObj);
    }

    @Override
    public void batchRetrySyncException(List<Long> ids) {
        for (Long id : ids) {
            try {
                retrySyncException(id);
            } catch (Exception ignored) {
                // 忽略单个失败
            }
        }
    }

    @Override
    public void batchIgnoreSyncException(List<Long> ids) {
        for (Long id : ids) {
            try {
                ignoreSyncException(id);
            } catch (Exception ignored) {
                // 忽略单个失败
            }
        }
    }
}
