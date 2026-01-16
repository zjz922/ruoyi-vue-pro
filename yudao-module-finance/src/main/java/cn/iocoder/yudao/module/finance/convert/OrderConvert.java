package cn.iocoder.yudao.module.finance.convert;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.OrderRespVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.OrderDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * 订单 Convert
 *
 * @author 闪电账PRO
 */
@Mapper
public interface OrderConvert {

    OrderConvert INSTANCE = Mappers.getMapper(OrderConvert.class);

    /**
     * 转换为响应对象
     *
     * @param orderDO 订单DO
     * @return 订单响应VO
     */
    OrderRespVO convert(OrderDO orderDO);

    /**
     * 转换分页结果
     *
     * @param pageResult 分页结果
     * @return 分页响应
     */
    PageResult<OrderRespVO> convertPage(PageResult<OrderDO> pageResult);

}
