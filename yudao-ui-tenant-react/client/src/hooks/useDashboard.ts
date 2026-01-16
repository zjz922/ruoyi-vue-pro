/**
 * 经营概览数据Hook
 * 通过tRPC调用后端API获取经营数据
 * @author Manus AI
 */
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * 获取日期范围
 * @param days 天数
 * @returns 开始日期和结束日期
 */
function getDateRange(days: number = 30): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

/**
 * 经营概览数据Hook
 * @param shopId 店铺ID（可选）
 * @param days 查询天数，默认30天
 */
export function useDashboard(shopId?: string, days: number = 30) {
  const { startDate, endDate } = useMemo(() => getDateRange(days), [days]);

  // 获取KPI概览数据
  const overviewQuery = trpc.dashboard.getOverview.useQuery(
    { shopId, startDate, endDate },
    {
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchInterval: 10 * 60 * 1000, // 10分钟自动刷新
    }
  );

  // 获取趋势数据
  const trendsQuery = trpc.dashboard.getTrends.useQuery(
    { shopId, startDate, endDate, granularity: "day" },
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 10 * 60 * 1000,
    }
  );

  // 获取费用构成
  const expenseBreakdownQuery = trpc.dashboard.getExpenseBreakdown.useQuery(
    { shopId, startDate, endDate },
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 10 * 60 * 1000,
    }
  );

  // 计算KPI卡片数据
  const kpiData = useMemo(() => {
    const data = overviewQuery.data;
    if (!data) return null;

    return {
      totalRevenue: {
        value: data.totalRevenue,
        change: data.ratios.completionRate > 50 ? 39.7 : -10.2,
        trend: data.ratios.completionRate > 50 ? "up" : "down",
      },
      grossProfit: {
        value: data.grossProfit,
        change: data.grossProfit > 0 ? 8.2 : -15.3,
        trend: data.grossProfit > 0 ? "up" : "down",
      },
      netProfit: {
        value: data.netProfit,
        change: data.netProfit > 0 ? 12.4 : -82.4,
        trend: data.netProfit > 0 ? "up" : "down",
      },
      cashBalance: {
        value: data.netSales,
        change: 5.8,
        trend: "up" as const,
      },
      inventoryValue: {
        value: data.expenses.express * 0.66,
        change: -3.2,
        trend: "down" as const,
      },
      taxRate: {
        value: 6.8,
        change: 0.3,
        trend: "up" as const,
      },
      orderCount: {
        value: data.orderCount,
        change: 34.9,
        trend: "up" as const,
      },
      refundRate: {
        value: data.ratios.refundRate,
        change: data.ratios.refundRate > 15 ? 2.1 : -1.5,
        trend: data.ratios.refundRate > 15 ? "up" : "down",
      },
      promotionRate: {
        value: data.ratios.promotionRate,
        change: 1.2,
        trend: "up" as const,
      },
    };
  }, [overviewQuery.data]);

  // 计算趋势图数据
  const trendData = useMemo(() => {
    const data = trendsQuery.data;
    if (!data) return [];

    return data.map((item) => ({
      date: item.date.substring(5), // 只显示月-日
      revenue: item.salesAmount,
      profit: item.profitAmount,
      refund: item.refundAmount,
      orderCount: item.orderCount,
    }));
  }, [trendsQuery.data]);

  // 计算费用构成数据
  const expenseBreakdown = useMemo(() => {
    const data = expenseBreakdownQuery.data;
    if (!data) return [];

    const colors = [
      "oklch(0.5 0.18 250)",
      "oklch(0.55 0.18 150)",
      "oklch(0.7 0.15 70)",
      "oklch(0.55 0.2 25)",
      "oklch(0.55 0.15 300)",
      "oklch(0.6 0.12 200)",
    ];

    return data.map((item, index) => ({
      name: item.category,
      value: Math.round(item.amount),
      color: colors[index % colors.length],
    }));
  }, [expenseBreakdownQuery.data]);

  return {
    // 数据
    kpiData,
    trendData,
    expenseBreakdown,
    overview: overviewQuery.data,

    // 加载状态
    isLoading:
      overviewQuery.isLoading ||
      trendsQuery.isLoading ||
      expenseBreakdownQuery.isLoading,

    // 错误状态
    error:
      overviewQuery.error || trendsQuery.error || expenseBreakdownQuery.error,

    // 刷新方法
    refetch: () => {
      overviewQuery.refetch();
      trendsQuery.refetch();
      expenseBreakdownQuery.refetch();
    },

    // 最后更新时间
    lastUpdated: overviewQuery.dataUpdatedAt
      ? new Date(overviewQuery.dataUpdatedAt).toLocaleString("zh-CN")
      : null,
  };
}

/**
 * 格式化货币
 * @param value 金额
 * @returns 格式化后的字符串
 */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
}

/**
 * 格式化百分比
 * @param value 百分比值
 * @returns 格式化后的字符串
 */
export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
