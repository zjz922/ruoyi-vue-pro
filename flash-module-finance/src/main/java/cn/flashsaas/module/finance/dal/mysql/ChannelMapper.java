package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.dal.dataobject.ChannelDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 渠道配置 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface ChannelMapper extends BaseMapperX<ChannelDO> {

    /**
     * 根据店铺ID查询渠道列表
     */
    default List<ChannelDO> selectListByShopId(Long shopId) {
        return selectList(new LambdaQueryWrapperX<ChannelDO>()
                .eq(ChannelDO::getShopId, shopId)
                .orderByAsc(ChannelDO::getChannelCode));
    }

    /**
     * 根据渠道编码查询
     */
    default ChannelDO selectByChannelCode(Long tenantId, Long shopId, String channelCode) {
        return selectOne(new LambdaQueryWrapperX<ChannelDO>()
                .eq(ChannelDO::getTenantId, tenantId)
                .eq(ChannelDO::getShopId, shopId)
                .eq(ChannelDO::getChannelCode, channelCode));
    }

    /**
     * 根据渠道类型查询
     */
    default List<ChannelDO> selectListByChannelType(Long tenantId, String channelType) {
        return selectList(new LambdaQueryWrapperX<ChannelDO>()
                .eq(ChannelDO::getTenantId, tenantId)
                .eq(ChannelDO::getChannelType, channelType));
    }

    /**
     * 查询启用的渠道列表
     */
    default List<ChannelDO> selectEnabledListByShop(Long shopId) {
        return selectList(new LambdaQueryWrapperX<ChannelDO>()
                .eq(ChannelDO::getShopId, shopId)
                .eq(ChannelDO::getEnabled, true));
    }

}
