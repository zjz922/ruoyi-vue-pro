package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.finance.controller.admin.productcost.vo.ProductCostCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.productcost.vo.ProductCostPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.productcost.vo.ProductCostUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.ProductCostDO;
import cn.iocoder.yudao.module.finance.dal.mysql.ProductCostMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 商品成本 Service 实现类
 *
 * @author 闪电账PRO
 */
@Service
public class ProductCostServiceImpl implements ProductCostService {

    @Resource
    private ProductCostMapper productCostMapper;

    @Override
    @Transactional
    public Long createProductCost(@Valid ProductCostCreateReqVO createReqVO) {
        ProductCostDO productCost = BeanUtils.toBean(createReqVO, ProductCostDO.class);
        productCostMapper.insert(productCost);
        return productCost.getId();
    }

    @Override
    @Transactional
    public void updateProductCost(@Valid ProductCostUpdateReqVO updateReqVO) {
        ProductCostDO productCost = BeanUtils.toBean(updateReqVO, ProductCostDO.class);
        productCostMapper.updateById(productCost);
    }

    @Override
    @Transactional
    public void deleteProductCost(Long id) {
        productCostMapper.deleteById(id);
    }

    @Override
    public ProductCostDO getProductCost(Long id) {
        return productCostMapper.selectById(id);
    }

    @Override
    public PageResult<ProductCostDO> getProductCostPage(ProductCostPageReqVO pageReqVO) {
        LambdaQueryWrapper<ProductCostDO> queryWrapper = Wrappers.lambdaQuery(ProductCostDO.class)
                .eq(pageReqVO.getShopId() != null, ProductCostDO::getShopId, pageReqVO.getShopId())
                .like(pageReqVO.getProductId() != null, ProductCostDO::getProductId, pageReqVO.getProductId())
                .like(pageReqVO.getProductName() != null, ProductCostDO::getProductName, pageReqVO.getProductName())
                .orderByDesc(ProductCostDO::getCreateTime);
        
        return productCostMapper.selectPage(pageReqVO, queryWrapper);
    }

    @Override
    public ProductCostDO getProductCostByProductId(Long shopId, String productId) {
        LambdaQueryWrapper<ProductCostDO> queryWrapper = Wrappers.lambdaQuery(ProductCostDO.class)
                .eq(ProductCostDO::getShopId, shopId)
                .eq(ProductCostDO::getProductId, productId);
        
        return productCostMapper.selectOne(queryWrapper);
    }

}
