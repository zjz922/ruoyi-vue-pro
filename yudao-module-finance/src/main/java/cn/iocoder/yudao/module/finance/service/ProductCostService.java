package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.productcost.vo.ProductCostCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.productcost.vo.ProductCostPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.productcost.vo.ProductCostUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.ProductCostDO;

import javax.validation.Valid;

/**
 * 商品成本 Service 接口
 *
 * @author 闪电账PRO
 */
public interface ProductCostService {

    /**
     * 创建商品成本
     *
     * @param createReqVO 创建信息
     * @return 商品成本ID
     */
    Long createProductCost(@Valid ProductCostCreateReqVO createReqVO);

    /**
     * 更新商品成本
     *
     * @param updateReqVO 更新信息
     */
    void updateProductCost(@Valid ProductCostUpdateReqVO updateReqVO);

    /**
     * 删除商品成本
     *
     * @param id 商品成本ID
     */
    void deleteProductCost(Long id);

    /**
     * 获取商品成本
     *
     * @param id 商品成本ID
     * @return 商品成本
     */
    ProductCostDO getProductCost(Long id);

    /**
     * 获取商品成本分页
     *
     * @param pageReqVO 分页请求
     * @return 商品成本分页
     */
    PageResult<ProductCostDO> getProductCostPage(ProductCostPageReqVO pageReqVO);

    /**
     * 根据商品ID获取成本
     *
     * @param shopId 店铺ID
     * @param productId 商品ID
     * @return 商品成本
     */
    ProductCostDO getProductCostByProductId(Long shopId, String productId);

}
