package cn.iocoder.yudao.module.finance.dal.mysql.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.SyncExceptionPageReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncExceptionDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SyncExceptionMapper extends BaseMapperX<SyncExceptionDO> {

    default PageResult<SyncExceptionDO> selectPage(SyncExceptionPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<SyncExceptionDO>()
                .eqIfPresent(SyncExceptionDO::getTenantId, reqVO.getTenantId())
                .eqIfPresent(SyncExceptionDO::getPlatformType, reqVO.getPlatformType())
                .eqIfPresent(SyncExceptionDO::getExceptionType, reqVO.getExceptionType())
                .eqIfPresent(SyncExceptionDO::getHandleStatus, reqVO.getHandleStatus())
                .orderByDesc(SyncExceptionDO::getId));
    }
}
