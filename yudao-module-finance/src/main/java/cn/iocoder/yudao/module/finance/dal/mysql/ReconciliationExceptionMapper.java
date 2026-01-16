package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.ReconciliationExceptionDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 对账异常 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface ReconciliationExceptionMapper extends BaseMapperX<ReconciliationExceptionDO> {

    /**
     * 根据店铺ID查询异常列表
     */
    default List<ReconciliationExceptionDO> selectListByShopId(Long shopId) {
        return selectList(new LambdaQueryWrapperX<ReconciliationExceptionDO>()
                .eq(ReconciliationExceptionDO::getShopId, shopId)
                .orderByDesc(ReconciliationExceptionDO::getCreateTime));
    }

    /**
     * 根据状态查询异常列表
     */
    default List<ReconciliationExceptionDO> selectListByStatus(Long tenantId, String status) {
        return selectList(new LambdaQueryWrapperX<ReconciliationExceptionDO>()
                .eq(ReconciliationExceptionDO::getTenantId, tenantId)
                .eq(ReconciliationExceptionDO::getStatus, status)
                .orderByDesc(ReconciliationExceptionDO::getCreateTime));
    }

    /**
     * 根据异常类型查询
     */
    default List<ReconciliationExceptionDO> selectListByExceptionType(Long tenantId, String exceptionType) {
        return selectList(new LambdaQueryWrapperX<ReconciliationExceptionDO>()
                .eq(ReconciliationExceptionDO::getTenantId, tenantId)
                .eq(ReconciliationExceptionDO::getExceptionType, exceptionType)
                .orderByDesc(ReconciliationExceptionDO::getCreateTime));
    }

    /**
     * 根据订单ID查询异常
     */
    default List<ReconciliationExceptionDO> selectListByOrderId(Long orderId) {
        return selectList(new LambdaQueryWrapperX<ReconciliationExceptionDO>()
                .eq(ReconciliationExceptionDO::getOrderId, orderId));
    }

    /**
     * 统计待处理异常数量
     */
    default Long countPendingByShop(Long shopId) {
        return selectCount(new LambdaQueryWrapperX<ReconciliationExceptionDO>()
                .eq(ReconciliationExceptionDO::getShopId, shopId)
                .eq(ReconciliationExceptionDO::getStatus, "pending"));
    }

}
