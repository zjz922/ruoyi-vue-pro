package com.shandianzhang.dao;

import com.shandianzhang.model.entity.OrderEntity;
import com.shandianzhang.model.vo.OrderStatsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 订单数据访问接口
 * 
 * <p>定义订单相关的数据库操作方法</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
@Mapper
public interface OrderDAO {

    /**
     * 分页查询订单列表
     * 
     * @param tenantId  租户ID
     * @param keyword   搜索关键词
     * @param status    订单状态
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @param offset    偏移量
     * @param limit     限制条数
     * @return 订单列表
     */
    List<OrderEntity> listOrders(@Param("tenantId") String tenantId,
                                  @Param("keyword") String keyword,
                                  @Param("status") Integer status,
                                  @Param("startDate") Date startDate,
                                  @Param("endDate") Date endDate,
                                  @Param("offset") int offset,
                                  @Param("limit") int limit);

    /**
     * 统计订单数量
     * 
     * @param tenantId  租户ID
     * @param keyword   搜索关键词
     * @param status    订单状态
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 订单数量
     */
    long countOrders(@Param("tenantId") String tenantId,
                     @Param("keyword") String keyword,
                     @Param("status") Integer status,
                     @Param("startDate") Date startDate,
                     @Param("endDate") Date endDate);

    /**
     * 根据ID查询订单
     * 
     * @param tenantId 租户ID
     * @param id       订单ID
     * @return 订单实体
     */
    OrderEntity getById(@Param("tenantId") String tenantId, @Param("id") Long id);

    /**
     * 根据订单号查询订单
     * 
     * @param tenantId 租户ID
     * @param orderNo  订单号
     * @return 订单实体
     */
    OrderEntity getByOrderNo(@Param("tenantId") String tenantId, @Param("orderNo") String orderNo);

    /**
     * 插入订单
     * 
     * @param entity 订单实体
     * @return 影响行数
     */
    int insert(OrderEntity entity);

    /**
     * 更新订单
     * 
     * @param entity 订单实体
     * @return 影响行数
     */
    int update(OrderEntity entity);

    /**
     * 删除订单（逻辑删除）
     * 
     * @param tenantId 租户ID
     * @param id       订单ID
     * @return 影响行数
     */
    int delete(@Param("tenantId") String tenantId, @Param("id") Long id);

    /**
     * 统计总订单数
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 订单数量
     */
    long countTotalOrders(@Param("tenantId") String tenantId,
                          @Param("startDate") Date startDate,
                          @Param("endDate") Date endDate);

    /**
     * 按状态统计订单数
     * 
     * @param tenantId  租户ID
     * @param status    订单状态
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 订单数量
     */
    long countOrdersByStatus(@Param("tenantId") String tenantId,
                             @Param("status") Integer status,
                             @Param("startDate") Date startDate,
                             @Param("endDate") Date endDate);

    /**
     * 汇总订单金额
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 订单金额合计
     */
    BigDecimal sumOrderAmount(@Param("tenantId") String tenantId,
                              @Param("startDate") Date startDate,
                              @Param("endDate") Date endDate);

    /**
     * 汇总支付金额
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 支付金额合计
     */
    BigDecimal sumPaymentAmount(@Param("tenantId") String tenantId,
                                @Param("startDate") Date startDate,
                                @Param("endDate") Date endDate);

    /**
     * 汇总退款金额
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 退款金额合计
     */
    BigDecimal sumRefundAmount(@Param("tenantId") String tenantId,
                               @Param("startDate") Date startDate,
                               @Param("endDate") Date endDate);

    /**
     * 汇总商品成本
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 商品成本合计
     */
    BigDecimal sumProductCost(@Param("tenantId") String tenantId,
                              @Param("startDate") Date startDate,
                              @Param("endDate") Date endDate);

    /**
     * 汇总毛利润
     * 
     * @param tenantId  租户ID
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 毛利润合计
     */
    BigDecimal sumGrossProfit(@Param("tenantId") String tenantId,
                              @Param("startDate") Date startDate,
                              @Param("endDate") Date endDate);

    /**
     * 查询最近30天订单
     * 
     * @param tenantId 租户ID
     * @return 订单列表
     */
    List<OrderEntity> listThirtyDaysOrders(@Param("tenantId") String tenantId);

    /**
     * 获取月度统计
     * 
     * @param tenantId 租户ID
     * @param year     年份
     * @return 月度统计列表
     */
    List<OrderStatsVO> getMonthlyStats(@Param("tenantId") String tenantId, @Param("year") int year);

    /**
     * 获取年度统计
     * 
     * @param tenantId 租户ID
     * @return 年度统计列表
     */
    List<OrderStatsVO> getYearlyStats(@Param("tenantId") String tenantId);
}
