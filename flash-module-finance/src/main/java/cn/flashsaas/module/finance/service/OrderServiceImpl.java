package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.common.util.object.BeanUtils;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderCreateReqVO;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderPageReqVO;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderUpdateReqVO;
import cn.flashsaas.module.finance.dal.dataobject.OrderDO;
import cn.flashsaas.module.finance.dal.mysql.OrderMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 订单 Service 实现类
 *
 * @author 闪电账PRO
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Resource
    private OrderMapper orderMapper;

    @Override
    @Transactional
    public Long createOrder(@Valid OrderCreateReqVO createReqVO) {
        OrderDO order = BeanUtils.toBean(createReqVO, OrderDO.class);
        orderMapper.insert(order);
        return order.getId();
    }

    @Override
    @Transactional
    public void updateOrder(@Valid OrderUpdateReqVO updateReqVO) {
        OrderDO order = BeanUtils.toBean(updateReqVO, OrderDO.class);
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        orderMapper.deleteById(id);
    }

    @Override
    public OrderDO getOrder(Long id) {
        return orderMapper.selectById(id);
    }

    @Override
    public PageResult<OrderDO> getOrderPage(OrderPageReqVO pageReqVO) {
        LambdaQueryWrapper<OrderDO> queryWrapper = Wrappers.lambdaQuery(OrderDO.class)
                .eq(pageReqVO.getShopId() != null, OrderDO::getShopId, pageReqVO.getShopId())
                .like(pageReqVO.getOrderNo() != null, OrderDO::getOrderNo, pageReqVO.getOrderNo())
                .eq(pageReqVO.getStatus() != null, OrderDO::getStatus, pageReqVO.getStatus())
                .orderByDesc(OrderDO::getCreateTime);
        
        return orderMapper.selectPage(pageReqVO, queryWrapper);
    }

}
