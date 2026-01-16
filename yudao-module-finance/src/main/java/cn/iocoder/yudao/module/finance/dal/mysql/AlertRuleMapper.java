package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.AlertRuleDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 预警规则 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface AlertRuleMapper extends BaseMapperX<AlertRuleDO> {

    /**
     * 根据租户ID查询规则列表
     */
    default List<AlertRuleDO> selectListByTenantId(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<AlertRuleDO>()
                .eq(AlertRuleDO::getTenantId, tenantId)
                .orderByDesc(AlertRuleDO::getCreateTime));
    }

    /**
     * 根据店铺ID查询规则列表
     */
    default List<AlertRuleDO> selectListByShopId(Long shopId) {
        return selectList(new LambdaQueryWrapperX<AlertRuleDO>()
                .eq(AlertRuleDO::getShopId, shopId)
                .orderByDesc(AlertRuleDO::getCreateTime));
    }

    /**
     * 根据规则类型查询
     */
    default List<AlertRuleDO> selectListByRuleType(Long tenantId, String ruleType) {
        return selectList(new LambdaQueryWrapperX<AlertRuleDO>()
                .eq(AlertRuleDO::getTenantId, tenantId)
                .eq(AlertRuleDO::getRuleType, ruleType));
    }

    /**
     * 查询启用的规则列表
     */
    default List<AlertRuleDO> selectEnabledList(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<AlertRuleDO>()
                .eq(AlertRuleDO::getTenantId, tenantId)
                .eq(AlertRuleDO::getEnabled, true));
    }

    /**
     * 查询全局规则（shopId为空）
     */
    default List<AlertRuleDO> selectGlobalRules(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<AlertRuleDO>()
                .eq(AlertRuleDO::getTenantId, tenantId)
                .isNull(AlertRuleDO::getShopId)
                .eq(AlertRuleDO::getEnabled, true));
    }

}
