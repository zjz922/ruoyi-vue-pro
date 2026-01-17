package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianAuthTokenDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 抖店授权Token Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface DoudianAuthTokenMapper extends BaseMapperX<DoudianAuthTokenDO> {

    /**
     * 根据用户ID查询授权Token列表
     */
    default List<DoudianAuthTokenDO> selectListByUserId(Long userId) {
        return selectList(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getUserId, userId)
                .orderByDesc(DoudianAuthTokenDO::getCreateTime));
    }

    /**
     * 根据店铺ID查询授权Token
     */
    default DoudianAuthTokenDO selectByShopId(String shopId) {
        return selectOne(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getShopId, shopId));
    }

    /**
     * 根据租户ID和用户ID查询授权Token列表
     */
    default List<DoudianAuthTokenDO> selectListByTenantAndUser(Long tenantId, Long userId) {
        return selectList(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getTenantId, tenantId)
                .eq(DoudianAuthTokenDO::getUserId, userId)
                .orderByDesc(DoudianAuthTokenDO::getCreateTime));
    }

    /**
     * 查询已授权的Token列表
     */
    default List<DoudianAuthTokenDO> selectListByAuthStatus(Integer authStatus) {
        return selectList(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getAuthStatus, authStatus));
    }

    /**
     * 根据租户ID和店铺ID查询授权Token
     */
    default DoudianAuthTokenDO selectByTenantIdAndShopId(Long tenantId, String shopId) {
        return selectOne(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getTenantId, tenantId)
                .eq(DoudianAuthTokenDO::getShopId, shopId));
    }

    /**
     * 根据租户ID查询授权Token列表
     */
    default List<DoudianAuthTokenDO> selectListByTenantId(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getTenantId, tenantId)
                .orderByDesc(DoudianAuthTokenDO::getCreateTime));
    }

    /**
     * 根据租户ID和店铺ID删除授权Token
     */
    default int deleteByTenantIdAndShopId(Long tenantId, String shopId) {
        return delete(new LambdaQueryWrapperX<DoudianAuthTokenDO>()
                .eq(DoudianAuthTokenDO::getTenantId, tenantId)
                .eq(DoudianAuthTokenDO::getShopId, shopId));
    }

}
