package com.yudao.module.finance.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yudao.module.finance.entity.OrderDO;
import com.yudao.module.finance.mapper.OrderMapper;
import com.yudao.module.finance.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单 Service 实现
 */
@Slf4j
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, OrderDO> implements OrderService {

    @Override
    public Page<OrderDO> getOrderPage(Long tenantId, Integer pageNo, Integer pageSize,
                                      String orderNo, String productTitle, String province,
                                      String orderStatus, LocalDate startDate, LocalDate endDate) {
        Page<OrderDO> page = new Page<>(pageNo, pageSize);
        return baseMapper.selectOrderPage(page, tenantId, orderNo, productTitle, province, orderStatus, startDate, endDate);
    }

    @Override
    public List<OrderDO> getOrdersByDateRange(Long tenantId, LocalDate startDate, LocalDate endDate) {
        return baseMapper.selectOrdersByDateRange(tenantId, startDate, endDate);
    }

    @Override
    public Integer getOrderCount(Long tenantId, LocalDate startDate, LocalDate endDate) {
        return baseMapper.selectOrderCount(tenantId, startDate, endDate);
    }

    @Override
    public OrderDO getByOrderNo(Long tenantId, String orderNo) {
        return baseMapper.selectByOrderNo(tenantId, orderNo);
    }

    @Override
    public List<OrderDO> getByOrderNos(Long tenantId, List<String> orderNos) {
        return baseMapper.selectByOrderNos(tenantId, orderNos);
    }

    @Override
    public List<OrderDO> getBySku(Long tenantId, String sku) {
        return baseMapper.selectBySku(tenantId, sku);
    }

    @Override
    public List<Map<String, Object>> getOrderCountByProvince(Long tenantId, LocalDate startDate, LocalDate endDate) {
        return baseMapper.selectOrderCountByProvince(tenantId, startDate, endDate);
    }

    @Override
    public List<OrderDO> getPendingShipmentOrders(Long tenantId) {
        return baseMapper.selectPendingShipmentOrders(tenantId);
    }

    @Override
    public List<OrderDO> getPendingReceiptOrders(Long tenantId) {
        return baseMapper.selectPendingReceiptOrders(tenantId);
    }

    @Override
    public Long getCountByStatus(Long tenantId, String orderStatus) {
        return baseMapper.selectCountByStatus(tenantId, orderStatus);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createOrder(Long tenantId, OrderDO order) {
        try {
            order.setTenantId(tenantId);
            baseMapper.insert(order);
            log.info("订单创建成功: tenantId={}, orderNo={}", tenantId, order.getOrderNo());
            return order.getId();
        } catch (Exception e) {
            log.error("订单创建失败: tenantId={}, orderNo={}", tenantId, order.getOrderNo(), e);
            throw new RuntimeException("订单创建失败", e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateOrder(Long tenantId, OrderDO order) {
        try {
            order.setTenantId(tenantId);
            baseMapper.updateById(order);
            log.info("订单更新成功: tenantId={}, orderId={}", tenantId, order.getId());
            return true;
        } catch (Exception e) {
            log.error("订单更新失败: tenantId={}, orderId={}", tenantId, order.getId(), e);
            throw new RuntimeException("订单更新失败", e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteOrder(Long tenantId, Long orderId) {
        try {
            baseMapper.deleteById(orderId);
            log.info("订单删除成功: tenantId={}, orderId={}", tenantId, orderId);
            return true;
        } catch (Exception e) {
            log.error("订单删除失败: tenantId={}, orderId={}", tenantId, orderId, e);
            throw new RuntimeException("订单删除失败", e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteOrders(Long tenantId, List<Long> orderIds) {
        try {
            baseMapper.deleteBatchIds(orderIds);
            log.info("批量删除订单成功: tenantId={}, count={}", tenantId, orderIds.size());
            return true;
        } catch (Exception e) {
            log.error("批量删除订单失败: tenantId={}, count={}", tenantId, orderIds.size(), e);
            throw new RuntimeException("批量删除订单失败", e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> batchImportOrders(Long tenantId, List<OrderDO> orders) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failureCount = 0;

        try {
            for (OrderDO order : orders) {
                try {
                    order.setTenantId(tenantId);
                    baseMapper.insert(order);
                    successCount++;
                } catch (Exception e) {
                    log.warn("订单导入失败: orderNo={}, error={}", order.getOrderNo(), e.getMessage());
                    failureCount++;
                }
            }
            result.put("successCount", successCount);
            result.put("failureCount", failureCount);
            result.put("totalCount", orders.size());
            log.info("批量导入订单完成: tenantId={}, success={}, failure={}", tenantId, successCount, failureCount);
        } catch (Exception e) {
            log.error("批量导入订单异常: tenantId={}", tenantId, e);
            throw new RuntimeException("批量导入订单失败", e);
        }

        return result;
    }

    @Override
    public byte[] exportOrders(Long tenantId, LocalDate startDate, LocalDate endDate) {
        // TODO: 实现Excel导出逻辑
        return new byte[0];
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Integer deleteOrdersBeforeDate(Long tenantId, LocalDate beforeDate) {
        try {
            Integer count = baseMapper.softDeleteByDate(tenantId, beforeDate);
            log.info("删除指定日期前的订单成功: tenantId={}, beforeDate={}, count={}", tenantId, beforeDate, count);
            return count;
        } catch (Exception e) {
            log.error("删除指定日期前的订单失败: tenantId={}, beforeDate={}", tenantId, beforeDate, e);
            throw new RuntimeException("删除订单失败", e);
        }
    }
}
