package cn.flashsaas.module.finance.convert.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.sync.SyncLogDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SyncLogConvert {

    SyncLogConvert INSTANCE = Mappers.getMapper(SyncLogConvert.class);

    SyncLogRespVO convert(SyncLogDO bean);

    PageResult<SyncLogRespVO> convertPage(PageResult<SyncLogDO> page);
}
