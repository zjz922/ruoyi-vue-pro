package com.shandianzhang.controller;

import com.shandianzhang.common.Result;
import com.shandianzhang.model.dto.OrderDTO;
import com.shandianzhang.model.entity.OrderEntity;
import com.shandianzhang.model.vo.OrderListVO;
import com.shandianzhang.model.vo.OrderStatsVO;
import com.shandianzhang.model.vo.PageResult;
import com.shandianzhang.service.OrderService;
import com.shandianzhang.service.OrderService.CompareResult;
import com.shandianzhang.service.OrderService.SyncResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * 订单管理控制器
 * 
 * <p>提供订单管理相关的REST API接口</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    /**
     * 分页查询订单列表
     * 
     * @param tenantId  租户ID（从请求头获取）
     * @param keyword   搜索关键词
     * @param status    订单状态
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @param pageNo    页码
     * @param pageSize  每页条数
     * @return 分页结果
     */
    @GetMapping("/list")
    public Result<PageResult<OrderListVO>> listOrders(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {

        LOGGER.info("查询订单列表, tenantId={}, keyword={}, status={}", tenantId, keyword, status);

        try {
            PageResult<OrderListVO> result = orderService.listOrders(tenantId, keyword, status,
                    startDate, endDate, pageNo, pageSize);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("查询订单列表失败", e);
            return Result.fail("查询订单列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID查询订单详情
     * 
     * @param tenantId 租户ID
     * @param orderId  订单ID
     * @return 订单详情
     */
    @GetMapping("/{orderId}")
    public Result<OrderEntity> getOrderById(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable Long orderId) {

        LOGGER.info("查询订单详情, tenantId={}, orderId={}", tenantId, orderId);

        try {
            OrderEntity order = orderService.getOrderById(tenantId, orderId);
            if (order == null) {
                return Result.fail("订单不存在");
            }
            return Result.success(order);
        } catch (Exception e) {
            LOGGER.error("查询订单详情失败", e);
            return Result.fail("查询订单详情失败: " + e.getMessage());
        }
    }

    /**
     * 根据订单号查询订单
     * 
     * @param tenantId 租户ID
     * @param orderNo  订单号
     * @return 订单实体
     */
    @GetMapping("/by-no/{orderNo}")
    public Result<OrderEntity> getOrderByNo(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable String orderNo) {

        LOGGER.info("根据订单号查询订单, tenantId={}, orderNo={}", tenantId, orderNo);

        try {
            OrderEntity order = orderService.getOrderByNo(tenantId, orderNo);
            if (order == null) {
                return Result.fail("订单不存在");
            }
            return Result.success(order);
        } catch (Exception e) {
            LOGGER.error("根据订单号查询订单失败", e);
            return Result.fail("查询订单失败: " + e.getMessage());
        }
    }

    /**
     * 获取订单统计数据
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 统计数据
     */
    @GetMapping("/stats")
    public Result<OrderStatsVO> getOrderStats(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {

        LOGGER.info("获取订单统计数据, tenantId={}, startDate={}, endDate={}", tenantId, startDate, endDate);

        try {
            OrderStatsVO stats = orderService.getOrderStats(tenantId, startDate, endDate);
            return Result.success(stats);
        } catch (Exception e) {
            LOGGER.error("获取订单统计数据失败", e);
            return Result.fail("获取订单统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取最近30天订单明细
     * 
     * @param tenantId 租户ID
     * @return 订单明细列表
     */
    @GetMapping("/thirty-days")
    public Result<List<OrderDTO>> getThirtyDaysOrders(
            @RequestHeader("X-Tenant-Id") String tenantId) {

        LOGGER.info("获取最近30天订单明细, tenantId={}", tenantId);

        try {
            List<OrderDTO> orders = orderService.getThirtyDaysOrders(tenantId);
            return Result.success(orders);
        } catch (Exception e) {
            LOGGER.error("获取最近30天订单明细失败", e);
            return Result.fail("获取最近30天订单明细失败: " + e.getMessage());
        }
    }

    /**
     * 获取按月汇总统计
     * 
     * @param tenantId 租户ID
     * @param year     年份
     * @return 月度统计列表
     */
    @GetMapping("/monthly-stats")
    public Result<List<OrderStatsVO>> getMonthlyStats(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam int year) {

        LOGGER.info("获取按月汇总统计, tenantId={}, year={}", tenantId, year);

        try {
            List<OrderStatsVO> stats = orderService.getMonthlyStats(tenantId, year);
            return Result.success(stats);
        } catch (Exception e) {
            LOGGER.error("获取按月汇总统计失败", e);
            return Result.fail("获取按月汇总统计失败: " + e.getMessage());
        }
    }

    /**
     * 获取按年汇总统计
     * 
     * @param tenantId 租户ID
     * @return 年度统计列表
     */
    @GetMapping("/yearly-stats")
    public Result<List<OrderStatsVO>> getYearlyStats(
            @RequestHeader("X-Tenant-Id") String tenantId) {

        LOGGER.info("获取按年汇总统计, tenantId={}", tenantId);

        try {
            List<OrderStatsVO> stats = orderService.getYearlyStats(tenantId);
            return Result.success(stats);
        } catch (Exception e) {
            LOGGER.error("获取按年汇总统计失败", e);
            return Result.fail("获取按年汇总统计失败: " + e.getMessage());
        }
    }

    /**
     * 从抖店同步订单
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 同步结果
     */
    @PostMapping("/sync")
    public Result<SyncResult> syncFromDoudian(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {

        LOGGER.info("从抖店同步订单, tenantId={}, startDate={}, endDate={}", tenantId, startDate, endDate);

        try {
            SyncResult result = orderService.syncFromDoudian(tenantId, startDate, endDate);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("从抖店同步订单失败", e);
            return Result.fail("从抖店同步订单失败: " + e.getMessage());
        }
    }

    /**
     * 订单对账
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 对账结果
     */
    @PostMapping("/compare")
    public Result<CompareResult> compareOrders(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {

        LOGGER.info("订单对账, tenantId={}, startDate={}, endDate={}", tenantId, startDate, endDate);

        try {
            CompareResult result = orderService.compareOrders(tenantId, startDate, endDate);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("订单对账失败", e);
            return Result.fail("订单对账失败: " + e.getMessage());
        }
    }
}
