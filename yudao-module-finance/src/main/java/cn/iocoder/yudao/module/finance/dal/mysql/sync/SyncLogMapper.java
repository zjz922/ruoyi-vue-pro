package cn.iocoder.yudao.module.finance.dal.mysql.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.SyncLogPageReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncLogDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SyncLogMapper extends BaseMapperX<SyncLogDO> {

    default PageResult<SyncLogDO> selectPage(SyncLogPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<SyncLogDO>()
                .eqIfPresent(SyncLogDO::getTenantId, reqVO.getTenantId())
                .eqIfPresent(SyncLogDO::getPlatformType, reqVO.getPlatformType())
                .eqIfPresent(SyncLogDO::getResult, reqVO.getResult())
                .betweenIfPresent(SyncLogDO::getStartTime, reqVO.getStartTime(), reqVO.getEndTime())
                .orderByDesc(SyncLogDO::getId));
    }
}
