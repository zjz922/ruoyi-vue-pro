package cn.iocoder.yudao.module.finance.convert.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncLogDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SyncLogConvert {

    SyncLogConvert INSTANCE = Mappers.getMapper(SyncLogConvert.class);

    SyncLogRespVO convert(SyncLogDO bean);

    PageResult<SyncLogRespVO> convertPage(PageResult<SyncLogDO> page);
}
