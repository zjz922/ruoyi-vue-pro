package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapper;
import cn.iocoder.yudao.module.finance.dal.dataobject.CashflowDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 资金流水 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface CashflowMapper extends BaseMapper<CashflowDO> {

}
