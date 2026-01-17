package cn.iocoder.yudao.module.finance.dal.mysql.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.SyncTaskPageReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncTaskDO;
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
