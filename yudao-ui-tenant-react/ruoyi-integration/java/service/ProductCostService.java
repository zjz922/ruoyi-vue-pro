package cn.iocoder.yudao.module.finance.service.cost;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.cost.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.cost.ProductCostDO;
import cn.iocoder.yudao.module.finance.dal.dataobject.cost.ProductCostHistoryDO;

import javax.validation.Valid;
import java.util.List;

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
     * @return 编号
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
     * @param id 编号
     */
    void deleteProductCost(Long id);

    /**
     * 获得商品成本
     *
     * @param id 编号
     * @return 商品成本
     */
    ProductCostDO getProductCost(Long id);

    /**
     * 获得商品成本分页
     *
     * @param pageReqVO 分页查询
     * @return 商品成本分页
     */
    PageResult<ProductCostDO> getProductCostPage(ProductCostPageReqVO pageReqVO);

    /**
     * 批量导入商品成本
     *
     * @param importReqVO 导入数据
     * @return 导入结果
     */
    ProductCostImportRespVO importProductCosts(List<ProductCostImportReqVO> importReqVO);

    /**
     * 获得商品成本变更历史
     *
     * @param productCostId 商品成本ID
     * @return 变更历史列表
     */
    List<ProductCostHistoryDO> getProductCostHistory(Long productCostId);

    /**
     * 获得店铺名称列表
     *
     * @return 店铺名称列表
     */
    List<String> getShopNames();

    /**
     * 根据商品ID和SKU获取成本
     *
     * @param productId 商品ID
     * @param sku SKU
     * @return 商品成本
     */
    ProductCostDO getProductCostByProductIdAndSku(String productId, String sku);

}
