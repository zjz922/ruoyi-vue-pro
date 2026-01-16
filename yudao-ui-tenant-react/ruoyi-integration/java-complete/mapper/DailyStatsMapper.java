package com.yudao.module.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yudao.module.finance.entity.DailyStatsDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 每日统计 Mapper
 */
@Mapper
public interface DailyStatsMapper extends BaseMapper<DailyStatsDO> {

    /**
     * 分页查询每日统计
     */
    Page<DailyStatsDO> selectDailyStatsPage(Page<DailyStatsDO> page,
                                            @Param("tenantId") Long tenantId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    /**
     * 按日期范围查询每日统计
     */
    List<DailyStatsDO> selectByDateRange(@Param("tenantId") Long tenantId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    /**
     * 按日期查询单日统计
     */
    DailyStatsDO selectByDate(@Param("tenantId") Long tenantId,
                              @Param("statsDate") LocalDate statsDate);

    /**
     * 查询月度统计汇总
     */
    List<Map<String, Object>> selectMonthlyStats(@Param("tenantId") Long tenantId,
                                                 @Param("year") Integer year,
                                                 @Param("month") Integer month);

    /**
     * 查询年度统计汇总
     */
    Map<String, Object> selectYearlyStats(@Param("tenantId") Long tenantId,
                                          @Param("year") Integer year);

    /**
     * 查询最近30天统计
     */
    List<DailyStatsDO> selectLast30Days(@Param("tenantId") Long tenantId);

    /**
     * 查询最近90天统计
     */
    List<DailyStatsDO> selectLast90Days(@Param("tenantId") Long tenantId);

    /**
     * 查询最近一年统计
     */
    List<DailyStatsDO> selectLastYear(@Param("tenantId") Long tenantId);

    /**
     * 查询利润趋势
     */
    List<Map<String, Object>> selectProfitTrend(@Param("tenantId") Long tenantId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    /**
     * 查询费用分布
     */
    List<Map<String, Object>> selectExpenseDistribution(@Param("tenantId") Long tenantId,
                                                        @Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate);

    /**
     * 检查是否存在指定日期的统计
     */
    Integer selectCountByDate(@Param("tenantId") Long tenantId,
                              @Param("statsDate") LocalDate statsDate);

    /**
     * 删除指定日期的统计
     */
    Integer deleteByDate(@Param("tenantId") Long tenantId,
                         @Param("statsDate") LocalDate statsDate);
}
