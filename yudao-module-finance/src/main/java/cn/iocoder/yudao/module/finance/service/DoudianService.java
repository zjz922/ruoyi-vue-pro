package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.module.finance.dal.dataobject.OrderDO;
import cn.iocoder.yudao.module.finance.dal.dataobject.CashflowDO;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 抖店API集成 Service 接口
 *
 * @author 闪电账PRO
 */
public interface DoudianService {

    /**
     * 获取授权URL
     *
     * @param shopId 店铺ID
     * @return 授权URL
     */
    String getAuthorizationUrl(Long shopId);

    /**
     * 处理授权回调
     *
     * @param shopId 店铺ID
     * @param code 授权码
     * @return 是否成功
     */
    Boolean handleAuthorizationCallback(Long shopId, String code);

    /**
     * 同步订单数据
     *
     * @param shopId 店铺ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 同步数量
     */
    Integer syncOrders(Long shopId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 同步资金流水
     *
     * @param shopId 店铺ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 同步数量
     */
    Integer syncCashflow(Long shopId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取订单详情
     *
     * @param shopId 店铺ID
     * @param platformOrderId 平台订单ID
     * @return 订单信息
     */
    OrderDO getOrderDetail(Long shopId, String platformOrderId);

    /**
     * 获取订单列表
     *
     * @param shopId 店铺ID
     * @param status 订单状态
     * @param pageNo 页码
     * @param pageSize 分页大小
     * @return 订单列表
     */
    List<OrderDO> getOrderList(Long shopId, String status, Integer pageNo, Integer pageSize);

    /**
     * 获取资金流水列表
     *
     * @param shopId 店铺ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageNo 页码
     * @param pageSize 分页大小
     * @return 流水列表
     */
    List<CashflowDO> getCashflowList(Long shopId, LocalDateTime startTime, LocalDateTime endTime, Integer pageNo, Integer pageSize);

    /**
     * 获取店铺信息
     *
     * @param shopId 店铺ID
     * @return 店铺信息
     */
    String getShopInfo(Long shopId);

    /**
     * 刷新Token
     *
     * @param shopId 店铺ID
     * @return 是否成功
     */
    Boolean refreshToken(Long shopId);

    /**
     * 检查Token是否过期
     *
     * @param shopId 店铺ID
     * @return 是否过期
     */
    Boolean isTokenExpired(Long shopId);

}
