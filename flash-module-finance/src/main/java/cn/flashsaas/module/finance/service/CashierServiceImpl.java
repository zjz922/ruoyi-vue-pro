package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.cashier.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.*;
import cn.flashsaas.module.finance.dal.mysql.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 出纳管理 Service 实现类
 *
 * @author 闪电帐PRO
 */
@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class CashierServiceImpl implements CashierService {

    private final CashflowMapper cashflowMapper;
    private final ChannelMapper channelMapper;
    private final ReconciliationLogMapper reconciliationLogMapper;
    private final ReconciliationExceptionMapper reconciliationExceptionMapper;
    private final AlertRuleMapper alertRuleMapper;
    private final AlertRecordMapper alertRecordMapper;
    private final DailyStatMapper dailyStatMapper;

    @Override
    public CashierDashboardVO getDashboard(Long shopId) {
        CashierDashboardVO vo = new CashierDashboardVO();
        
        // 获取今日数据
        DailyStatDO todayStat = dailyStatMapper.selectByShopAndDate(shopId, LocalDate.now());
        if (todayStat != null) {
            vo.setTodayIncome(todayStat.getTotalSales());
            vo.setTodayExpense(todayStat.getTotalCost());
        } else {
            vo.setTodayIncome(BigDecimal.ZERO);
            vo.setTodayExpense(BigDecimal.ZERO);
        }
        
        // 获取待处理事项数量
        Long pendingExceptions = reconciliationExceptionMapper.countPendingByShop(shopId);
        Long unreadAlerts = alertRecordMapper.countUnreadByTenant(null); // TODO: 获取租户ID
        
        vo.setPendingReconciliation(pendingExceptions.intValue());
        vo.setUnreadAlerts(unreadAlerts.intValue());
        vo.setBalance(BigDecimal.ZERO); // TODO: 计算余额
        
        return vo;
    }

    @Override
    public List<PendingTaskVO> getPendingTasks(Long shopId) {
        List<PendingTaskVO> tasks = new ArrayList<>();
        
        // 获取待处理的对账异常
        List<ReconciliationExceptionDO> exceptions = reconciliationExceptionMapper
                .selectListByStatus(null, "pending");
        for (ReconciliationExceptionDO ex : exceptions) {
            PendingTaskVO task = new PendingTaskVO();
            task.setTaskId(ex.getId());
            task.setTaskType("reconciliation_exception");
            task.setTitle("对账异常待处理");
            task.setDescription(ex.getExceptionType() + ": " + ex.getDescription());
            task.setCreateTime(ex.getCreateTime());
            tasks.add(task);
        }
        
        return tasks;
    }

    @Override
    public List<ChannelVO> getChannels(Long shopId) {
        List<ChannelDO> channels = channelMapper.selectListByShopId(shopId);
        List<ChannelVO> result = new ArrayList<>();
        
        for (ChannelDO channel : channels) {
            ChannelVO vo = new ChannelVO();
            vo.setId(channel.getId());
            vo.setChannelCode(channel.getChannelCode());
            vo.setChannelName(channel.getChannelName());
            vo.setChannelType(channel.getChannelType());
            vo.setEnabled(channel.getEnabled());
            vo.setBalance(channel.getBalance());
            result.add(vo);
        }
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void configChannel(ChannelConfigReqVO reqVO) {
        ChannelDO channel = channelMapper.selectByChannelCode(reqVO.getTenantId(), reqVO.getShopId(), reqVO.getChannelCode());
        
        if (channel == null) {
            // 新建渠道
            channel = new ChannelDO();
            channel.setTenantId(reqVO.getTenantId());
            channel.setShopId(reqVO.getShopId());
            channel.setChannelCode(reqVO.getChannelCode());
            channel.setChannelName(reqVO.getChannelName());
            channel.setChannelType(reqVO.getChannelType());
            channel.setEnabled(reqVO.getEnabled());
            channel.setBalance(BigDecimal.ZERO);
            channelMapper.insert(channel);
        } else {
            // 更新渠道
            channel.setChannelName(reqVO.getChannelName());
            channel.setEnabled(reqVO.getEnabled());
            channelMapper.updateById(channel);
        }
    }

    @Override
    public ReconciliationResultVO executeReconciliation(Long shopId, LocalDate date, String platform) {
        ReconciliationResultVO result = new ReconciliationResultVO();
        result.setShopId(shopId);
        result.setCheckDate(date);
        result.setPlatform(platform);
        
        // TODO: 实现对账逻辑
        result.setTotalChecked(0);
        result.setMatchedCount(0);
        result.setDifferenceCount(0);
        result.setStatus("completed");
        
        // 记录对账日志
        ReconciliationLogDO logDO = new ReconciliationLogDO();
        logDO.setShopId(shopId);
        logDO.setCheckDate(date);
        logDO.setCheckType(platform);
        logDO.setTotalCount(0);
        logDO.setMatchedCount(0);
        logDO.setDifferenceCount(0);
        logDO.setStatus("completed");
        reconciliationLogMapper.insert(logDO);
        
        return result;
    }

    @Override
    public PageResult<DifferenceVO> getDifferences(DifferencePageReqVO reqVO) {
        // TODO: 实现差异分页查询
        return new PageResult<>(new ArrayList<>(), 0L);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleDifference(Long diffId, String handleType, String remark) {
        ReconciliationExceptionDO exception = reconciliationExceptionMapper.selectById(diffId);
        if (exception != null) {
            exception.setStatus("handled");
            exception.setHandleType(handleType);
            exception.setHandleRemark(remark);
            reconciliationExceptionMapper.updateById(exception);
        }
    }

    @Override
    public DailyReportVO generateDailyReport(Long shopId, LocalDate date) {
        DailyReportVO report = new DailyReportVO();
        report.setShopId(shopId);
        report.setReportDate(date);
        
        DailyStatDO stat = dailyStatMapper.selectByShopAndDate(shopId, date);
        if (stat != null) {
            report.setTotalSales(stat.getTotalSales());
            report.setTotalOrders(stat.getOrderCount());
            report.setTotalCost(stat.getTotalCost());
            report.setGrossProfit(stat.getTotalSales().subtract(stat.getTotalCost()));
        } else {
            report.setTotalSales(BigDecimal.ZERO);
            report.setTotalOrders(0);
            report.setTotalCost(BigDecimal.ZERO);
            report.setGrossProfit(BigDecimal.ZERO);
        }
        
        return report;
    }

    @Override
    public MonthlyReportVO generateMonthlyReport(Long shopId, Integer year, Integer month) {
        MonthlyReportVO report = new MonthlyReportVO();
        report.setShopId(shopId);
        report.setYear(year);
        report.setMonth(month);
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<DailyStatDO> stats = dailyStatMapper.selectListByShopAndDateRange(shopId, startDate, endDate);
        
        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        Integer totalOrders = 0;
        
        for (DailyStatDO stat : stats) {
            totalSales = totalSales.add(stat.getTotalSales() != null ? stat.getTotalSales() : BigDecimal.ZERO);
            totalCost = totalCost.add(stat.getTotalCost() != null ? stat.getTotalCost() : BigDecimal.ZERO);
            totalOrders += stat.getOrderCount() != null ? stat.getOrderCount() : 0;
        }
        
        report.setTotalSales(totalSales);
        report.setTotalOrders(totalOrders);
        report.setTotalCost(totalCost);
        report.setGrossProfit(totalSales.subtract(totalCost));
        
        return report;
    }

    @Override
    public ShopStatVO getShopStat(Long shopId, LocalDate startDate, LocalDate endDate) {
        ShopStatVO vo = new ShopStatVO();
        vo.setShopId(shopId);
        vo.setStartDate(startDate);
        vo.setEndDate(endDate);
        
        List<DailyStatDO> stats = dailyStatMapper.selectListByShopAndDateRange(shopId, startDate, endDate);
        
        BigDecimal totalSales = BigDecimal.ZERO;
        Integer totalOrders = 0;
        
        for (DailyStatDO stat : stats) {
            totalSales = totalSales.add(stat.getTotalSales() != null ? stat.getTotalSales() : BigDecimal.ZERO);
            totalOrders += stat.getOrderCount() != null ? stat.getOrderCount() : 0;
        }
        
        vo.setTotalSales(totalSales);
        vo.setTotalOrders(totalOrders);
        vo.setAverageOrderValue(totalOrders > 0 ? 
                totalSales.divide(new BigDecimal(totalOrders), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO);
        
        return vo;
    }

    @Override
    public List<AlertVO> getAlerts(Long shopId) {
        List<AlertRecordDO> records = alertRecordMapper.selectListByShopId(shopId);
        List<AlertVO> result = new ArrayList<>();
        
        for (AlertRecordDO record : records) {
            AlertVO vo = new AlertVO();
            vo.setId(record.getId());
            vo.setAlertType(record.getAlertType());
            vo.setAlertLevel(record.getAlertLevel());
            vo.setTitle(record.getTitle());
            vo.setContent(record.getContent());
            vo.setStatus(record.getStatus());
            vo.setCreateTime(record.getCreateTime());
            result.add(vo);
        }
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void configAlertRule(AlertRuleConfigReqVO reqVO) {
        AlertRuleDO rule = new AlertRuleDO();
        rule.setTenantId(reqVO.getTenantId());
        rule.setShopId(reqVO.getShopId());
        rule.setRuleName(reqVO.getRuleName());
        rule.setRuleType(reqVO.getRuleType());
        rule.setCondition(reqVO.getCondition());
        rule.setThreshold(reqVO.getThreshold());
        rule.setEnabled(reqVO.getEnabled());
        rule.setNotifyType(reqVO.getNotifyType());
        
        if (reqVO.getId() != null) {
            rule.setId(reqVO.getId());
            alertRuleMapper.updateById(rule);
        } else {
            alertRuleMapper.insert(rule);
        }
    }

    @Override
    public CashflowSummaryVO getCashflowSummary(Long shopId, LocalDate startDate, LocalDate endDate) {
        CashflowSummaryVO vo = new CashflowSummaryVO();
        vo.setShopId(shopId);
        vo.setStartDate(startDate);
        vo.setEndDate(endDate);
        
        // TODO: 从cashflow表汇总数据
        vo.setTotalIncome(BigDecimal.ZERO);
        vo.setTotalExpense(BigDecimal.ZERO);
        vo.setNetCashflow(BigDecimal.ZERO);
        
        return vo;
    }

}
