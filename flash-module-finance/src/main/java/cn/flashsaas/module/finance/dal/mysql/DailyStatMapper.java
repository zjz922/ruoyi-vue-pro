package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.dal.dataobject.DailyStatDO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

/**
 * 每日统计 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface DailyStatMapper extends BaseMapperX<DailyStatDO> {

    /**
     * 根据店铺ID和日期范围查询
     */
    default List<DailyStatDO> selectListByShopAndDateRange(Long shopId, LocalDate startDate, LocalDate endDate) {
        return selectList(new LambdaQueryWrapperX<DailyStatDO>()
                .eq(DailyStatDO::getShopId, shopId)
                .ge(DailyStatDO::getStatDate, startDate)
                .le(DailyStatDO::getStatDate, endDate)
                .orderByAsc(DailyStatDO::getStatDate));
    }

    /**
     * 根据店铺ID和日期查询
     */
    default DailyStatDO selectByShopAndDate(Long shopId, LocalDate statDate) {
        return selectOne(new LambdaQueryWrapperX<DailyStatDO>()
                .eq(DailyStatDO::getShopId, shopId)
                .eq(DailyStatDO::getStatDate, statDate));
    }

    /**
     * 根据租户ID和日期范围查询
     */
    default List<DailyStatDO> selectListByTenantAndDateRange(Long tenantId, LocalDate startDate, LocalDate endDate) {
        return selectList(new LambdaQueryWrapperX<DailyStatDO>()
                .eq(DailyStatDO::getTenantId, tenantId)
                .ge(DailyStatDO::getStatDate, startDate)
                .le(DailyStatDO::getStatDate, endDate)
                .orderByAsc(DailyStatDO::getStatDate));
    }

    /**
     * 查询最近N天的统计数据
     */
    default List<DailyStatDO> selectRecentDays(Long shopId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        return selectListByShopAndDateRange(shopId, startDate, endDate);
    }

    /**
     * 根据租户ID、店铺ID和日期唯一查询
     */
    default DailyStatDO selectByUnique(Long tenantId, Long shopId, LocalDate statDate) {
        return selectOne(new LambdaQueryWrapperX<DailyStatDO>()
                .eq(DailyStatDO::getTenantId, tenantId)
                .eq(DailyStatDO::getShopId, shopId)
                .eq(DailyStatDO::getStatDate, statDate));
    }

}
