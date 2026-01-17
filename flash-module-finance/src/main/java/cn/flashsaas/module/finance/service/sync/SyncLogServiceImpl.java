package cn.flashsaas.module.finance.service.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;
import cn.flashsaas.module.finance.convert.sync.SyncLogConvert;
import cn.flashsaas.module.finance.dal.dataobject.sync.SyncLogDO;
import cn.flashsaas.module.finance.dal.mysql.sync.SyncLogMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;

import static cn.flashsaas.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.flashsaas.module.finance.enums.ErrorCodeConstants.SYNC_LOG_NOT_EXISTS;

/**
 * 同步日志 Service 实现类
 */
@Service
@Validated
public class SyncLogServiceImpl implements SyncLogService {

    @Resource
    private SyncLogMapper syncLogMapper;

    @Override
    public SyncLogRespVO getSyncLog(Long id) {
        SyncLogDO syncLog = syncLogMapper.selectById(id);
        return SyncLogConvert.INSTANCE.convert(syncLog);
    }

    @Override
    public PageResult<SyncLogRespVO> getSyncLogPage(SyncLogPageReqVO pageReqVO) {
        PageResult<SyncLogDO> pageResult = syncLogMapper.selectPage(pageReqVO);
        return SyncLogConvert.INSTANCE.convertPage(pageResult);
    }

    @Override
    public void deleteSyncLog(Long id) {
        if (syncLogMapper.selectById(id) == null) {
            throw exception(SYNC_LOG_NOT_EXISTS);
        }
        syncLogMapper.deleteById(id);
    }
}
