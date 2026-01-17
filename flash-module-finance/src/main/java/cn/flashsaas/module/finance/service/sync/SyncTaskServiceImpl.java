package cn.flashsaas.module.finance.service.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;
import cn.flashsaas.module.finance.convert.sync.SyncTaskConvert;
import cn.flashsaas.module.finance.dal.dataobject.sync.SyncTaskDO;
import cn.flashsaas.module.finance.dal.mysql.sync.SyncTaskMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.time.LocalDateTime;

import static cn.flashsaas.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.flashsaas.module.finance.enums.ErrorCodeConstants.SYNC_TASK_NOT_EXISTS;

/**
 * 同步任务 Service 实现类
 */
@Service
@Validated
public class SyncTaskServiceImpl implements SyncTaskService {

    @Resource
    private SyncTaskMapper syncTaskMapper;

    @Override
    public Long createSyncTask(SyncTaskCreateReqVO createReqVO) {
        SyncTaskDO syncTask = SyncTaskConvert.INSTANCE.convert(createReqVO);
        syncTaskMapper.insert(syncTask);
        return syncTask.getId();
    }

    @Override
    public void updateSyncTask(SyncTaskUpdateReqVO updateReqVO) {
        validateSyncTaskExists(updateReqVO.getId());
        SyncTaskDO updateObj = SyncTaskConvert.INSTANCE.convert(updateReqVO);
        syncTaskMapper.updateById(updateObj);
    }

    @Override
    public void deleteSyncTask(Long id) {
        validateSyncTaskExists(id);
        syncTaskMapper.deleteById(id);
    }

    private void validateSyncTaskExists(Long id) {
        if (syncTaskMapper.selectById(id) == null) {
            throw exception(SYNC_TASK_NOT_EXISTS);
        }
    }

    @Override
    public SyncTaskRespVO getSyncTask(Long id) {
        SyncTaskDO syncTask = syncTaskMapper.selectById(id);
        return SyncTaskConvert.INSTANCE.convert(syncTask);
    }

    @Override
    public PageResult<SyncTaskRespVO> getSyncTaskPage(SyncTaskPageReqVO pageReqVO) {
        PageResult<SyncTaskDO> pageResult = syncTaskMapper.selectPage(pageReqVO);
        return SyncTaskConvert.INSTANCE.convertPage(pageResult);
    }

    @Override
    public void executeSyncTask(Long id) {
        SyncTaskDO syncTask = syncTaskMapper.selectById(id);
        if (syncTask == null) {
            throw exception(SYNC_TASK_NOT_EXISTS);
        }
        // TODO: 调用实际的同步逻辑
        // 更新执行时间
        SyncTaskDO updateObj = new SyncTaskDO();
        updateObj.setId(id);
        updateObj.setLastExecuteTime(LocalDateTime.now());
        syncTaskMapper.updateById(updateObj);
    }
}
