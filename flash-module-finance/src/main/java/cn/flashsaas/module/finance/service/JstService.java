package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.jst.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.JstConfigDO;

import java.time.LocalDate;
import java.util.List;

/**
 * 聚水潭集成 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface JstService {

    /**
     * 配置API连接
     *
     * @param reqVO 配置请求
     * @return 配置ID
     */
    Long configApi(JstConfigReqVO reqVO);

    /**
     * 测试API连接
     *
     * @param configId 配置ID
     * @return 是否连接成功
     */
    boolean testConnection(Long configId);

    /**
     * 同步入库单
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步结果
     */
    SyncResultVO syncInboundOrders(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 同步库存数据
     *
     * @param shopId 店铺ID
     * @return 同步结果
     */
    SyncResultVO syncInventory(Long shopId);

    /**
     * 获取入库单列表（分页）
     *
     * @param reqVO 分页请求
     * @return 入库单列表
     */
    PageResult<InboundOrderVO> getInboundOrders(InboundOrderPageReqVO reqVO);

    /**
     * 更新商品成本（根据入库单）
     *
     * @param inboundOrderId 入库单ID
     */
    void updateProductCostFromInbound(Long inboundOrderId);

    /**
     * 获取配置
     *
     * @param shopId 店铺ID
     * @return 配置信息
     */
    JstConfigDO getConfig(Long shopId);

    /**
     * 检查连接状态
     *
     * @param shopId 店铺ID
     * @return 连接状态
     */
    JstConnectionStatusVO checkConnectionStatus(Long shopId);

    /**
     * 获取库存列表
     *
     * @param shopId 店铺ID
     * @param skuCode SKU编码（可选）
     * @return 库存列表
     */
    List<InventoryVO> getInventoryList(Long shopId, String skuCode);

    /**
     * 批量更新商品成本
     *
     * @param shopId 店铺ID
     * @return 更新结果
     */
    BatchUpdateResultVO batchUpdateProductCost(Long shopId);

    /**
     * 获取同步日志
     *
     * @param shopId 店铺ID
     * @param limit 数量限制
     * @return 同步日志列表
     */
    List<JstSyncLogVO> getSyncLogs(Long shopId, Integer limit);

}
