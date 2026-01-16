package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.QianchuanConfigDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 千川配置 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface QianchuanConfigMapper extends BaseMapperX<QianchuanConfigDO> {

    /**
     * 根据店铺ID查询配置
     */
    default QianchuanConfigDO selectByShopId(Long shopId) {
        return selectOne(new LambdaQueryWrapperX<QianchuanConfigDO>()
                .eq(QianchuanConfigDO::getShopId, shopId));
    }

    /**
     * 根据广告主ID查询配置
     */
    default QianchuanConfigDO selectByAdvertiserId(String advertiserId) {
        return selectOne(new LambdaQueryWrapperX<QianchuanConfigDO>()
                .eq(QianchuanConfigDO::getAdvertiserId, advertiserId));
    }

    /**
     * 根据租户ID查询配置列表
     */
    default List<QianchuanConfigDO> selectListByTenantId(Long tenantId) {
        return selectList(new LambdaQueryWrapperX<QianchuanConfigDO>()
                .eq(QianchuanConfigDO::getTenantId, tenantId)
                .orderByDesc(QianchuanConfigDO::getCreateTime));
    }

    /**
     * 根据授权状态查询
     */
    default List<QianchuanConfigDO> selectListByAuthStatus(Long tenantId, Integer authStatus) {
        return selectList(new LambdaQueryWrapperX<QianchuanConfigDO>()
                .eq(QianchuanConfigDO::getTenantId, tenantId)
                .eq(QianchuanConfigDO::getAuthStatus, authStatus));
    }

}
