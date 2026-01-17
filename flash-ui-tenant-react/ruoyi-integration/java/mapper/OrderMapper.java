package cn.flashsaas.module.finance.dal.mysql.order;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderPageReqVO;
import cn.flashsaas.module.finance.controller.admin.order.vo.OrderStatsRespVO;
import cn.flashsaas.module.finance.dal.dataobject.order.OrderDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单 Mapper
 *
 * @author 闪电账PRO
 */
@Mapper
public interface OrderMapper extends BaseMapperX<OrderDO> {

    default PageResult<OrderDO> selectPage(OrderPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<OrderDO>()
                .likeIfPresent(OrderDO::getMainOrderNo, reqVO.getMainOrderNo())
                .likeIfPresent(OrderDO::getSubOrderNo, reqVO.getSubOrderNo())
                .likeIfPresent(OrderDO::getProductName, reqVO.getProductName())
                .likeIfPresent(OrderDO::getReceiver, reqVO.getReceiver())
                .eqIfPresent(OrderDO::getStatus, reqVO.getStatus())
                .eqIfPresent(OrderDO::getProvince, reqVO.getProvince())
                .eqIfPresent(OrderDO::getShopName, reqVO.getShopName())
                .betweenIfPresent(OrderDO::getOrderTime, reqVO.getOrderTime())
                .orderByDesc(OrderDO::getOrderTime));
    }

    default OrderDO selectBySubOrderNo(String subOrderNo) {
        return selectOne(new LambdaQueryWrapperX<OrderDO>()
                .eq(OrderDO::getSubOrderNo, subOrderNo));
    }

    default List<OrderDO> selectListByOrderTime(LocalDateTime startTime, LocalDateTime endTime) {
        return selectList(new LambdaQueryWrapperX<OrderDO>()
                .ge(OrderDO::getOrderTime, startTime)
                .le(OrderDO::getOrderTime, endTime));
    }

    @Select("SELECT COUNT(*) as totalCount, " +
            "SUM(CASE WHEN status = '已发货' OR status = '已完成' THEN 1 ELSE 0 END) as shippedCount, " +
            "SUM(pay_amount) as totalAmount " +
            "FROM finance_order WHERE deleted = 0 AND tenant_id = #{tenantId}")
    OrderStatsRespVO selectStats(@Param("tenantId") Long tenantId);

    @Select("SELECT DISTINCT province FROM finance_order WHERE deleted = 0 AND tenant_id = #{tenantId} AND province IS NOT NULL")
    List<String> selectProvinces(@Param("tenantId") Long tenantId);

    @Select("SELECT DISTINCT status FROM finance_order WHERE deleted = 0 AND tenant_id = #{tenantId}")
    List<String> selectStatuses(@Param("tenantId") Long tenantId);

}
