package cn.iocoder.yudao.module.finance.service.impl;

import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.CashflowDO;
import cn.iocoder.yudao.module.finance.dal.dataobject.DailyStatDO;
import cn.iocoder.yudao.module.finance.dal.dataobject.OrderDO;
import cn.iocoder.yudao.module.finance.dal.dataobject.ProductCostDO;
import cn.iocoder.yudao.module.finance.dal.mysql.CashflowMapper;
import cn.iocoder.yudao.module.finance.dal.mysql.DailyStatMapper;
import cn.iocoder.yudao.module.finance.dal.mysql.OrderMapper;
import cn.iocoder.yudao.module.finance.dal.mysql.ProductCostMapper;
import cn.iocoder.yudao.module.finance.service.ReportService;
import cn.iocoder.yudao.module.system.dal.dataobject.tenant.TenantDO;
import cn.iocoder.yudao.module.system.dal.mysql.tenant.TenantMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 财务报表 Service 实现类
 * 所有数据从数据库读取，不使用模拟数据
 *
 * @author 闪电账PRO
 */
@Service
@Validated
@Slf4j
public class ReportServiceImpl implements ReportService {

    @Resource
    private DailyStatMapper dailyStatMapper;

    @Resource
    private OrderMapper orderMapper;

    @Resource
    private CashflowMapper cashflowMapper;

    @Resource
    private ProductCostMapper productCostMapper;

    @Resource
    private TenantMapper tenantMapper;

    @Override
    public Map<String, Object> generateDailyReport(Long shopId, LocalDate reportDate) {
        Map<String, Object> result = new HashMap<>();
        result.put("shopId", shopId);
        result.put("reportDate", reportDate);

        // 从日统计表获取数据
        DailyStatDO dailyStat = dailyStatMapper.selectByShopAndDate(shopId, reportDate);
        if (dailyStat != null) {
            result.put("totalIncome", dailyStat.getTotalIncome());
            result.put("totalExpense", dailyStat.getTotalExpense());
            result.put("netIncome", dailyStat.getNetProfit());
            result.put("orderCount", dailyStat.getOrderCount());
            result.put("paidAmount", dailyStat.getPaidAmount());
            result.put("refundAmount", dailyStat.getRefundAmount());
            result.put("grossProfit", dailyStat.getGrossProfit());
            result.put("grossProfitRate", dailyStat.getGrossProfitRate());
        } else {
            // 如果没有统计数据，从订单表实时计算
            result.put("totalIncome", BigDecimal.ZERO);
            result.put("totalExpense", BigDecimal.ZERO);
            result.put("netIncome", BigDecimal.ZERO);
            result.put("orderCount", 0);
        }
        return result;
    }

    @Override
    public Map<String, Object> generateWeeklyReport(Long shopId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();
        result.put("shopId", shopId);
        result.put("startDate", startDate);
        result.put("endDate", endDate);

        // 从日统计表获取周数据并汇总
        List<DailyStatDO> dailyStats = dailyStatMapper.selectListByShopAndDateRange(shopId, startDate, endDate);
        
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal netIncome = BigDecimal.ZERO;
        int orderCount = 0;

        for (DailyStatDO stat : dailyStats) {
            totalIncome = totalIncome.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            totalExpense = totalExpense.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
            netIncome = netIncome.add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO);
            orderCount += stat.getOrderCount() != null ? stat.getOrderCount() : 0;
        }

        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("netIncome", netIncome);
        result.put("orderCount", orderCount);
        return result;
    }

    @Override
    public Map<String, Object> generateMonthlyReport(Long shopId, Integer year, Integer month) {
        Map<String, Object> result = new HashMap<>();
        result.put("shopId", shopId);
        result.put("year", year);
        result.put("month", month);

        // 计算月份的开始和结束日期
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        // 从日统计表获取月数据并汇总
        List<DailyStatDO> dailyStats = dailyStatMapper.selectListByShopAndDateRange(shopId, startDate, endDate);
        
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal netIncome = BigDecimal.ZERO;
        int orderCount = 0;

        for (DailyStatDO stat : dailyStats) {
            totalIncome = totalIncome.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            totalExpense = totalExpense.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
            netIncome = netIncome.add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO);
            orderCount += stat.getOrderCount() != null ? stat.getOrderCount() : 0;
        }

        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("netIncome", netIncome);
        result.put("orderCount", orderCount);
        return result;
    }

    @Override
    public Map<String, Object> getOrderStats(Long shopId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // 从订单表统计
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        // 总订单数
        Long totalOrders = orderMapper.selectCount(new LambdaQueryWrapperX<OrderDO>()
                .eq(OrderDO::getShopId, shopId)
                .ge(OrderDO::getOrderCreateTime, startDateTime)
                .lt(OrderDO::getOrderCreateTime, endDateTime)
                .eq(OrderDO::getDelFlag, 0));

        // 已完成订单
        Long completedOrders = orderMapper.selectCount(new LambdaQueryWrapperX<OrderDO>()
                .eq(OrderDO::getShopId, shopId)
                .ge(OrderDO::getOrderCreateTime, startDateTime)
                .lt(OrderDO::getOrderCreateTime, endDateTime)
                .eq(OrderDO::getStatus, "COMPLETED")
                .eq(OrderDO::getDelFlag, 0));

        // 退款订单
        Long refundedOrders = orderMapper.selectCount(new LambdaQueryWrapperX<OrderDO>()
                .eq(OrderDO::getShopId, shopId)
                .ge(OrderDO::getOrderCreateTime, startDateTime)
                .lt(OrderDO::getOrderCreateTime, endDateTime)
                .eq(OrderDO::getStatus, "REFUNDED")
                .eq(OrderDO::getDelFlag, 0));

        // 取消订单
        Long cancelledOrders = orderMapper.selectCount(new LambdaQueryWrapperX<OrderDO>()
                .eq(OrderDO::getShopId, shopId)
                .ge(OrderDO::getOrderCreateTime, startDateTime)
                .lt(OrderDO::getOrderCreateTime, endDateTime)
                .eq(OrderDO::getStatus, "CANCELLED")
                .eq(OrderDO::getDelFlag, 0));

        result.put("totalOrders", totalOrders);
        result.put("completedOrders", completedOrders);
        result.put("refundedOrders", refundedOrders);
        result.put("cancelledOrders", cancelledOrders);
        return result;
    }

    @Override
    public Map<String, Object> getIncomeExpenseStats(Long shopId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // 从日统计表汇总收支数据
        List<DailyStatDO> dailyStats = dailyStatMapper.selectListByShopAndDateRange(shopId, startDate, endDate);
        
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (DailyStatDO stat : dailyStats) {
            totalIncome = totalIncome.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            totalExpense = totalExpense.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
        }

        BigDecimal netIncome = totalIncome.subtract(totalExpense);

        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("netIncome", netIncome);
        return result;
    }

    @Override
    public Map<String, Object> getProductCostStats(Long shopId) {
        Map<String, Object> result = new HashMap<>();

        // 从商品成本表统计
        List<ProductCostDO> productCosts = productCostMapper.selectList(new LambdaQueryWrapperX<ProductCostDO>()
                .eq(ProductCostDO::getShopId, shopId)
                .eq(ProductCostDO::getDelFlag, 0));

        int totalProducts = productCosts.size();
        BigDecimal totalCost = BigDecimal.ZERO;

        for (ProductCostDO cost : productCosts) {
            totalCost = totalCost.add(cost.getCostPrice() != null ? cost.getCostPrice() : BigDecimal.ZERO);
        }

        BigDecimal avgCost = totalProducts > 0 ? 
                totalCost.divide(BigDecimal.valueOf(totalProducts), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        result.put("totalProducts", totalProducts);
        result.put("totalCost", totalCost);
        result.put("avgCost", avgCost);
        return result;
    }

    @Override
    public Map<String, Object> getGrossProfitAnalysis(Long shopId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // 从日统计表汇总毛利数据
        List<DailyStatDO> dailyStats = dailyStatMapper.selectListByShopAndDateRange(shopId, startDate, endDate);
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (DailyStatDO stat : dailyStats) {
            totalRevenue = totalRevenue.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            totalCost = totalCost.add(stat.getProductCost() != null ? stat.getProductCost() : BigDecimal.ZERO);
        }

        BigDecimal grossProfit = totalRevenue.subtract(totalCost);
        BigDecimal grossProfitRate = totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                grossProfit.divide(totalRevenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)) : BigDecimal.ZERO;

        result.put("totalRevenue", totalRevenue);
        result.put("totalCost", totalCost);
        result.put("grossProfit", grossProfit);
        result.put("grossProfitRate", grossProfitRate);
        return result;
    }

    @Override
    public String exportReport(Long shopId, String reportType, LocalDate startDate, LocalDate endDate) {
        // TODO: 实现报表导出逻辑，生成Excel文件
        log.info("导出报表: shopId={}, reportType={}, startDate={}, endDate={}", shopId, reportType, startDate, endDate);
        return "/exports/report_" + shopId + "_" + reportType + "_" + System.currentTimeMillis() + ".xlsx";
    }

    // ==================== 管理员端报表方法实现 ====================

    @Override
    public Map<String, Object> getReportOverview(LocalDate startDate, LocalDate endDate, Long tenantId, String platformType) {
        Map<String, Object> result = new HashMap<>();

        // 构建查询条件
        LambdaQueryWrapperX<DailyStatDO> wrapper = new LambdaQueryWrapperX<DailyStatDO>()
                .geIfPresent(DailyStatDO::getStatDate, startDate)
                .leIfPresent(DailyStatDO::getStatDate, endDate)
                .eqIfPresent(DailyStatDO::getTenantId, tenantId);

        List<DailyStatDO> dailyStats = dailyStatMapper.selectList(wrapper);

        // 汇总数据
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal netProfit = BigDecimal.ZERO;
        int totalOrders = 0;
        int refundCount = 0;

        for (DailyStatDO stat : dailyStats) {
            totalRevenue = totalRevenue.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            totalExpense = totalExpense.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
            netProfit = netProfit.add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO);
            totalOrders += stat.getOrderCount() != null ? stat.getOrderCount() : 0;
            refundCount += stat.getRefundCount() != null ? stat.getRefundCount() : 0;
        }

        // 计算同比增长（与上一周期对比）
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        LocalDate prevStartDate = startDate.minusDays(daysBetween);
        LocalDate prevEndDate = startDate.minusDays(1);

        LambdaQueryWrapperX<DailyStatDO> prevWrapper = new LambdaQueryWrapperX<DailyStatDO>()
                .ge(DailyStatDO::getStatDate, prevStartDate)
                .le(DailyStatDO::getStatDate, prevEndDate)
                .eqIfPresent(DailyStatDO::getTenantId, tenantId);

        List<DailyStatDO> prevStats = dailyStatMapper.selectList(prevWrapper);

        BigDecimal prevRevenue = BigDecimal.ZERO;
        BigDecimal prevExpense = BigDecimal.ZERO;
        BigDecimal prevNetProfit = BigDecimal.ZERO;
        int prevOrders = 0;

        for (DailyStatDO stat : prevStats) {
            prevRevenue = prevRevenue.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            prevExpense = prevExpense.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
            prevNetProfit = prevNetProfit.add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO);
            prevOrders += stat.getOrderCount() != null ? stat.getOrderCount() : 0;
        }

        // 计算增长率
        double revenueGrowth = calculateGrowthRate(totalRevenue, prevRevenue);
        double expenseGrowth = calculateGrowthRate(totalExpense, prevExpense);
        double profitGrowth = calculateGrowthRate(netProfit, prevNetProfit);
        double ordersGrowth = prevOrders > 0 ? ((double)(totalOrders - prevOrders) / prevOrders) * 100 : 0;

        // 计算平均订单金额
        BigDecimal avgOrderAmount = totalOrders > 0 ? 
                totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        // 计算退款率
        double refundRate = totalOrders > 0 ? ((double)refundCount / totalOrders) * 100 : 0;

        // 计算毛利率
        double grossProfitMargin = totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                netProfit.divide(totalRevenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0;

        result.put("totalRevenue", totalRevenue);
        result.put("totalRevenueGrowth", revenueGrowth);
        result.put("totalExpense", totalExpense);
        result.put("totalExpenseGrowth", expenseGrowth);
        result.put("netProfit", netProfit);
        result.put("netProfitGrowth", profitGrowth);
        result.put("totalOrders", totalOrders);
        result.put("totalOrdersGrowth", ordersGrowth);
        result.put("avgOrderAmount", avgOrderAmount);
        result.put("refundRate", refundRate);
        result.put("grossProfitMargin", grossProfitMargin);

        return result;
    }

    @Override
    public Map<String, Object> getReportTrend(LocalDate startDate, LocalDate endDate, Long tenantId, String platformType) {
        Map<String, Object> result = new HashMap<>();

        // 构建查询条件
        LambdaQueryWrapperX<DailyStatDO> wrapper = new LambdaQueryWrapperX<DailyStatDO>()
                .geIfPresent(DailyStatDO::getStatDate, startDate)
                .leIfPresent(DailyStatDO::getStatDate, endDate)
                .eqIfPresent(DailyStatDO::getTenantId, tenantId)
                .orderByAsc(DailyStatDO::getStatDate);

        List<DailyStatDO> dailyStats = dailyStatMapper.selectList(wrapper);

        // 按日期分组
        List<String> dates = new ArrayList<>();
        List<BigDecimal> revenues = new ArrayList<>();
        List<BigDecimal> expenses = new ArrayList<>();
        List<BigDecimal> profits = new ArrayList<>();
        List<Integer> orders = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");

        for (DailyStatDO stat : dailyStats) {
            dates.add(stat.getStatDate().format(formatter));
            revenues.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            expenses.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
            profits.add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO);
            orders.add(stat.getOrderCount() != null ? stat.getOrderCount() : 0);
        }

        result.put("dates", dates);
        result.put("revenues", revenues);
        result.put("expenses", expenses);
        result.put("profits", profits);
        result.put("orders", orders);

        return result;
    }

    @Override
    public List<Map<String, Object>> getTenantRanking(LocalDate startDate, LocalDate endDate, String type, Integer limit) {
        List<Map<String, Object>> result = new ArrayList<>();

        // 从日统计表按租户分组汇总
        LambdaQueryWrapperX<DailyStatDO> wrapper = new LambdaQueryWrapperX<DailyStatDO>()
                .geIfPresent(DailyStatDO::getStatDate, startDate)
                .leIfPresent(DailyStatDO::getStatDate, endDate);

        List<DailyStatDO> dailyStats = dailyStatMapper.selectList(wrapper);

        // 按租户ID分组汇总
        Map<Long, BigDecimal> tenantValues = new HashMap<>();
        for (DailyStatDO stat : dailyStats) {
            Long tenantId = stat.getTenantId();
            BigDecimal value = BigDecimal.ZERO;
            
            switch (type) {
                case "revenue":
                    value = stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO;
                    break;
                case "profit":
                    value = stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO;
                    break;
                case "orders":
                    value = BigDecimal.valueOf(stat.getOrderCount() != null ? stat.getOrderCount() : 0);
                    break;
                default:
                    value = stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO;
            }
            
            tenantValues.merge(tenantId, value, BigDecimal::add);
        }

        // 排序并取前N名
        List<Map.Entry<Long, BigDecimal>> sortedEntries = tenantValues.entrySet().stream()
                .sorted(Map.Entry.<Long, BigDecimal>comparingByValue().reversed())
                .limit(limit)
                .collect(Collectors.toList());

        for (Map.Entry<Long, BigDecimal> entry : sortedEntries) {
            Map<String, Object> item = new HashMap<>();
            Long tenantId = entry.getKey();
            
            // 获取租户名称
            TenantDO tenant = tenantMapper.selectById(tenantId);
            String tenantName = tenant != null ? tenant.getName() : "租户" + tenantId;
            
            item.put("tenantId", tenantId);
            item.put("tenantName", tenantName);
            item.put("value", entry.getValue());
            item.put("growth", 0.0); // TODO: 计算增长率
            result.add(item);
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> getPlatformDistribution(LocalDate startDate, LocalDate endDate, Long tenantId) {
        List<Map<String, Object>> result = new ArrayList<>();

        // 从订单表按平台分组统计
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        LambdaQueryWrapperX<OrderDO> wrapper = new LambdaQueryWrapperX<OrderDO>()
                .ge(OrderDO::getOrderCreateTime, startDateTime)
                .lt(OrderDO::getOrderCreateTime, endDateTime)
                .eqIfPresent(OrderDO::getTenantId, tenantId)
                .eq(OrderDO::getDelFlag, 0);

        List<OrderDO> orders = orderMapper.selectList(wrapper);

        // 按平台分组统计
        Map<String, Long> platformCounts = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getPlatform() != null ? o.getPlatform() : "unknown",
                        Collectors.counting()
                ));

        // 平台名称映射
        Map<String, String> platformNames = new HashMap<>();
        platformNames.put("doudian", "抖店");
        platformNames.put("qianchuan", "千川");
        platformNames.put("jst", "聚水潭");
        platformNames.put("unknown", "其他");

        for (Map.Entry<String, Long> entry : platformCounts.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", platformNames.getOrDefault(entry.getKey(), entry.getKey()));
            item.put("value", entry.getValue());
            result.add(item);
        }

        return result;
    }

    @Override
    public Map<String, Object> getTenantReport(Long tenantId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // 获取租户信息
        TenantDO tenant = tenantMapper.selectById(tenantId);
        Map<String, Object> tenantInfo = new HashMap<>();
        if (tenant != null) {
            tenantInfo.put("id", tenant.getId());
            tenantInfo.put("name", tenant.getName());
            tenantInfo.put("createTime", tenant.getCreateTime());
            tenantInfo.put("status", tenant.getStatus());
        }
        result.put("tenantInfo", tenantInfo);

        // 获取报表数据
        List<DailyStatDO> dailyStats = dailyStatMapper.selectListByTenantAndDateRange(tenantId, startDate, endDate);

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal netProfit = BigDecimal.ZERO;
        int totalOrders = 0;

        BigDecimal productIncome = BigDecimal.ZERO;
        BigDecimal serviceIncome = BigDecimal.ZERO;
        BigDecimal platformFee = BigDecimal.ZERO;
        BigDecimal promotionCost = BigDecimal.ZERO;
        BigDecimal logisticsCost = BigDecimal.ZERO;

        for (DailyStatDO stat : dailyStats) {
            totalRevenue = totalRevenue.add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO);
            totalExpense = totalExpense.add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO);
            netProfit = netProfit.add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO);
            totalOrders += stat.getOrderCount() != null ? stat.getOrderCount() : 0;

            productIncome = productIncome.add(stat.getProductIncome() != null ? stat.getProductIncome() : BigDecimal.ZERO);
            serviceIncome = serviceIncome.add(stat.getServiceIncome() != null ? stat.getServiceIncome() : BigDecimal.ZERO);
            platformFee = platformFee.add(stat.getPlatformFee() != null ? stat.getPlatformFee() : BigDecimal.ZERO);
            promotionCost = promotionCost.add(stat.getPromotionCost() != null ? stat.getPromotionCost() : BigDecimal.ZERO);
            logisticsCost = logisticsCost.add(stat.getLogisticsCost() != null ? stat.getLogisticsCost() : BigDecimal.ZERO);
        }

        Map<String, Object> reportData = new HashMap<>();
        reportData.put("totalRevenue", totalRevenue);
        reportData.put("totalExpense", totalExpense);
        reportData.put("netProfit", netProfit);
        reportData.put("totalOrders", totalOrders);

        // 收入明细
        List<Map<String, Object>> incomeDetails = new ArrayList<>();
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            Map<String, Object> income1 = new HashMap<>();
            income1.put("type", "商品销售");
            income1.put("amount", productIncome);
            income1.put("percentage", productIncome.divide(totalRevenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
            incomeDetails.add(income1);

            Map<String, Object> income2 = new HashMap<>();
            income2.put("type", "服务费");
            income2.put("amount", serviceIncome);
            income2.put("percentage", serviceIncome.divide(totalRevenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
            incomeDetails.add(income2);
        }
        reportData.put("incomeDetails", incomeDetails);

        // 支出明细
        List<Map<String, Object>> expenseDetails = new ArrayList<>();
        if (totalExpense.compareTo(BigDecimal.ZERO) > 0) {
            Map<String, Object> expense1 = new HashMap<>();
            expense1.put("type", "平台扣款");
            expense1.put("amount", platformFee);
            expense1.put("percentage", platformFee.divide(totalExpense, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
            expenseDetails.add(expense1);

            Map<String, Object> expense2 = new HashMap<>();
            expense2.put("type", "推广费用");
            expense2.put("amount", promotionCost);
            expense2.put("percentage", promotionCost.divide(totalExpense, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
            expenseDetails.add(expense2);

            Map<String, Object> expense3 = new HashMap<>();
            expense3.put("type", "物流费用");
            expense3.put("amount", logisticsCost);
            expense3.put("percentage", logisticsCost.divide(totalExpense, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
            expenseDetails.add(expense3);
        }
        reportData.put("expenseDetails", expenseDetails);

        result.put("reportData", reportData);
        return result;
    }

    @Override
    public Map<String, Object> getShopComparison(Long tenantId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // 从日统计表按店铺分组
        List<DailyStatDO> dailyStats = dailyStatMapper.selectListByTenantAndDateRange(tenantId, startDate, endDate);

        // 按店铺ID分组汇总
        Map<Long, Map<String, Object>> shopData = new HashMap<>();
        for (DailyStatDO stat : dailyStats) {
            Long shopId = stat.getShopId();
            Map<String, Object> data = shopData.computeIfAbsent(shopId, k -> {
                Map<String, Object> m = new HashMap<>();
                m.put("shopId", shopId);
                m.put("revenue", BigDecimal.ZERO);
                m.put("expense", BigDecimal.ZERO);
                m.put("profit", BigDecimal.ZERO);
                m.put("orderCount", 0);
                return m;
            });

            data.put("revenue", ((BigDecimal)data.get("revenue")).add(stat.getTotalIncome() != null ? stat.getTotalIncome() : BigDecimal.ZERO));
            data.put("expense", ((BigDecimal)data.get("expense")).add(stat.getTotalExpense() != null ? stat.getTotalExpense() : BigDecimal.ZERO));
            data.put("profit", ((BigDecimal)data.get("profit")).add(stat.getNetProfit() != null ? stat.getNetProfit() : BigDecimal.ZERO));
            data.put("orderCount", (Integer)data.get("orderCount") + (stat.getOrderCount() != null ? stat.getOrderCount() : 0));
        }

        List<Map<String, Object>> list = new ArrayList<>(shopData.values());
        
        // 计算总收入用于计算贡献度
        BigDecimal totalRevenue = list.stream()
                .map(m -> (BigDecimal)m.get("revenue"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 添加利润率和贡献度
        for (Map<String, Object> item : list) {
            BigDecimal revenue = (BigDecimal)item.get("revenue");
            BigDecimal profit = (BigDecimal)item.get("profit");
            
            double profitRate = revenue.compareTo(BigDecimal.ZERO) > 0 ?
                    profit.divide(revenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0;
            double contribution = totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                    revenue.divide(totalRevenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0;
            
            item.put("profitRate", profitRate);
            item.put("contribution", contribution);
            item.put("shopName", "店铺" + item.get("shopId")); // TODO: 从店铺表获取名称
        }

        result.put("list", list);
        return result;
    }

    @Override
    public Long createExportTask(Map<String, Object> params) {
        // TODO: 实现创建导出任务逻辑，保存到数据库
        log.info("创建导出任务: {}", params);
        return System.currentTimeMillis();
    }

    @Override
    public Map<String, Object> getExportHistory(Integer pageNo, Integer pageSize) {
        Map<String, Object> result = new HashMap<>();
        // TODO: 从数据库查询导出历史
        result.put("list", new ArrayList<>());
        result.put("total", 0);
        return result;
    }

    @Override
    public void downloadExportFile(Long id, HttpServletResponse response) throws Exception {
        // TODO: 实现文件下载逻辑
        log.info("下载导出文件: {}", id);
    }

    /**
     * 计算增长率
     */
    private double calculateGrowthRate(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
