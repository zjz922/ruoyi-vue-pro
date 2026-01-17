package cn.iocoder.yudao.module.finance.convert.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncExceptionDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SyncExceptionConvert {

    SyncExceptionConvert INSTANCE = Mappers.getMapper(SyncExceptionConvert.class);

    SyncExceptionRespVO convert(SyncExceptionDO bean);

    PageResult<SyncExceptionRespVO> convertPage(PageResult<SyncExceptionDO> page);
}
