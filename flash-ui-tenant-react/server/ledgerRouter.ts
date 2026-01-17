/**
 * 总账管理模块路由
 * 包含：经营概览、财务核算、资金管理、库存成本、经营分析、费用中心、税务管理
 * 
 * 架构原则（严格执行）：
 * 1. 所有数据库读取操作由Java后端实现
 * 2. Node.js中间层只做API转发，不直接操作数据库
 * 3. 当Java API不可用时，返回空数据或错误提示，不使用模拟数据
 * 
 * @author Manus AI
 * @see ARCHITECTURE_PRINCIPLES.md
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { ENV } from "./_core/env";

// Java后端API基础URL
const JAVA_API_BASE_URL = ENV.javaApiBaseUrl || "http://localhost:8080";

/**
 * 调用Java后端API的通用方法
 * 严格遵循架构原则：所有数据从Java后端获取
 * @param endpoint API端点
 * @param params 请求参数
 * @param method 请求方法
 * @returns API响应数据
 * @throws Error 当API调用失败时抛出错误
 */
async function callJavaApi<T>(
  endpoint: string,
  params?: Record<string, unknown>,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
): Promise<T> {
  let url = `${JAVA_API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "GET" && params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  } else if ((method === "POST" || method === "PUT") && params) {
    options.body = JSON.stringify(params);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Java API error: ${response.status} ${response.statusText}`);
  }
  const result = await response.json();
  return result.data as T;
}

/**
 * 返回空数据结构（当Java API不可用时使用）
 * 不使用模拟数据，保持数据真实性
 */
const emptyResponse = {
  dashboard: {
    kpi: { totalRevenue: 0, revenueChange: 0, totalOrders: 0, ordersChange: 0, grossProfit: 0, profitChange: 0, grossMargin: 0, marginChange: 0 },
    trends: [],
    expenseBreakdown: [],
  },
  accounting: {
    dualTrack: { accrual: {}, cash: {} },
    incomeStatement: [],
    balanceSheet: { assets: [], liabilities: [], equity: [] },
    cashFlowStatement: [],
  },
  funds: {
    totalBalance: 0, totalAvailable: 0, totalFrozen: 0, todayIn: 0, todayOut: 0,
    accounts: [], transactions: [], forecast: {},
  },
  inventory: {
    totalValue: 0, totalSKU: 0, healthySKU: 0, warningSKU: 0, dangerSKU: 0,
    turnoverDays: 0, avgCost: 0, costChangeRate: 0, skuCostList: [],
  },
  analysis: {
    overview: {}, channelROI: [], roiTrend: [], breakEven: {}, profitContribution: [],
  },
  expense: {
    totalExpense: 0, budgetTotal: 0, budgetUsed: 0, categories: [], allocation: {}, details: [],
  },
  tax: {
    totalTaxable: 0, estimatedVat: 0, estimatedIncome: 0, taxBurdenRate: 0,
    risks: [], declarations: [], invoiceStats: {},
  },
};

export const ledgerRouter = router({
  // ========== 经营概览模块 ==========

  /** 获取经营概览数据 */
  dashboardOverview: publicProcedure
    .input(z.object({
      shopId: z.string(),
      dateRange: z.object({ start: z.string(), end: z.string() }).optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/dashboard/overview", input);
      } catch (error) {
        console.error("[LedgerRouter] dashboardOverview API调用失败:", error);
        return { kpi: emptyResponse.dashboard.kpi, trends: [], expenseBreakdown: [], alerts: [], recentTransactions: [] };
      }
    }),

  /** 获取KPI数据 */
  dashboardKpi: publicProcedure
    .input(z.object({
      shopId: z.string(),
      dateRange: z.object({ start: z.string(), end: z.string() }).optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/dashboard/kpi", input);
      } catch (error) {
        console.error("[LedgerRouter] dashboardKpi API调用失败:", error);
        return emptyResponse.dashboard.kpi;
      }
    }),

  /** 获取趋势数据 */
  dashboardTrends: publicProcedure
    .input(z.object({ shopId: z.string(), days: z.number().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/dashboard/trends", input);
      } catch (error) {
        console.error("[LedgerRouter] dashboardTrends API调用失败:", error);
        return [];
      }
    }),

  /** 获取费用分布 */
  dashboardExpenseBreakdown: publicProcedure
    .input(z.object({ shopId: z.string(), month: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/dashboard/expense-breakdown", input);
      } catch (error) {
        console.error("[LedgerRouter] dashboardExpenseBreakdown API调用失败:", error);
        return [];
      }
    }),

  // ========== 财务核算模块 ==========

  /** 获取财务核算报表 */
  accountingReport: publicProcedure
    .input(z.object({
      shopId: z.string(),
      month: z.string().optional(),
      reportType: z.enum(["income", "balance", "cashflow"]).optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/accounting/report", input);
      } catch (error) {
        console.error("[LedgerRouter] accountingReport API调用失败:", error);
        return emptyResponse.accounting;
      }
    }),

  /** 获取利润表 */
  accountingIncomeStatement: publicProcedure
    .input(z.object({ shopId: z.string(), month: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/accounting/income-statement", input);
      } catch (error) {
        console.error("[LedgerRouter] accountingIncomeStatement API调用失败:", error);
        return [];
      }
    }),

  /** 导出财务报表 */
  accountingExport: publicProcedure
    .input(z.object({
      shopId: z.string(),
      reportType: z.enum(["income", "balance", "cashflow"]),
      month: z.string().optional(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/accounting/export", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] accountingExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 资金管理模块 ==========

  /** 获取资金总览 */
  fundsOverview: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/funds/overview", input);
      } catch (error) {
        console.error("[LedgerRouter] fundsOverview API调用失败:", error);
        return emptyResponse.funds;
      }
    }),

  /** 获取账户列表 */
  fundsAccounts: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/funds/accounts", input);
      } catch (error) {
        console.error("[LedgerRouter] fundsAccounts API调用失败:", error);
        return [];
      }
    }),

  /** 账户间转账 */
  fundsTransfer: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      fromAccountId: z.number(),
      toAccountId: z.number(),
      amount: z.number(),
      remark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/funds/transfer", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] fundsTransfer API调用失败:", error);
        return { success: false, message: "转账服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 提现申请 */
  fundsWithdraw: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      accountId: z.number(),
      amount: z.number(),
      bankAccount: z.string(),
      bankName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/funds/withdraw", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] fundsWithdraw API调用失败:", error);
        return { success: false, message: "提现服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 获取资金流水 */
  fundsTransactions: publicProcedure
    .input(z.object({
      shopId: z.string(),
      accountId: z.number().optional(),
      type: z.enum(["income", "expense", "transfer"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/funds/transactions", input);
      } catch (error) {
        console.error("[LedgerRouter] fundsTransactions API调用失败:", error);
        return { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } };
      }
    }),

  // ========== 库存成本模块 ==========

  /** 获取库存总览 */
  inventoryOverview: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/inventory/overview", input);
      } catch (error) {
        console.error("[LedgerRouter] inventoryOverview API调用失败:", error);
        return emptyResponse.inventory;
      }
    }),

  /** 获取SKU成本追踪 */
  inventorySkuCost: publicProcedure
    .input(z.object({
      shopId: z.string(),
      keyword: z.string().optional(),
      costTrend: z.enum(["up", "down", "stable"]).optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/inventory/sku-cost", input);
      } catch (error) {
        console.error("[LedgerRouter] inventorySkuCost API调用失败:", error);
        return { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } };
      }
    }),

  /** 设置成本计价方式 */
  inventoryCostingConfig: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      costingMethod: z.enum(["weighted_average", "fifo", "moving_average"]),
      effectiveDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/inventory/costing-config", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] inventoryCostingConfig API调用失败:", error);
        return { success: false, message: "配置服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 同步库存数据 */
  inventorySync: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      source: z.enum(["doudian", "jushuitan"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/inventory/sync", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] inventorySync API调用失败:", error);
        return { success: false, message: "同步服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 获取周转优化建议 */
  inventoryOptimization: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/inventory/optimization", input);
      } catch (error) {
        console.error("[LedgerRouter] inventoryOptimization API调用失败:", error);
        return { suggestions: [] };
      }
    }),

  /** 导出库存报表 */
  inventoryExport: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      reportType: z.enum(["overview", "sku-cost", "age-distribution"]),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/inventory/export", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] inventoryExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 经营分析模块 ==========

  /** 获取ROI分析数据 */
  analysisRoi: publicProcedure
    .input(z.object({
      shopId: z.string(),
      dateRange: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/analysis/roi", input);
      } catch (error) {
        console.error("[LedgerRouter] analysisRoi API调用失败:", error);
        return emptyResponse.analysis;
      }
    }),

  /** 获取盈亏平衡分析 */
  analysisBreakEven: publicProcedure
    .input(z.object({ shopId: z.string(), month: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/analysis/break-even", input);
      } catch (error) {
        console.error("[LedgerRouter] analysisBreakEven API调用失败:", error);
        return {};
      }
    }),

  /** 获取利润贡献分析 */
  analysisProfitContribution: publicProcedure
    .input(z.object({
      shopId: z.string(),
      dimension: z.enum(["product", "channel", "category"]).optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/analysis/profit-contribution", input);
      } catch (error) {
        console.error("[LedgerRouter] analysisProfitContribution API调用失败:", error);
        return { productContribution: [] };
      }
    }),

  /** 导出分析报告 */
  analysisExport: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      reportType: z.enum(["roi", "break-even", "profit-contribution"]),
      dateRange: z.string().optional(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/analysis/export", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] analysisExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 费用中心模块 ==========

  /** 获取费用总览 */
  expenseOverview: publicProcedure
    .input(z.object({ shopId: z.string(), month: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/overview", input);
      } catch (error) {
        console.error("[LedgerRouter] expenseOverview API调用失败:", error);
        return emptyResponse.expense;
      }
    }),

  /** 获取多维度费用分摊 */
  expenseAllocation: publicProcedure
    .input(z.object({
      shopId: z.string(),
      dimension: z.enum(["shop", "category", "channel"]),
      month: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/allocation", input);
      } catch (error) {
        console.error("[LedgerRouter] expenseAllocation API调用失败:", error);
        return { dimension: input.dimension, allocations: [] };
      }
    }),

  /** 设置费用预算 */
  expenseBudget: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      month: z.string(),
      budgets: z.array(z.object({ category: z.string(), amount: z.number() })),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/budget", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] expenseBudget API调用失败:", error);
        return { success: false, message: "预算设置服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 录入费用 */
  expenseCreate: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      category: z.string(),
      amount: z.number(),
      desc: z.string(),
      date: z.string(),
      channel: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/create", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] expenseCreate API调用失败:", error);
        return { success: false, message: "费用录入服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 获取异常费用列表 */
  expenseAnomalies: publicProcedure
    .input(z.object({
      shopId: z.string(),
      status: z.enum(["pending", "confirmed", "ignored"]).optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/anomalies", input);
      } catch (error) {
        console.error("[LedgerRouter] expenseAnomalies API调用失败:", error);
        return { anomalies: [] };
      }
    }),

  /** 确认异常费用 */
  expenseConfirmAnomaly: protectedProcedure
    .input(z.object({
      anomalyId: z.number(),
      action: z.enum(["confirm", "ignore"]),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/confirm-anomaly", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] expenseConfirmAnomaly API调用失败:", error);
        return { success: false, message: "异常确认服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 审批费用 */
  expenseApprove: protectedProcedure
    .input(z.object({
      expenseIds: z.array(z.number()),
      action: z.enum(["approve", "reject"]),
      remark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/approve", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] expenseApprove API调用失败:", error);
        return { success: false, message: "审批服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 获取费用明细 */
  expenseDetails: publicProcedure
    .input(z.object({
      shopId: z.string(),
      category: z.string().optional(),
      status: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/details", input);
      } catch (error) {
        console.error("[LedgerRouter] expenseDetails API调用失败:", error);
        return { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } };
      }
    }),

  /** 导出费用报表 */
  expenseExport: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      month: z.string().optional(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/expense/export", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] expenseExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 税务管理模块 ==========

  /** 获取税务总览 */
  taxOverview: publicProcedure
    .input(z.object({ shopId: z.string(), month: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/overview", input);
      } catch (error) {
        console.error("[LedgerRouter] taxOverview API调用失败:", error);
        return emptyResponse.tax;
      }
    }),

  /** 获取风险预警列表 */
  taxRisks: publicProcedure
    .input(z.object({
      shopId: z.string(),
      status: z.enum(["pending", "resolved", "ignored"]).optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/risks", input);
      } catch (error) {
        console.error("[LedgerRouter] taxRisks API调用失败:", error);
        return { risks: [] };
      }
    }),

  /** 获取申报日历 */
  taxDeclarations: publicProcedure
    .input(z.object({ shopId: z.string(), year: z.number().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/declarations", input);
      } catch (error) {
        console.error("[LedgerRouter] taxDeclarations API调用失败:", error);
        return { declarations: [] };
      }
    }),

  /** 设置税务预警规则 */
  taxAlertConfig: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      rules: z.array(z.object({
        type: z.string(),
        threshold: z.number().optional(),
        days: z.number().optional(),
        enabled: z.boolean(),
      })),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/alert-config", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] taxAlertConfig API调用失败:", error);
        return { success: false, message: "预警配置服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 忽略风险预警 */
  taxIgnoreRisk: protectedProcedure
    .input(z.object({ riskId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/ignore-risk", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] taxIgnoreRisk API调用失败:", error);
        return { success: false, message: "操作服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 获取发票统计 */
  taxInvoiceStats: publicProcedure
    .input(z.object({ shopId: z.string(), month: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/invoice-stats", input);
      } catch (error) {
        console.error("[LedgerRouter] taxInvoiceStats API调用失败:", error);
        return { issued: 0, received: 0, pending: 0 };
      }
    }),

  /** 生成税务报表 */
  taxReport: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      reportType: z.enum(["monthly", "quarterly", "annual"]),
      period: z.string(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/ledger/tax/report", input, "POST");
      } catch (error) {
        console.error("[LedgerRouter] taxReport API调用失败:", error);
        return { success: false, message: "报表生成服务暂不可用，请确认Java后端服务已启动" };
      }
    }),
});
