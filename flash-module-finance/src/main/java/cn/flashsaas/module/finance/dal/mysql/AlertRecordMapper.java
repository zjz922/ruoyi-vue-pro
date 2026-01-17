package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.dal.dataobject.AlertRecordDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 预警记录 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface AlertRecordMapper extends BaseMapperX<AlertRecordDO> {

    /**
     * 根据租户ID查询记录列表
     */
    default List<AlertRecordDO> selectListByTenantId(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<AlertRecordDO>()
                .eq(AlertRecordDO::getTenantId, tenantId)
                .orderByDesc(AlertRecordDO::getCreateTime));
    }

    /**
     * 根据店铺ID查询记录列表
     */
    default List<AlertRecordDO> selectListByShopId(Long shopId) {
        return selectList(new LambdaQueryWrapperX<AlertRecordDO>()
                .eq(AlertRecordDO::getShopId, shopId)
                .orderByDesc(AlertRecordDO::getCreateTime));
    }

    /**
     * 根据状态查询记录列表
     */
    default List<AlertRecordDO> selectListByStatus(Long tenantId, String status) {
        return selectList(new LambdaQueryWrapperX<AlertRecordDO>()
                .eq(AlertRecordDO::getTenantId, tenantId)
                .eq(AlertRecordDO::getStatus, status)
                .orderByDesc(AlertRecordDO::getCreateTime));
    }

    /**
     * 根据预警级别查询
     */
    default List<AlertRecordDO> selectListByAlertLevel(Long tenantId, String alertLevel) {
        return selectList(new LambdaQueryWrapperX<AlertRecordDO>()
                .eq(AlertRecordDO::getTenantId, tenantId)
                .eq(AlertRecordDO::getAlertLevel, alertLevel)
                .orderByDesc(AlertRecordDO::getCreateTime));
    }

    /**
     * 统计未读预警数量
     */
    default Long countUnreadByTenant(Long tenantId) {
        return selectCount(new LambdaQueryWrapperX<AlertRecordDO>()
                .eq(AlertRecordDO::getTenantId, tenantId)
                .eq(AlertRecordDO::getStatus, "unread"));
    }

    /**
     * 根据规则ID查询记录
     */
    default List<AlertRecordDO> selectListByRuleId(Long ruleId) {
        return selectList(new LambdaQueryWrapperX<AlertRecordDO>()
                .eq(AlertRecordDO::getRuleId, ruleId)
                .orderByDesc(AlertRecordDO::getCreateTime));
    }

}
