package cn.flashsaas.module.finance.service.cost;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.cost.vo.*;
import cn.flashsaas.module.finance.convert.cost.ProductCostConvert;
import cn.flashsaas.module.finance.dal.dataobject.cost.ProductCostDO;
import cn.flashsaas.module.finance.dal.dataobject.cost.ProductCostHistoryDO;
import cn.flashsaas.module.finance.dal.mysql.cost.ProductCostHistoryMapper;
import cn.flashsaas.module.finance.dal.mysql.cost.ProductCostMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.util.List;

import static cn.flashsaas.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.flashsaas.module.finance.enums.ErrorCodeConstants.*;

/**
 * 商品成本 Service 实现类
 *
 * @author 闪电账PRO
 */
@Service
@Validated
@Slf4j
public class ProductCostServiceImpl implements ProductCostService {

    @Resource
    private ProductCostMapper productCostMapper;

    @Resource
    private ProductCostHistoryMapper productCostHistoryMapper;

    @Override
    public Long createProductCost(ProductCostCreateReqVO createReqVO) {
        // 校验是否已存在
        ProductCostDO existCost = productCostMapper.selectByProductIdAndSku(
                createReqVO.getProductId(), createReqVO.getSku());
        if (existCost != null) {
            throw exception(PRODUCT_COST_EXISTS);
        }
        // 插入
        ProductCostDO productCost = ProductCostConvert.INSTANCE.convert(createReqVO);
        productCostMapper.insert(productCost);
        return productCost.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProductCost(ProductCostUpdateReqVO updateReqVO) {
        // 校验存在
        ProductCostDO oldCost = validateProductCostExists(updateReqVO.getId());
        // 记录历史
        if (updateReqVO.getCost() != null && !updateReqVO.getCost().equals(oldCost.getCost())) {
            ProductCostHistoryDO history = ProductCostHistoryDO.builder()
                    .productCostId(oldCost.getId())
                    .productId(oldCost.getProductId())
                    .oldCost(oldCost.getCost())
                    .newCost(updateReqVO.getCost())
                    .reason(updateReqVO.getReason())
                    .build();
            productCostHistoryMapper.insert(history);
        }
        // 更新
        ProductCostDO updateObj = ProductCostConvert.INSTANCE.convert(updateReqVO);
        productCostMapper.updateById(updateObj);
    }

    @Override
    public void deleteProductCost(Long id) {
        // 校验存在
        validateProductCostExists(id);
        // 删除（软删除）
        productCostMapper.deleteById(id);
    }

    private ProductCostDO validateProductCostExists(Long id) {
        ProductCostDO productCost = productCostMapper.selectById(id);
        if (productCost == null) {
            throw exception(PRODUCT_COST_NOT_EXISTS);
        }
        return productCost;
    }

    @Override
    public ProductCostDO getProductCost(Long id) {
        return productCostMapper.selectById(id);
    }

    @Override
    public PageResult<ProductCostDO> getProductCostPage(ProductCostPageReqVO pageReqVO) {
        return productCostMapper.selectPage(pageReqVO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductCostImportRespVO importProductCosts(List<ProductCostImportReqVO> importReqVO) {
        int createCount = 0;
        int updateCount = 0;
        int failCount = 0;
        StringBuilder failMsg = new StringBuilder();

        for (ProductCostImportReqVO item : importReqVO) {
            try {
                ProductCostDO existCost = productCostMapper.selectByProductIdAndSku(
                        item.getProductId(), item.getSku());
                if (existCost != null) {
                    // 更新
                    ProductCostDO updateObj = ProductCostConvert.INSTANCE.convert(item);
                    updateObj.setId(existCost.getId());
                    productCostMapper.updateById(updateObj);
                    updateCount++;
                } else {
                    // 新增
                    ProductCostDO insertObj = ProductCostConvert.INSTANCE.convert(item);
                    productCostMapper.insert(insertObj);
                    createCount++;
                }
            } catch (Exception e) {
                failCount++;
                failMsg.append("商品").append(item.getProductId()).append("导入失败：").append(e.getMessage()).append("\n");
                log.error("[importProductCosts][商品({})导入失败]", item.getProductId(), e);
            }
        }

        return ProductCostImportRespVO.builder()
                .createCount(createCount)
                .updateCount(updateCount)
                .failCount(failCount)
                .failMsg(failMsg.toString())
                .build();
    }

    @Override
    public List<ProductCostHistoryDO> getProductCostHistory(Long productCostId) {
        return productCostHistoryMapper.selectListByProductCostId(productCostId);
    }

    @Override
    public List<String> getShopNames() {
        return productCostMapper.selectShopNames(null); // 租户ID由框架自动注入
    }

    @Override
    public ProductCostDO getProductCostByProductIdAndSku(String productId, String sku) {
        return productCostMapper.selectByProductIdAndSku(productId, sku);
    }

}
