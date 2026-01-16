package com.yudao.module.finance.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yudao.module.finance.entity.OrderDO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 订单 Service
 */
public interface OrderService extends IService<OrderDO> {

    /**
     * 分页查询订单列表
     */
    Page<OrderDO> getOrderPage(Long tenantId, Integer pageNo, Integer pageSize,
                               String orderNo, String productTitle, String province,
                               String orderStatus, LocalDate startDate, LocalDate endDate);

    /**
     * 按日期范围查询订单列表
     */
    List<OrderDO> getOrdersByDateRange(Long tenantId, LocalDate startDate, LocalDate endDate);

    /**
     * 查询订单数量统计
     */
    Integer getOrderCount(Long tenantId, LocalDate startDate, LocalDate endDate);

    /**
     * 按订单号查询订单
     */
    OrderDO getByOrderNo(Long tenantId, String orderNo);

    /**
     * 批量查询订单
     */
    List<OrderDO> getByOrderNos(Long tenantId, List<String> orderNos);

    /**
     * 按SKU查询订单
     */
    List<OrderDO> getBySku(Long tenantId, String sku);

    /**
     * 按省份统计订单
     */
    List<Map<String, Object>> getOrderCountByProvince(Long tenantId, LocalDate startDate, LocalDate endDate);

    /**
     * 查询待发货订单
     */
    List<OrderDO> getPendingShipmentOrders(Long tenantId);

    /**
     * 查询待收货订单
     */
    List<OrderDO> getPendingReceiptOrders(Long tenantId);

    /**
     * 按状态统计订单数量
     */
    Long getCountByStatus(Long tenantId, String orderStatus);

    /**
     * 新增订单
     */
    Long createOrder(Long tenantId, OrderDO order);

    /**
     * 更新订单
     */
    Boolean updateOrder(Long tenantId, OrderDO order);

    /**
     * 删除订单
     */
    Boolean deleteOrder(Long tenantId, Long orderId);

    /**
     * 批量删除订单
     */
    Boolean deleteOrders(Long tenantId, List<Long> orderIds);

    /**
     * 批量导入订单
     */
    Map<String, Object> batchImportOrders(Long tenantId, List<OrderDO> orders);

    /**
     * 导出订单
     */
    byte[] exportOrders(Long tenantId, LocalDate startDate, LocalDate endDate);

    /**
     * 删除指定日期前的订单
     */
    Integer deleteOrdersBeforeDate(Long tenantId, LocalDate beforeDate);
}
