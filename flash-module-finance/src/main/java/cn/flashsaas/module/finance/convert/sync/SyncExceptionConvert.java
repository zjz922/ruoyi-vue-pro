package cn.flashsaas.module.finance.convert.sync;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.sync.SyncExceptionDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SyncExceptionConvert {

    SyncExceptionConvert INSTANCE = Mappers.getMapper(SyncExceptionConvert.class);

    SyncExceptionRespVO convert(SyncExceptionDO bean);

    PageResult<SyncExceptionRespVO> convertPage(PageResult<SyncExceptionDO> page);
}
