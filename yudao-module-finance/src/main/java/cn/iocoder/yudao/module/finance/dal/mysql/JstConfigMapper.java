package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.JstConfigDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 聚水潭配置 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface JstConfigMapper extends BaseMapperX<JstConfigDO> {

    /**
     * 根据店铺ID查询配置
     */
    default JstConfigDO selectByShopId(Long shopId) {
        return selectOne(new LambdaQueryWrapperX<JstConfigDO>()
                .eq(JstConfigDO::getShopId, shopId));
    }

    /**
     * 根据租户ID查询配置列表
     */
    default List<JstConfigDO> selectListByTenantId(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<JstConfigDO>()
                .eq(JstConfigDO::getTenantId, tenantId)
                .orderByDesc(JstConfigDO::getCreateTime));
    }

    /**
     * 根据授权状态查询
     */
    default List<JstConfigDO> selectListByAuthStatus(Long tenantId, Integer authStatus) {
        return selectList(new LambdaQueryWrapperX<JstConfigDO>()
                .eq(JstConfigDO::getTenantId, tenantId)
                .eq(JstConfigDO::getAuthStatus, authStatus));
    }

    /**
     * 根据AppKey查询
     */
    default JstConfigDO selectByAppKey(String appKey) {
        return selectOne(new LambdaQueryWrapperX<JstConfigDO>()
                .eq(JstConfigDO::getAppKey, appKey));
    }

}
