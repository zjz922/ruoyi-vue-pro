package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.dal.dataobject.ReconciliationLogDO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

/**
 * 对账日志 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface ReconciliationLogMapper extends BaseMapperX<ReconciliationLogDO> {

    /**
     * 根据店铺ID和日期范围查询
     */
    default List<ReconciliationLogDO> selectListByShopAndDateRange(Long shopId, LocalDate startDate, LocalDate endDate) {
        return selectList(new LambdaQueryWrapperX<ReconciliationLogDO>()
                .eq(ReconciliationLogDO::getShopId, shopId)
                .ge(ReconciliationLogDO::getCheckDate, startDate)
                .le(ReconciliationLogDO::getCheckDate, endDate)
                .orderByDesc(ReconciliationLogDO::getCheckDate));
    }

    /**
     * 根据检查类型查询
     */
    default List<ReconciliationLogDO> selectListByCheckType(Long tenantId, String checkType) {
        return selectList(new LambdaQueryWrapperX<ReconciliationLogDO>()
                .eq(ReconciliationLogDO::getTenantId, tenantId)
                .eq(ReconciliationLogDO::getCheckType, checkType)
                .orderByDesc(ReconciliationLogDO::getCreateTime));
    }

    /**
     * 根据状态查询
     */
    default List<ReconciliationLogDO> selectListByStatus(Long tenantId, String status) {
        return selectList(new LambdaQueryWrapperX<ReconciliationLogDO>()
                .eq(ReconciliationLogDO::getTenantId, tenantId)
                .eq(ReconciliationLogDO::getStatus, status)
                .orderByDesc(ReconciliationLogDO::getCreateTime));
    }

    /**
     * 查询最近一次对账记录
     */
    default ReconciliationLogDO selectLatestByShop(Long shopId) {
        return selectOne(new LambdaQueryWrapperX<ReconciliationLogDO>()
                .eq(ReconciliationLogDO::getShopId, shopId)
                .orderByDesc(ReconciliationLogDO::getCreateTime)
                .last("LIMIT 1"));
    }

}
