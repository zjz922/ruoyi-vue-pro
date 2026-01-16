package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapper;
import cn.iocoder.yudao.module.finance.dal.dataobject.OrderDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 订单 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface OrderMapper extends BaseMapper<OrderDO> {

}
