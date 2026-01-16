package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.costupdate.vo.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 成本更新 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface CostUpdateService {

    /**
     * 更新单个商品成本
     *
     * @param reqVO 更新请求
     */
    void updateProductCost(CostUpdateReqVO reqVO);

    /**
     * 批量更新商品成本
     *
     * @param reqVOList 更新请求列表
     * @return 更新结果
     */
    BatchCostUpdateResultVO batchUpdateProductCost(List<CostUpdateReqVO> reqVOList);

    /**
     * 从Excel导入成本
     *
     * @param shopId 店铺ID
     * @param fileUrl 文件URL
     * @return 导入结果
     */
    ImportCostResultVO importCostFromExcel(Long shopId, String fileUrl);

    /**
     * 获取成本更新历史（分页）
     *
     * @param reqVO 分页请求
     * @return 更新历史列表
     */
    PageResult<CostUpdateHistoryVO> getCostUpdateHistory(CostUpdateHistoryPageReqVO reqVO);

    /**
     * 计算商品成本
     *
     * @param skuId SKU ID
     * @param method 计算方法（FIFO/LIFO/WEIGHTED_AVERAGE）
     * @return 计算后的成本
     */
    BigDecimal calculateProductCost(Long skuId, String method);

    /**
     * 获取成本计算方法列表
     *
     * @return 计算方法列表
     */
    List<CostMethodVO> getCostMethods();

    /**
     * 设置默认成本计算方法
     *
     * @param shopId 店铺ID
     * @param method 计算方法
     */
    void setDefaultCostMethod(Long shopId, String method);

    /**
     * 获取默认成本计算方法
     *
     * @param shopId 店铺ID
     * @return 默认计算方法
     */
    String getDefaultCostMethod(Long shopId);

    /**
     * 重新计算所有商品成本
     *
     * @param shopId 店铺ID
     * @return 计算结果
     */
    RecalculateCostResultVO recalculateAllCosts(Long shopId);

    /**
     * 获取成本异常列表
     *
     * @param shopId 店铺ID
     * @return 成本异常列表
     */
    List<CostAnomalyVO> getCostAnomalies(Long shopId);

    /**
     * 导出成本数据
     *
     * @param shopId 店铺ID
     * @return 导出文件URL
     */
    String exportCostData(Long shopId);

}
