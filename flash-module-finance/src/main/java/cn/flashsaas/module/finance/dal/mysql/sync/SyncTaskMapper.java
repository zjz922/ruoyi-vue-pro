package cn.flashsaas.module.finance.dal.mysql.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.controller.admin.sync.vo.SyncTaskPageReqVO;
import cn.flashsaas.module.finance.dal.dataobject.sync.SyncTaskDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SyncTaskMapper extends BaseMapperX<SyncTaskDO> {

    default PageResult<SyncTaskDO> selectPage(SyncTaskPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<SyncTaskDO>()
                .eqIfPresent(SyncTaskDO::getTenantId, reqVO.getTenantId())
                .likeIfPresent(SyncTaskDO::getTaskName, reqVO.getTaskName())
                .eqIfPresent(SyncTaskDO::getPlatformType, reqVO.getPlatformType())
                .eqIfPresent(SyncTaskDO::getStatus, reqVO.getStatus())
                .orderByDesc(SyncTaskDO::getId));
    }
}
