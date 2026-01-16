/**
 * 经营概览路由
 * 调用Java后端API获取经营数据
 * 
 * 架构原则（严格执行）：
 * 1. 所有数据库读取操作由Java后端实现
 * 2. Node.js中间层只做API转发，不直接操作数据库
 * 3. 当Java API不可用时，返回空数据或错误提示，不使用模拟数据
 * 
 * @author Manus AI
 * @see ARCHITECTURE_PRINCIPLES.md
 * @see RUOYI_VUE_PRO_DEVELOPMENT_GUIDE.md
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";

// Java后端API基础URL
const JAVA_API_BASE_URL = ENV.javaApiBaseUrl || "http://localhost:8080";

/**
 * 调用Java后端API的通用方法
 * 严格遵循架构原则：所有数据从Java后端获取
 */
async function callJavaApi<T>(
  path: string,
  params: Record<string, string | undefined>,
  token?: string
): Promise<T> {
  const url = new URL(`${JAVA_API_BASE_URL}${path}`);
  
  // 添加查询参数
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Java API调用失败: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.code !== 0) {
    throw new Error(result.message || "Java API返回错误");
  }

  return result.data;
}

/**
 * KPI概览数据类型
 */
interface DashboardOverview {
  totalRevenue: number;
  orderCount: number;
  completedOrders: number;
  refundAmount: number;
  netSales: number;
  grossProfit: number;
  netProfit: number;
  expenses: {
    express: number;
    commission: number;
    service: number;
    promotion: number;
    insurance: number;
    payout: number;
    other: number;
  };
  ratios: {
    refundRate: number;
    profitRate: number;
    completionRate: number;
    promotionRate: number;
  };
}

/**
 * 趋势数据类型
 */
interface TrendItem {
  date: string;
  salesAmount: number;
  orderCount: number;
  refundAmount: number;
  profitAmount: number;
}

/**
 * 费用构成类型
 */
interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  percent: number;
}

/**
 * 返回空数据结构（当Java API不可用时使用）
 * 不使用模拟数据，保持数据真实性
 */
const emptyResponse = {
  overview: {
    totalRevenue: 0,
    orderCount: 0,
    completedOrders: 0,
    refundAmount: 0,
    netSales: 0,
    grossProfit: 0,
    netProfit: 0,
    expenses: {
      express: 0,
      commission: 0,
      service: 0,
      promotion: 0,
      insurance: 0,
      payout: 0,
      other: 0,
    },
    ratios: {
      refundRate: 0,
      profitRate: 0,
      completionRate: 0,
      promotionRate: 0,
    },
  } as DashboardOverview,
  trends: [] as TrendItem[],
  expenseBreakdown: [] as ExpenseBreakdownItem[],
};

/**
 * 经营概览路由定义
 */
export const dashboardRouter = router({
  /**
   * 获取KPI概览数据
   * 数据来源：Java后端 -> 抖店订单数据聚合统计
   */
  getOverview: publicProcedure
    .input(
      z.object({
        shopId: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const data = await callJavaApi<DashboardOverview>(
          "/api/dashboard/overview",
          {
            shopId: input.shopId,
            startDate: input.startDate,
            endDate: input.endDate,
          }
        );
        return data;
      } catch (error) {
        console.error("[DashboardRouter] getOverview API调用失败:", error);
        return emptyResponse.overview;
      }
    }),

  /**
   * 获取趋势数据
   * 数据来源：Java后端 -> 抖店订单数据按日期聚合
   */
  getTrends: publicProcedure
    .input(
      z.object({
        shopId: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        granularity: z.enum(["day", "week", "month"]).optional().default("day"),
      })
    )
    .query(async ({ input }) => {
      try {
        const data = await callJavaApi<TrendItem[]>(
          "/api/dashboard/trends",
          {
            shopId: input.shopId,
            startDate: input.startDate,
            endDate: input.endDate,
            granularity: input.granularity,
          }
        );
        return data;
      } catch (error) {
        console.error("[DashboardRouter] getTrends API调用失败:", error);
        return emptyResponse.trends;
      }
    }),

  /**
   * 获取费用构成
   * 数据来源：Java后端 -> 抖店订单费用数据聚合
   */
  getExpenseBreakdown: publicProcedure
    .input(
      z.object({
        shopId: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const data = await callJavaApi<ExpenseBreakdownItem[]>(
          "/api/dashboard/expense-breakdown",
          {
            shopId: input.shopId,
            startDate: input.startDate,
            endDate: input.endDate,
          }
        );
        return data;
      } catch (error) {
        console.error("[DashboardRouter] getExpenseBreakdown API调用失败:", error);
        return emptyResponse.expenseBreakdown;
      }
    }),
});
