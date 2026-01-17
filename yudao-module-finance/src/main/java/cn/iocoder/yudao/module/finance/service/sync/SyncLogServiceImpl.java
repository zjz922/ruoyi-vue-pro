package cn.iocoder.yudao.module.finance.service.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.convert.sync.SyncLogConvert;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncLogDO;
import cn.iocoder.yudao.module.finance.dal.mysql.sync.SyncLogMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.finance.enums.ErrorCodeConstants.SYNC_LOG_NOT_EXISTS;

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
