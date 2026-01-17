package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.ledger.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 总账管理 - 库存成本 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerInventoryService {

    /**
     * 获取库存成本概览
     *
     * @param shopId 店铺ID
     * @return 库存成本概览
     */
    InventoryOverviewRespVO getOverview(String shopId);

    /**
     * 获取SKU成本追踪
     *
     * @param shopId 店铺ID
     * @param keyword 关键词
     * @param costTrend 成本趋势
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return SKU成本追踪
     */
    PageResult<InventorySkuCostVO> getSkuCost(String shopId, String keyword, String costTrend, 
            Integer pageNum, Integer pageSize);

    /**
     * 设置成本计价方式
     *
     * @param reqVO 配置请求
     * @return 设置结果
     */
    Map<String, Object> setCostingConfig(InventoryCostingConfigReqVO reqVO);

    /**
     * 同步库存数据
     *
     * @param shopId 店铺ID
     * @return 同步结果
     */
    Map<String, Object> syncInventory(String shopId);

    /**
     * 获取周转优化建议
     *
     * @param shopId 店铺ID
     * @return 周转优化建议
     */
    InventoryOptimizationRespVO getOptimization(String shopId);

    /**
     * 导出库存报表
     *
     * @param reqVO 导出请求
     * @return 导出结果
     */
    Map<String, Object> exportInventory(InventoryExportReqVO reqVO);

    /**
     * 获取成本波动预警
     *
     * @param shopId 店铺ID
     * @return 成本波动预警
     */
    List<InventoryCostAlertVO> getCostAlerts(String shopId);

    /**
     * 获取成本计价对比
     *
     * @param shopId 店铺ID
     * @param skuCode SKU编码
     * @return 成本计价对比
     */
    InventoryCostingComparisonRespVO getCostingComparison(String shopId, String skuCode);

    /**
     * 获取滞销商品
     *
     * @param shopId 店铺ID
     * @param days 天数阈值
     * @return 滞销商品
     */
    List<InventorySlowMovingVO> getSlowMoving(String shopId, Integer days);
}
