package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.OrderCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.OrderPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.OrderUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.OrderDO;

import javax.validation.Valid;

/**
 * 订单 Service 接口
 *
 * @author 闪电账PRO
 */
public interface OrderService {

    /**
     * 创建订单
     *
     * @param createReqVO 创建信息
     * @return 订单ID
     */
    Long createOrder(@Valid OrderCreateReqVO createReqVO);

    /**
     * 更新订单
     *
     * @param updateReqVO 更新信息
     */
    void updateOrder(@Valid OrderUpdateReqVO updateReqVO);

    /**
     * 删除订单
     *
     * @param id 订单ID
     */
    void deleteOrder(Long id);

    /**
     * 获取订单
     *
     * @param id 订单ID
     * @return 订单
     */
    OrderDO getOrder(Long id);

    /**
     * 获取订单分页
     *
     * @param pageReqVO 分页请求
     * @return 订单分页
     */
    PageResult<OrderDO> getOrderPage(OrderPageReqVO pageReqVO);

}
