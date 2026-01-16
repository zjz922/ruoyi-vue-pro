package cn.iocoder.yudao.module.finance.service.order;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.order.OrderDO;

import javax.validation.Valid;
import java.util.List;

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
     * @return 编号
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
     * @param id 编号
     */
    void deleteOrder(Long id);

    /**
     * 获得订单
     *
     * @param id 编号
     * @return 订单
     */
    OrderDO getOrder(Long id);

    /**
     * 获得订单分页
     *
     * @param pageReqVO 分页查询
     * @return 订单分页
     */
    PageResult<OrderDO> getOrderPage(OrderPageReqVO pageReqVO);

    /**
     * 获得订单统计数据
     *
     * @return 统计数据
     */
    OrderStatsRespVO getOrderStats();

    /**
     * 批量导入订单
     *
     * @param importReqVO 导入数据
     * @return 导入结果
     */
    OrderImportRespVO importOrders(List<OrderImportReqVO> importReqVO);

    /**
     * 获得省份列表
     *
     * @return 省份列表
     */
    List<String> getProvinces();

    /**
     * 获得订单状态列表
     *
     * @return 状态列表
     */
    List<String> getStatuses();

}
