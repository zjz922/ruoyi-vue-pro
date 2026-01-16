package com.shandianzhang.service.impl;

import com.shandianzhang.dao.OrderDAO;
import com.shandianzhang.model.dto.OrderDTO;
import com.shandianzhang.model.entity.OrderEntity;
import com.shandianzhang.model.vo.OrderListVO;
import com.shandianzhang.model.vo.OrderStatsVO;
import com.shandianzhang.model.vo.PageResult;
import com.shandianzhang.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 订单服务实现类
 * 
 * <p>实现订单管理相关的业务逻辑</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderDAO orderDAO;

    /**
     * 分页查询订单列表
     */
    @Override
    public PageResult<OrderListVO> listOrders(String tenantId, String keyword, Integer status,
                                               Date startDate, Date endDate, int pageNo, int pageSize) {
        LOGGER.info("查询订单列表, tenantId={}, keyword={}, status={}, pageNo={}, pageSize={}",
                tenantId, keyword, status, pageNo, pageSize);

        // 参数校验
        if (tenantId == null || tenantId.isEmpty()) {
            throw new IllegalArgumentException("租户ID不能为空");
        }
        if (pageNo < 1) {
            pageNo = 1;
        }
        if (pageSize < 1 || pageSize > 100) {
            pageSize = 20;
        }

        // 计算偏移量
        int offset = (pageNo - 1) * pageSize;

        // 查询总数
        long total = orderDAO.countOrders(tenantId, keyword, status, startDate, endDate);

        // 查询列表
        List<OrderEntity> entities = orderDAO.listOrders(tenantId, keyword, status,
                startDate, endDate, offset, pageSize);

        // 转换为VO
        List<OrderListVO> list = new ArrayList<>();
        for (OrderEntity entity : entities) {
            OrderListVO vo = convertToListVO(entity);
            list.add(vo);
        }

        // 构建分页结果
        PageResult<OrderListVO> result = new PageResult<>();
        result.setList(list);
        result.setTotal(total);
        result.setPageNo(pageNo);
        result.setPageSize(pageSize);
        result.setTotalPages((int) Math.ceil((double) total / pageSize));

        return result;
    }

    /**
     * 根据ID查询订单详情
     */
    @Override
    public OrderEntity getOrderById(String tenantId, Long orderId) {
        LOGGER.info("查询订单详情, tenantId={}, orderId={}", tenantId, orderId);

        if (tenantId == null || orderId == null) {
            throw new IllegalArgumentException("参数不能为空");
        }

        return orderDAO.getById(tenantId, orderId);
    }

    /**
     * 根据订单号查询订单
     */
    @Override
    public OrderEntity getOrderByNo(String tenantId, String orderNo) {
        LOGGER.info("根据订单号查询订单, tenantId={}, orderNo={}", tenantId, orderNo);

        if (tenantId == null || orderNo == null) {
            throw new IllegalArgumentException("参数不能为空");
        }

        return orderDAO.getByOrderNo(tenantId, orderNo);
    }

    /**
     * 获取订单统计数据
     */
    @Override
    public OrderStatsVO getOrderStats(String tenantId, Date startDate, Date endDate) {
        LOGGER.info("获取订单统计数据, tenantId={}, startDate={}, endDate={}",
                tenantId, startDate, endDate);

        if (tenantId == null) {
            throw new IllegalArgumentException("租户ID不能为空");
        }

        OrderStatsVO stats = new OrderStatsVO();

        // 查询订单总数
        stats.setTotalOrders(orderDAO.countTotalOrders(tenantId, startDate, endDate));

        // 查询各状态订单数
        stats.setPendingOrders(orderDAO.countOrdersByStatus(tenantId, 1, startDate, endDate));
        stats.setPaidOrders(orderDAO.countOrdersByStatus(tenantId, 2, startDate, endDate));
        stats.setShippedOrders(orderDAO.countOrdersByStatus(tenantId, 3, startDate, endDate));
        stats.setCompletedOrders(orderDAO.countOrdersByStatus(tenantId, 4, startDate, endDate));
        stats.setCancelledOrders(orderDAO.countOrdersByStatus(tenantId, 5, startDate, endDate));
        stats.setRefundedOrders(orderDAO.countOrdersByStatus(tenantId, 6, startDate, endDate));

        // 查询金额统计
        stats.setTotalAmount(orderDAO.sumOrderAmount(tenantId, startDate, endDate));
        stats.setTotalPayment(orderDAO.sumPaymentAmount(tenantId, startDate, endDate));
        stats.setTotalRefund(orderDAO.sumRefundAmount(tenantId, startDate, endDate));
        stats.setTotalCost(orderDAO.sumProductCost(tenantId, startDate, endDate));
        stats.setTotalProfit(orderDAO.sumGrossProfit(tenantId, startDate, endDate));

        // 计算毛利率
        if (stats.getTotalPayment() != null && stats.getTotalPayment().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal profitRate = stats.getTotalProfit()
                    .divide(stats.getTotalPayment(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            stats.setProfitRate(profitRate);
        } else {
            stats.setProfitRate(BigDecimal.ZERO);
        }

        return stats;
    }

    /**
     * 获取最近30天订单明细
     */
    @Override
    public List<OrderDTO> getThirtyDaysOrders(String tenantId) {
        LOGGER.info("获取最近30天订单明细, tenantId={}", tenantId);

        if (tenantId == null) {
            throw new IllegalArgumentException("租户ID不能为空");
        }

        List<OrderEntity> entities = orderDAO.listThirtyDaysOrders(tenantId);
        List<OrderDTO> result = new ArrayList<>();

        for (OrderEntity entity : entities) {
            OrderDTO dto = convertToDTO(entity);
            result.add(dto);
        }

        return result;
    }

    /**
     * 获取按月汇总统计
     */
    @Override
    public List<OrderStatsVO> getMonthlyStats(String tenantId, int year) {
        LOGGER.info("获取按月汇总统计, tenantId={}, year={}", tenantId, year);

        if (tenantId == null) {
            throw new IllegalArgumentException("租户ID不能为空");
        }

        return orderDAO.getMonthlyStats(tenantId, year);
    }

    /**
     * 获取按年汇总统计
     */
    @Override
    public List<OrderStatsVO> getYearlyStats(String tenantId) {
        LOGGER.info("获取按年汇总统计, tenantId={}", tenantId);

        if (tenantId == null) {
            throw new IllegalArgumentException("租户ID不能为空");
        }

        return orderDAO.getYearlyStats(tenantId);
    }

    /**
     * 从抖店同步订单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public SyncResult syncFromDoudian(String tenantId, Date startDate, Date endDate) {
        LOGGER.info("从抖店同步订单, tenantId={}, startDate={}, endDate={}",
                tenantId, startDate, endDate);

        SyncResult result = new SyncResult();
        result.setSyncId("sync_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        result.setSyncTime(new Date());

        try {
            // TODO: 调用抖店API获取订单数据
            // List<DoudianOrder> doudianOrders = doudianApiClient.getOrders(startDate, endDate);

            int addedCount = 0;
            int updatedCount = 0;
            int failedCount = 0;
            List<String> errors = new ArrayList<>();

            // TODO: 遍历抖店订单，同步到本地数据库
            // for (DoudianOrder doudianOrder : doudianOrders) {
            //     try {
            //         OrderEntity existingOrder = orderDAO.getByOrderNo(tenantId, doudianOrder.getOrderNo());
            //         if (existingOrder == null) {
            //             // 新增订单
            //             OrderEntity newOrder = convertFromDoudian(doudianOrder);
            //             orderDAO.insert(newOrder);
            //             addedCount++;
            //         } else {
            //             // 更新订单
            //             updateFromDoudian(existingOrder, doudianOrder);
            //             orderDAO.update(existingOrder);
            //             updatedCount++;
            //         }
            //     } catch (Exception e) {
            //         failedCount++;
            //         errors.add(doudianOrder.getOrderNo() + ": " + e.getMessage());
            //     }
            // }

            result.setAddedCount(addedCount);
            result.setUpdatedCount(updatedCount);
            result.setFailedCount(failedCount);
            result.setErrors(errors);
            result.setStatus(failedCount == 0 ? "success" : "partial");

        } catch (Exception e) {
            LOGGER.error("同步订单失败", e);
            result.setStatus("failed");
            result.setErrors(List.of(e.getMessage()));
        }

        return result;
    }

    /**
     * 订单对账
     */
    @Override
    public CompareResult compareOrders(String tenantId, Date startDate, Date endDate) {
        LOGGER.info("订单对账, tenantId={}, startDate={}, endDate={}",
                tenantId, startDate, endDate);

        CompareResult result = new CompareResult();

        try {
            // TODO: 调用抖店API获取订单数据
            // List<DoudianOrder> doudianOrders = doudianApiClient.getOrders(startDate, endDate);

            // 获取本地订单
            List<OrderEntity> localOrders = orderDAO.listOrders(tenantId, null, null,
                    startDate, endDate, 0, Integer.MAX_VALUE);

            int totalOrders = localOrders.size();
            int matchedOrders = 0;
            int mismatchedOrders = 0;
            int newOrders = 0;
            List<MismatchDetail> mismatches = new ArrayList<>();

            // TODO: 对比订单数据
            // for (DoudianOrder doudianOrder : doudianOrders) {
            //     OrderEntity localOrder = findLocalOrder(localOrders, doudianOrder.getOrderNo());
            //     if (localOrder == null) {
            //         newOrders++;
            //     } else {
            //         List<MismatchDetail> orderMismatches = compareOrder(localOrder, doudianOrder);
            //         if (orderMismatches.isEmpty()) {
            //             matchedOrders++;
            //         } else {
            //             mismatchedOrders++;
            //             mismatches.addAll(orderMismatches);
            //         }
            //     }
            // }

            result.setTotalOrders(totalOrders);
            result.setMatchedOrders(matchedOrders);
            result.setMismatchedOrders(mismatchedOrders);
            result.setNewOrders(newOrders);
            result.setMismatches(mismatches);

        } catch (Exception e) {
            LOGGER.error("订单对账失败", e);
        }

        return result;
    }

    /**
     * 转换为列表VO
     */
    private OrderListVO convertToListVO(OrderEntity entity) {
        OrderListVO vo = new OrderListVO();
        vo.setId(entity.getId());
        vo.setOrderNo(entity.getOrderNo());
        vo.setShopName(entity.getShopName());
        vo.setProductName(entity.getProductName());
        vo.setProductSpec(entity.getProductSpec());
        vo.setQuantity(entity.getQuantity());
        vo.setOrderAmount(entity.getOrderAmount());
        vo.setPaymentAmount(entity.getPaymentAmount());
        vo.setActualIncome(entity.getActualIncome());
        vo.setProductCost(entity.getProductCost());
        vo.setGrossProfit(entity.getGrossProfit());
        vo.setGrossProfitRate(entity.getGrossProfitRate());
        vo.setOrderStatus(entity.getOrderStatus());
        vo.setOrderStatusName(entity.getOrderStatusName());
        vo.setInfluencerName(entity.getInfluencerName());
        vo.setOrderTime(entity.getOrderTime());
        return vo;
    }

    /**
     * 转换为DTO
     */
    private OrderDTO convertToDTO(OrderEntity entity) {
        OrderDTO dto = new OrderDTO();
        dto.setId(entity.getId());
        dto.setOrderNo(entity.getOrderNo());
        dto.setShopName(entity.getShopName());
        dto.setProductName(entity.getProductName());
        dto.setProductSpec(entity.getProductSpec());
        dto.setQuantity(entity.getQuantity());
        dto.setOrderAmount(entity.getOrderAmount());
        dto.setPaymentAmount(entity.getPaymentAmount());
        dto.setActualIncome(entity.getActualIncome());
        dto.setProductCost(entity.getProductCost());
        dto.setGrossProfit(entity.getGrossProfit());
        dto.setGrossProfitRate(entity.getGrossProfitRate());
        dto.setOrderStatus(entity.getOrderStatus());
        dto.setOrderStatusName(entity.getOrderStatusName());
        dto.setInfluencerName(entity.getInfluencerName());
        dto.setOrderTime(entity.getOrderTime());
        dto.setPaymentTime(entity.getPaymentTime());
        return dto;
    }
}
