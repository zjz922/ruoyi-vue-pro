package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.mybatis.core.mapper.BaseMapper;
import cn.flashsaas.module.finance.dal.dataobject.OrderDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 订单 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface OrderMapper extends BaseMapper<OrderDO> {

}
