package cn.flashsaas.module.finance.dal.mysql;

import cn.flashsaas.framework.common.pojo.PageParam;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.mybatis.core.mapper.BaseMapperX;
import cn.flashsaas.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.flashsaas.module.finance.dal.dataobject.ReconciliationDiffDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

/**
 * 对账差异 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface ReconciliationDiffMapper extends BaseMapperX<ReconciliationDiffDO> {

    /**
     * 根据店铺ID查询差异列表
     */
    default List<ReconciliationDiffDO> selectListByShopId(Long shopId) {
        return selectList(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getShopId, shopId)
                .orderByDesc(ReconciliationDiffDO::getCreateTime));
    }

    /**
     * 根据状态查询差异列表
     */
    default List<ReconciliationDiffDO> selectListByStatus(String status) {
        return selectList(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getStatus, status)
                .orderByDesc(ReconciliationDiffDO::getCreateTime));
    }

    /**
     * 根据租户ID和状态分页查询
     */
    default PageResult<ReconciliationDiffDO> selectPage(PageParam pageParam, Long tenantId, String diffType, String status,
                                                        LocalDate startDate, LocalDate endDate) {
        return selectPage(pageParam, new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eqIfPresent(ReconciliationDiffDO::getTenantId, tenantId)
                .eqIfPresent(ReconciliationDiffDO::getDiffType, diffType)
                .eqIfPresent(ReconciliationDiffDO::getStatus, status)
                .geIfPresent(ReconciliationDiffDO::getCheckDate, startDate)
                .leIfPresent(ReconciliationDiffDO::getCheckDate, endDate)
                .eq(ReconciliationDiffDO::getDelFlag, 0)
                .orderByDesc(ReconciliationDiffDO::getCreateTime));
    }

    /**
     * 统计待处理差异数量
     */
    default Long countPending() {
        return selectCount(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getStatus, "pending")
                .eq(ReconciliationDiffDO::getDelFlag, 0));
    }

    /**
     * 统计处理中差异数量
     */
    default Long countProcessing() {
        return selectCount(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getStatus, "processing")
                .eq(ReconciliationDiffDO::getDelFlag, 0));
    }

    /**
     * 统计已完成差异数量
     */
    default Long countCompleted() {
        return selectCount(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getStatus, "completed")
                .eq(ReconciliationDiffDO::getDelFlag, 0));
    }

    /**
     * 统计异常差异数量
     */
    default Long countException() {
        return selectCount(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getStatus, "exception")
                .eq(ReconciliationDiffDO::getDelFlag, 0));
    }

    /**
     * 按差异类型统计数量
     */
    @Select("SELECT diff_type, COUNT(*) as count FROM finance_reconciliation_diff WHERE del_flag = 0 GROUP BY diff_type")
    List<java.util.Map<String, Object>> selectCountGroupByType();

    /**
     * 按差异类型统计匹配数量
     */
    default Long countMatchedByType(String diffType) {
        return selectCount(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getDiffType, diffType)
                .eq(ReconciliationDiffDO::getStatus, "matched")
                .eq(ReconciliationDiffDO::getDelFlag, 0));
    }

    /**
     * 按差异类型统计未匹配数量
     */
    default Long countUnmatchedByType(String diffType) {
        return selectCount(new LambdaQueryWrapperX<ReconciliationDiffDO>()
                .eq(ReconciliationDiffDO::getDiffType, diffType)
                .ne(ReconciliationDiffDO::getStatus, "matched")
                .eq(ReconciliationDiffDO::getDelFlag, 0));
    }
}
