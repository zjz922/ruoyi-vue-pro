package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapper;
import cn.iocoder.yudao.module.finance.dal.dataobject.SyncLogDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 数据同步日志 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface SyncLogMapper extends BaseMapper<SyncLogDO> {

}
