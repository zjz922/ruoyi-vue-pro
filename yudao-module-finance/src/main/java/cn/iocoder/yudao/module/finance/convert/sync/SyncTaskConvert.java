package cn.iocoder.yudao.module.finance.convert.sync;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.sync.SyncTaskDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SyncTaskConvert {

    SyncTaskConvert INSTANCE = Mappers.getMapper(SyncTaskConvert.class);

    SyncTaskDO convert(SyncTaskCreateReqVO bean);

    SyncTaskDO convert(SyncTaskUpdateReqVO bean);

    SyncTaskRespVO convert(SyncTaskDO bean);

    PageResult<SyncTaskRespVO> convertPage(PageResult<SyncTaskDO> page);
}
