package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapper;
import cn.iocoder.yudao.module.finance.dal.dataobject.ProductCostDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 商品成本 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface ProductCostMapper extends BaseMapper<ProductCostDO> {

}
