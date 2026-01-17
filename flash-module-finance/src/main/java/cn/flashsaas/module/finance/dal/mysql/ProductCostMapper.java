package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.mybatis.core.mapper.BaseMapper;
import cn.flashsaas.module.finance.dal.dataobject.ProductCostDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 商品成本 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface ProductCostMapper extends BaseMapper<ProductCostDO> {

}
