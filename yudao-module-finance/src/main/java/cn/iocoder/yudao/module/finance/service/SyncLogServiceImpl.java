package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.finance.controller.admin.synclog.vo.SyncLogCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.synclog.vo.SyncLogPageReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.SyncLogDO;
import cn.iocoder.yudao.module.finance.dal.mysql.SyncLogMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 数据同步日志 Service 实现类
 *
 * @author 闪电账PRO
 */
@Service
public class SyncLogServiceImpl implements SyncLogService {

    @Resource
    private SyncLogMapper syncLogMapper;

    @Override
    @Transactional
    public Long createSyncLog(@Valid SyncLogCreateReqVO createReqVO) {
        SyncLogDO syncLog = BeanUtils.toBean(createReqVO, SyncLogDO.class);
        syncLogMapper.insert(syncLog);
        return syncLog.getId();
    }

    @Override
    public SyncLogDO getSyncLog(Long id) {
        return syncLogMapper.selectById(id);
    }

    @Override
    public PageResult<SyncLogDO> getSyncLogPage(SyncLogPageReqVO pageReqVO) {
        LambdaQueryWrapper<SyncLogDO> queryWrapper = Wrappers.lambdaQuery(SyncLogDO.class)
                .eq(pageReqVO.getShopId() != null, SyncLogDO::getShopId, pageReqVO.getShopId())
                .eq(pageReqVO.getSyncType() != null, SyncLogDO::getSyncType, pageReqVO.getSyncType())
                .eq(pageReqVO.getDataSource() != null, SyncLogDO::getDataSource, pageReqVO.getDataSource())
                .eq(pageReqVO.getSyncStatus() != null, SyncLogDO::getSyncStatus, pageReqVO.getSyncStatus())
                .orderByDesc(SyncLogDO::getCreateTime);
        
        return syncLogMapper.selectPage(pageReqVO, queryWrapper);
    }

}
