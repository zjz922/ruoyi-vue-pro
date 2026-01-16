package com.yudao.module.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yudao.module.finance.entity.OrderDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * 订单 Mapper
 */
@Mapper
public interface OrderMapper extends BaseMapper<OrderDO> {

    /**
     * 分页查询订单列表
     */
    Page<OrderDO> selectOrderPage(Page<OrderDO> page,
                                   @Param("tenantId") Long tenantId,
                                   @Param("orderNo") String orderNo,
                                   @Param("productTitle") String productTitle,
                                   @Param("province") String province,
                                   @Param("orderStatus") String orderStatus,
                                   @Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);

    /**
     * 按日期范围查询订单列表
     */
    List<OrderDO> selectOrdersByDateRange(@Param("tenantId") Long tenantId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    /**
     * 查询订单数量统计
     */
    Integer selectOrderCount(@Param("tenantId") Long tenantId,
                             @Param("startDate") LocalDate startDate,
                             @Param("endDate") LocalDate endDate);

    /**
     * 按订单号查询订单
     */
    OrderDO selectByOrderNo(@Param("tenantId") Long tenantId,
                            @Param("orderNo") String orderNo);

    /**
     * 批量查询订单
     */
    List<OrderDO> selectByOrderNos(@Param("tenantId") Long tenantId,
                                   @Param("orderNos") List<String> orderNos);

    /**
     * 按SKU查询订单
     */
    List<OrderDO> selectBySku(@Param("tenantId") Long tenantId,
                              @Param("sku") String sku);

    /**
     * 按省份统计订单
     */
    List<Map<String, Object>> selectOrderCountByProvince(@Param("tenantId") Long tenantId,
                                                         @Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);

    /**
     * 查询待发货订单
     */
    List<OrderDO> selectPendingShipmentOrders(@Param("tenantId") Long tenantId);

    /**
     * 查询待收货订单
     */
    List<OrderDO> selectPendingReceiptOrders(@Param("tenantId") Long tenantId);

    /**
     * 按状态统计订单数量
     */
    Long selectCountByStatus(@Param("tenantId") Long tenantId,
                             @Param("orderStatus") String orderStatus);

    /**
     * 删除指定日期前的订单（软删除）
     */
    Integer softDeleteByDate(@Param("tenantId") Long tenantId,
                             @Param("beforeDate") LocalDate beforeDate);
}
