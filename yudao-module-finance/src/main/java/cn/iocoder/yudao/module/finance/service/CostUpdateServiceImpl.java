package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.costupdate.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.ProductCostDO;
import cn.iocoder.yudao.module.finance.dal.mysql.ProductCostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 成本更新 Service 实现类
 *
 * @author 闪电帐PRO
 */
@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class CostUpdateServiceImpl implements CostUpdateService {

    private final ProductCostMapper productCostMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProductCost(CostUpdateReqVO reqVO) {
        ProductCostDO costDO = productCostMapper.selectBySkuCode(reqVO.getTenantId(), reqVO.getShopId(), reqVO.getSkuCode());
        
        if (costDO == null) {
            // 新建成本记录
            costDO = new ProductCostDO();
            costDO.setTenantId(reqVO.getTenantId());
            costDO.setShopId(reqVO.getShopId());
            costDO.setSkuCode(reqVO.getSkuCode());
            costDO.setSkuName(reqVO.getSkuName());
            costDO.setPurchaseCost(reqVO.getPurchaseCost());
            costDO.setShippingCost(reqVO.getShippingCost());
            costDO.setPackagingCost(reqVO.getPackagingCost());
            costDO.setOtherCost(reqVO.getOtherCost());
            costDO.setTotalCost(calculateTotalCost(reqVO));
            costDO.setCostMethod(reqVO.getCostMethod());
            productCostMapper.insert(costDO);
        } else {
            // 更新成本记录
            costDO.setPurchaseCost(reqVO.getPurchaseCost());
            costDO.setShippingCost(reqVO.getShippingCost());
            costDO.setPackagingCost(reqVO.getPackagingCost());
            costDO.setOtherCost(reqVO.getOtherCost());
            costDO.setTotalCost(calculateTotalCost(reqVO));
            costDO.setCostMethod(reqVO.getCostMethod());
            productCostMapper.updateById(costDO);
        }
        
        log.info("更新商品成本, skuCode: {}, totalCost: {}", reqVO.getSkuCode(), costDO.getTotalCost());
    }

    private BigDecimal calculateTotalCost(CostUpdateReqVO reqVO) {
        BigDecimal total = BigDecimal.ZERO;
        if (reqVO.getPurchaseCost() != null) {
            total = total.add(reqVO.getPurchaseCost());
        }
        if (reqVO.getShippingCost() != null) {
            total = total.add(reqVO.getShippingCost());
        }
        if (reqVO.getPackagingCost() != null) {
            total = total.add(reqVO.getPackagingCost());
        }
        if (reqVO.getOtherCost() != null) {
            total = total.add(reqVO.getOtherCost());
        }
        return total;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BatchUpdateResultVO batchUpdateCost(List<CostUpdateReqVO> reqVOList) {
        BatchUpdateResultVO result = new BatchUpdateResultVO();
        result.setUpdateTime(LocalDateTime.now());
        
        int successCount = 0;
        int failCount = 0;
        List<String> failedSkus = new ArrayList<>();
        
        for (CostUpdateReqVO reqVO : reqVOList) {
            try {
                updateProductCost(reqVO);
                successCount++;
            } catch (Exception e) {
                log.error("更新商品成本失败, skuCode: {}", reqVO.getSkuCode(), e);
                failCount++;
                failedSkus.add(reqVO.getSkuCode());
            }
        }
        
        result.setTotalCount(reqVOList.size());
        result.setSuccessCount(successCount);
        result.setFailCount(failCount);
        result.setFailedSkus(failedSkus);
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ImportResultVO importCostFromExcel(Long tenantId, Long shopId, MultipartFile file) {
        ImportResultVO result = new ImportResultVO();
        result.setImportTime(LocalDateTime.now());
        
        // TODO: 实现Excel导入逻辑
        // 1. 解析Excel文件
        // 2. 验证数据格式
        // 3. 批量更新成本
        
        result.setTotalRows(0);
        result.setSuccessRows(0);
        result.setFailRows(0);
        result.setErrors(new ArrayList<>());
        
        return result;
    }

    @Override
    public byte[] exportCostTemplate() {
        // TODO: 生成Excel模板
        return new byte[0];
    }

    @Override
    public PageResult<ProductCostVO> getCostPage(CostPageReqVO reqVO) {
        // TODO: 实现成本分页查询
        return new PageResult<>(new ArrayList<>(), 0L);
    }

    @Override
    public ProductCostVO getCostBySku(Long tenantId, Long shopId, String skuCode) {
        ProductCostDO costDO = productCostMapper.selectBySkuCode(tenantId, shopId, skuCode);
        if (costDO == null) {
            return null;
        }
        
        ProductCostVO vo = new ProductCostVO();
        vo.setId(costDO.getId());
        vo.setSkuCode(costDO.getSkuCode());
        vo.setSkuName(costDO.getSkuName());
        vo.setPurchaseCost(costDO.getPurchaseCost());
        vo.setShippingCost(costDO.getShippingCost());
        vo.setPackagingCost(costDO.getPackagingCost());
        vo.setOtherCost(costDO.getOtherCost());
        vo.setTotalCost(costDO.getTotalCost());
        vo.setCostMethod(costDO.getCostMethod());
        vo.setUpdateTime(costDO.getUpdateTime());
        
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteCost(Long costId) {
        productCostMapper.deleteById(costId);
        log.info("删除商品成本, costId: {}", costId);
    }

    @Override
    public List<CostHistoryVO> getCostHistory(Long tenantId, Long shopId, String skuCode) {
        // TODO: 实现成本历史查询
        return new ArrayList<>();
    }

    @Override
    public CostStatVO getCostStat(Long tenantId, Long shopId) {
        CostStatVO vo = new CostStatVO();
        vo.setTenantId(tenantId);
        vo.setShopId(shopId);
        
        // TODO: 统计成本数据
        vo.setTotalSkuCount(0);
        vo.setConfiguredSkuCount(0);
        vo.setUnconfiguredSkuCount(0);
        vo.setAverageCost(BigDecimal.ZERO);
        
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setCostMethod(Long tenantId, Long shopId, String method) {
        // TODO: 设置成本计算方法（FIFO、加权平均等）
        log.info("设置成本计算方法, tenantId: {}, shopId: {}, method: {}", tenantId, shopId, method);
    }

    @Override
    public String getCostMethod(Long tenantId, Long shopId) {
        // TODO: 获取成本计算方法
        return "weighted_average";
    }

}
