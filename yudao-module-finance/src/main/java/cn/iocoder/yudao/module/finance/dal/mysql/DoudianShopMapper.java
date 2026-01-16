package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianShopDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 抖店店铺信息 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface DoudianShopMapper extends BaseMapperX<DoudianShopDO> {

    /**
     * 根据抖店店铺ID查询
     */
    default DoudianShopDO selectByShopId(String shopId) {
        return selectOne(new LambdaQueryWrapperX<DoudianShopDO>()
                .eq(DoudianShopDO::getShopId, shopId));
    }

    /**
     * 根据用户ID查询店铺列表
     */
    default List<DoudianShopDO> selectListByUserId(Long userId) {
        return selectList(new LambdaQueryWrapperX<DoudianShopDO>()
                .eq(DoudianShopDO::getUserId, userId)
                .orderByDesc(DoudianShopDO::getCreateTime));
    }

    /**
     * 根据租户ID查询店铺列表
     */
    default List<DoudianShopDO> selectListByTenantId(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<DoudianShopDO>()
                .eq(DoudianShopDO::getTenantId, tenantId)
                .orderByDesc(DoudianShopDO::getCreateTime));
    }

    /**
     * 根据租户ID和抖店店铺ID查询
     */
    default DoudianShopDO selectByTenantAndShopId(Long tenantId, String shopId) {
        return selectOne(new LambdaQueryWrapperX<DoudianShopDO>()
                .eq(DoudianShopDO::getTenantId, tenantId)
                .eq(DoudianShopDO::getShopId, shopId));
    }

}
