package cn.iocoder.yudao.module.finance.dal.mysql.cost;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.controller.admin.cost.vo.ProductCostPageReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.cost.ProductCostDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 商品成本 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface ProductCostMapper extends BaseMapperX<ProductCostDO> {

    default PageResult<ProductCostDO> selectPage(ProductCostPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<ProductCostDO>()
                .likeIfPresent(ProductCostDO::getProductId, reqVO.getProductId())
                .likeIfPresent(ProductCostDO::getTitle, reqVO.getTitle())
                .likeIfPresent(ProductCostDO::getSku, reqVO.getSku())
                .eqIfPresent(ProductCostDO::getShopName, reqVO.getShopName())
                .eqIfPresent(ProductCostDO::getStatus, reqVO.getStatus())
                .betweenIfPresent(ProductCostDO::getCreateTime, reqVO.getCreateTime())
                .orderByDesc(ProductCostDO::getId));
    }

    default ProductCostDO selectByProductIdAndSku(String productId, String sku) {
        return selectOne(new LambdaQueryWrapperX<ProductCostDO>()
                .eq(ProductCostDO::getProductId, productId)
                .eq(ProductCostDO::getSku, sku));
    }

    @Select("SELECT DISTINCT shop_name FROM finance_product_cost WHERE deleted = 0 AND tenant_id = #{tenantId}")
    List<String> selectShopNames(@Param("tenantId") Long tenantId);

    default List<ProductCostDO> selectListByShopName(String shopName) {
        return selectList(new LambdaQueryWrapperX<ProductCostDO>()
                .eqIfPresent(ProductCostDO::getShopName, shopName)
                .eq(ProductCostDO::getStatus, 0));
    }

}
