/**
 * 出纳管理模块路由
 * 包含：出纳工作台、资金流水、渠道管理、平台对账、差异分析、资金日报、资金月报、店铺统计、待处理预警、预警规则
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
    totalBalance: 0, availableBalance: 0, frozenBalance: 0, todayIncome: 0, todayExpense: 0,
    pendingWithdraw: 0, pendingReconcile: 0, pendingAlerts: 0,
  },
  cashflow: { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } },
  channels: [],
  reconciliation: { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } },
  differences: { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } },
  dailyReport: { list: [], summary: {} },
  monthlyReport: { list: [], summary: {} },
  shopReport: { list: [], summary: {} },
  alerts: { list: [], pagination: { total: 0, pageNum: 1, pageSize: 20 } },
  alertRules: [],
};

export const cashierRouter = router({
  // ========== 出纳工作台 ==========

  /** 获取出纳工作台数据 */
  dashboard: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/dashboard", input);
      } catch (error) {
        console.error("[CashierRouter] dashboard API调用失败:", error);
        return emptyResponse.dashboard;
      }
    }),

  /** 获取今日资金概览 */
  todayOverview: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/today-overview", input);
      } catch (error) {
        console.error("[CashierRouter] todayOverview API调用失败:", error);
        return { income: 0, expense: 0, balance: 0, transactions: [] };
      }
    }),

  /** 获取待办事项 */
  pendingTasks: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/pending-tasks", input);
      } catch (error) {
        console.error("[CashierRouter] pendingTasks API调用失败:", error);
        return { tasks: [] };
      }
    }),

  /** 获取工作台概览数据 */
  dashboardOverview: publicProcedure
    .input(z.object({
      shopId: z.number(),
      date: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/dashboard/overview", input);
      } catch (error) {
        console.error("[CashierRouter] dashboardOverview API调用失败:", error);
        return {
          todayIncome: 0, todayExpense: 0, totalBalance: 0, reconciliationRate: 0,
          incomeChange: 0, expenseChange: 0, balanceChange: 0,
          pendingTasks: 0, pendingAlerts: 0,
          dataSource: { doudianOrders: false, qianchuanCost: false, jushuitanErp: false },
        };
      }
    }),

  /** 获取资金流动趋势 */
  dashboardTrend: publicProcedure
    .input(z.object({
      shopId: z.number(),
      days: z.number().optional().default(7),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/dashboard/trend", input);
      } catch (error) {
        console.error("[CashierRouter] dashboardTrend API调用失败:", error);
        return { trendData: [] };
      }
    }),

  /** 获取待办任务列表 */
  dashboardTasks: publicProcedure
    .input(z.object({ shopId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/dashboard/tasks", input);
      } catch (error) {
        console.error("[CashierRouter] dashboardTasks API调用失败:", error);
        return { tasks: [] };
      }
    }),

  /** 刷新工作台数据 */
  dashboardRefresh: publicProcedure
    .input(z.object({
      shopId: z.number(),
      syncDoudian: z.boolean().optional().default(true),
      syncQianchuan: z.boolean().optional().default(true),
      syncJushuitan: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/dashboard/refresh", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] dashboardRefresh API调用失败:", error);
        return { success: false, message: "刷新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 资金流水 ==========

  /** 获取资金流水列表 */
  cashflowList: publicProcedure
    .input(z.object({
      shopId: z.string(),
      type: z.enum(["all", "income", "expense"]).optional(),
      channel: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      keyword: z.string().optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/cashflow/list", input);
      } catch (error) {
        console.error("[CashierRouter] cashflowList API调用失败:", error);
        return emptyResponse.cashflow;
      }
    }),

  /** 获取资金流水详情 */
  cashflowDetail: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/cashflow/${input.id}`, {});
      } catch (error) {
        console.error("[CashierRouter] cashflowDetail API调用失败:", error);
        return null;
      }
    }),

  /** 导出资金流水 */
  cashflowExport: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      type: z.enum(["all", "income", "expense"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/cashflow/export", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] cashflowExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 渠道管理 ==========

  /** 获取支付渠道列表 */
  channelList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      type: z.string().optional(),
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/channels", input);
      } catch (error) {
        console.error("[CashierRouter] channelList API调用失败:", error);
        return { channels: [], summary: { totalBalance: 0, totalChannels: 0, activeChannels: 0 } };
      }
    }),

  /** 获取渠道详情 */
  channelDetail: publicProcedure
    .input(z.object({ channelId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/channels/${input.channelId}`, {});
      } catch (error) {
        console.error("[CashierRouter] channelDetail API调用失败:", error);
        return null;
      }
    }),

  /** 新增渠道 */
  channelAdd: publicProcedure
    .input(z.object({
      shopId: z.number(),
      name: z.string(),
      type: z.string(),
      accountNo: z.string().optional(),
      initialBalance: z.number().optional().default(0),
      linkedJushuitanSupplierId: z.string().optional(),
      remark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/channel/add", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] channelAdd API调用失败:", error);
        return { success: false, message: "渠道添加服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 同步渠道余额 */
  channelSyncBalance: publicProcedure
    .input(z.object({
      channelIds: z.array(z.number()),
      syncDoudian: z.boolean().optional().default(true),
      syncQianchuan: z.boolean().optional().default(true),
      syncJushuitan: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/channel/syncBalance", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] channelSyncBalance API调用失败:", error);
        return { success: false, message: "同步服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 编辑渠道 */
  channelEdit: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      remark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/channel/edit", input, "PUT");
      } catch (error) {
        console.error("[CashierRouter] channelEdit API调用失败:", error);
        return { success: false, message: "编辑服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 更新渠道配置 */
  channelUpdate: protectedProcedure
    .input(z.object({
      channelId: z.number(),
      name: z.string().optional(),
      feeRate: z.number().optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/channels/${input.channelId}`, input, "PUT");
      } catch (error) {
        console.error("[CashierRouter] channelUpdate API调用失败:", error);
        return { success: false, message: "渠道更新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 启用/禁用渠道 */
  channelUpdateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["normal", "disabled"]),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/channel/updateStatus", input, "PUT");
      } catch (error) {
        console.error("[CashierRouter] channelUpdateStatus API调用失败:", error);
        return { success: false, message: "状态更新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 平台对账 ==========

  /** 获取对账任务列表 */
  reconciliationList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      status: z.string().optional(),
      platform: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      pageNum: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/reconciliation/list", input);
      } catch (error) {
        console.error("[CashierRouter] reconciliationList API调用失败:", error);
        return { total: 0, rows: [], stats: { totalOrders: 0, matchedOrders: 0, differenceOrders: 0, matchRate: 0, totalDifference: 0 } };
      }
    }),

  /** 获取对账详情 */
  reconciliationDetail: publicProcedure
    .input(z.object({ taskId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/reconciliation/${input.taskId}`, {});
      } catch (error) {
        console.error("[CashierRouter] reconciliationDetail API调用失败:", error);
        return null;
      }
    }),

  /** 发起对账 */
  reconciliationStart: publicProcedure
    .input(z.object({
      shopId: z.number(),
      platform: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      syncFromDoudian: z.boolean().optional().default(true),
      autoMatch: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/reconciliation/start", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] reconciliationStart API调用失败:", error);
        return { success: false, message: "对账服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 创建对账任务 */
  reconciliationCreate: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      platform: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/reconciliation/create", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] reconciliationCreate API调用失败:", error);
        return { success: false, message: "对账任务创建服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 执行对账 */
  reconciliationExecute: protectedProcedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/reconciliation/${input.taskId}/execute`, {}, "POST");
      } catch (error) {
        console.error("[CashierRouter] reconciliationExecute API调用失败:", error);
        return { success: false, message: "对账执行服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 导出对账单 */
  reconciliationExport: publicProcedure
    .input(z.object({
      shopId: z.number(),
      startDate: z.string(),
      endDate: z.string(),
      platform: z.string().optional(),
      format: z.enum(["excel", "pdf"]).optional().default("excel"),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/reconciliation/export", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] reconciliationExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 标记已核对 */
  reconciliationMarkVerified: publicProcedure
    .input(z.object({
      ids: z.array(z.number()),
      verifyRemark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/reconciliation/markVerified", input, "PUT");
      } catch (error) {
        console.error("[CashierRouter] reconciliationMarkVerified API调用失败:", error);
        return { success: false, message: "标记服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 查看差异详情 */
  reconciliationDifferenceDetail: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/reconciliation/differenceDetail?id=${input.id}`, {});
      } catch (error) {
        console.error("[CashierRouter] reconciliationDifferenceDetail API调用失败:", error);
        return null;
      }
    }),

  // ========== 差异分析 ==========

  /** 获取差异列表 */
  differenceList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      status: z.string().optional(),
      platform: z.string().optional(),
      reason: z.string().optional(),
      type: z.string().optional(),
      minAmount: z.number().optional(),
      maxAmount: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      pageNum: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/differences/list", input);
      } catch (error) {
        console.error("[CashierRouter] differenceList API调用失败:", error);
        return { total: 0, rows: [], stats: { totalDifference: 0, pendingCount: 0, processingCount: 0, resolvedCount: 0 } };
      }
    }),

  /** 获取差异详情 */
  differenceDetail: publicProcedure
    .input(z.object({ diffId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/differences/${input.diffId}`, {});
      } catch (error) {
        console.error("[CashierRouter] differenceDetail API调用失败:", error);
        return null;
      }
    }),

  /** 处理差异 */
  differenceHandle: protectedProcedure
    .input(z.object({
      diffId: z.number(),
      action: z.enum(["resolve", "ignore"]),
      reason: z.string().optional(),
      adjustAmount: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/differences/${input.diffId}/handle`, input, "POST");
      } catch (error) {
        console.error("[CashierRouter] differenceHandle API调用失败:", error);
        return { success: false, message: "差异处理服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 批量处理差异 */
  differenceBatchHandle: protectedProcedure
    .input(z.object({
      diffIds: z.array(z.number()),
      action: z.enum(["resolve", "ignore"]),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/differences/batch-handle", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] differenceBatchHandle API调用失败:", error);
        return { success: false, message: "批量处理服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 资金日报 ==========

  /** 获取资金日报列表 */
  dailyReportList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/daily-report/list", input);
      } catch (error) {
        console.error("[CashierRouter] dailyReportList API调用失败:", error);
        return { total: 0, rows: [], summary: {} };
      }
    }),

  /** 获取单日资金报表 */
  dailyReportDetail: publicProcedure
    .input(z.object({ shopId: z.union([z.string(), z.number()]), date: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/daily-report/detail", input);
      } catch (error) {
        console.error("[CashierRouter] dailyReportDetail API调用失败:", error);
        return null;
      }
    }),

  /** 生成日报 */
  dailyReportGenerate: publicProcedure
    .input(z.object({
      shopId: z.number(),
      date: z.string(),
      includeDoudian: z.boolean().optional().default(true),
      includeQianchuan: z.boolean().optional().default(true),
      includeJushuitan: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/daily-report/generate", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] dailyReportGenerate API调用失败:", error);
        return { success: false, message: "日报生成服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 导出资金日报 */
  dailyReportExport: protectedProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      startDate: z.string(),
      endDate: z.string(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/daily-report/export", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] dailyReportExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 资金月报 ==========

  /** 获取资金月报列表 */
  monthlyReportList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      year: z.number().optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/monthly-report/list", input);
      } catch (error) {
        console.error("[CashierRouter] monthlyReportList API调用失败:", error);
        return { total: 0, rows: [], summary: {} };
      }
    }),

  /** 获取单月资金报表 */
  monthlyReportDetail: publicProcedure
    .input(z.object({ shopId: z.union([z.string(), z.number()]), month: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/monthly-report/detail", input);
      } catch (error) {
        console.error("[CashierRouter] monthlyReportDetail API调用失败:", error);
        return null;
      }
    }),

  /** 生成月报 */
  monthlyReportGenerate: publicProcedure
    .input(z.object({
      shopId: z.number(),
      month: z.string(),
      includeDoudian: z.boolean().optional().default(true),
      includeQianchuan: z.boolean().optional().default(true),
      includeJushuitan: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/monthly-report/generate", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] monthlyReportGenerate API调用失败:", error);
        return { success: false, message: "月报生成服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 导出资金月报 */
  monthlyReportExport: protectedProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      year: z.number(),
      format: z.enum(["excel", "pdf"]).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/monthly-report/export", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] monthlyReportExport API调用失败:", error);
        return { success: false, message: "导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 店铺统计 ==========

  /** 获取店铺资金统计 */
  shopReportList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/shop-report/list", input);
      } catch (error) {
        console.error("[CashierRouter] shopReportList API调用失败:", error);
        return { total: 0, rows: [], summary: {} };
      }
    }),

  /** 获取店铺资金对比 */
  shopReportCompare: publicProcedure
    .input(z.object({
      shopIds: z.array(z.string()),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/shop-report/compare", input);
      } catch (error) {
        console.error("[CashierRouter] shopReportCompare API调用失败:", error);
        return { comparison: [] };
      }
    }),

  // ========== 待处理预警 ==========

  /** 获取预警列表 */
  alertList: publicProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      status: z.string().optional(),
      level: z.string().optional(),
      type: z.string().optional(),
      pageNum: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/alerts/list", input);
      } catch (error) {
        console.error("[CashierRouter] alertList API调用失败:", error);
        return { total: 0, rows: [] };
      }
    }),

  /** 获取预警详情 */
  alertDetail: publicProcedure
    .input(z.object({ alertId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/alerts/${input.alertId}`, {});
      } catch (error) {
        console.error("[CashierRouter] alertDetail API调用失败:", error);
        return null;
      }
    }),

  /** 处理预警 */
  alertHandle: protectedProcedure
    .input(z.object({
      alertId: z.number(),
      action: z.enum(["process", "ignore"]),
      remark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/alerts/${input.alertId}/handle`, input, "POST");
      } catch (error) {
        console.error("[CashierRouter] alertHandle API调用失败:", error);
        return { success: false, message: "预警处理服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 批量处理预警 */
  alertBatchHandle: protectedProcedure
    .input(z.object({
      alertIds: z.array(z.number()),
      action: z.enum(["process", "ignore"]),
      remark: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/alerts/batch-handle", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] alertBatchHandle API调用失败:", error);
        return { success: false, message: "批量处理服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 预警规则 ==========

  /** 获取预警规则列表 */
  alertRuleList: publicProcedure
    .input(z.object({ shopId: z.union([z.string(), z.number()]) }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/alert-rules/list", input);
      } catch (error) {
        console.error("[CashierRouter] alertRuleList API调用失败:", error);
        return [];
      }
    }),

  /** 获取预警规则详情 */
  alertRuleDetail: publicProcedure
    .input(z.object({ ruleId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/alert-rules/${input.ruleId}`, {});
      } catch (error) {
        console.error("[CashierRouter] alertRuleDetail API调用失败:", error);
        return null;
      }
    }),

  /** 创建预警规则 */
  alertRuleCreate: protectedProcedure
    .input(z.object({
      shopId: z.union([z.string(), z.number()]),
      name: z.string(),
      type: z.string(),
      condition: z.object({
        field: z.string(),
        operator: z.enum(["gt", "lt", "eq", "gte", "lte"]),
        value: z.number(),
      }),
      level: z.enum(["high", "medium", "low"]),
      enabled: z.boolean().optional(),
      notifyChannels: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/cashier/alert-rules/create", input, "POST");
      } catch (error) {
        console.error("[CashierRouter] alertRuleCreate API调用失败:", error);
        return { success: false, message: "规则创建服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 更新预警规则 */
  alertRuleUpdate: protectedProcedure
    .input(z.object({
      ruleId: z.number(),
      name: z.string().optional(),
      condition: z.object({
        field: z.string(),
        operator: z.enum(["gt", "lt", "eq", "gte", "lte"]),
        value: z.number(),
      }).optional(),
      level: z.enum(["high", "medium", "low"]).optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/alert-rules/${input.ruleId}`, input, "PUT");
      } catch (error) {
        console.error("[CashierRouter] alertRuleUpdate API调用失败:", error);
        return { success: false, message: "规则更新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /** 删除预警规则 */
  alertRuleDelete: protectedProcedure
    .input(z.object({ ruleId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/cashier/alert-rules/${input.ruleId}`, {}, "DELETE");
      } catch (error) {
        console.error("[CashierRouter] alertRuleDelete API调用失败:", error);
        return { success: false, message: "规则删除服务暂不可用，请确认Java后端服务已启动" };
      }
    }),
});
