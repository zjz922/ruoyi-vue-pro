/**
 * 资金流水路由
 * 调用Java后端API进行资金流水CRUD操作
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
 * 调用Java API的通用GET方法
 * 严格遵循架构原则：所有数据从Java后端获取
 */
async function callJavaApiGet<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  token?: string
): Promise<T> {
  const url = new URL(`${JAVA_API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
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
 * 调用Java API的通用POST/PUT/DELETE方法
 */
async function callJavaApiMutate<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${JAVA_API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
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
 * 资金流水类型定义
 */
interface CashflowItem {
  id: string;
  shopId: string;
  transactionDate: string;
  transactionTime: string;
  channel: string;
  channelName: string;
  type: string;
  typeName: string;
  income: number;
  expense: number;
  balance: number;
  orderNo: string | null;
  status: string;
  statusName: string;
  remark: string | null;
  tags: string[];
  createdAt: string;
}

interface CashflowListResult {
  items: CashflowItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface CashflowStats {
  totalIncome: number;
  totalExpense: number;
  netFlow: number;
  transactionCount: number;
  pendingCount: number;
  confirmedCount: number;
}

/**
 * 返回空数据结构（当Java API不可用时使用）
 * 不使用模拟数据，保持数据真实性
 */
const emptyResponse = {
  list: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  } as CashflowListResult,
  item: null as CashflowItem | null,
  stats: {
    totalIncome: 0,
    totalExpense: 0,
    netFlow: 0,
    transactionCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
  } as CashflowStats,
};

/**
 * 资金流水路由定义
 */
export const cashflowRouter = router({
  /**
   * 获取流水列表
   * 数据来源：Java后端 -> 抖店资金流水数据
   */
  list: publicProcedure
    .input(
      z.object({
        shopId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        channel: z.string().optional(),
        type: z.string().optional(),
        status: z.string().optional(),
        keyword: z.string().optional(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiGet<CashflowListResult>(
          "/api/cashflow/list",
          {
            shopId: input.shopId,
            startDate: input.startDate,
            endDate: input.endDate,
            channel: input.channel,
            type: input.type,
            status: input.status,
            keyword: input.keyword,
            page: input.page,
            pageSize: input.pageSize,
          },
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] list API调用失败:", error);
        return { ...emptyResponse.list, page: input.page, pageSize: input.pageSize };
      }
    }),

  /**
   * 获取单条流水
   * 数据来源：Java后端 -> 数据库
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiGet<CashflowItem>(
          `/api/cashflow/${input.id}`,
          {},
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] getById API调用失败:", error);
        return emptyResponse.item;
      }
    }),

  /**
   * 创建流水
   * 操作：调用Java后端API创建记录
   */
  create: publicProcedure
    .input(
      z.object({
        shopId: z.string(),
        transactionDate: z.string(),
        transactionTime: z.string(),
        channel: z.string(),
        type: z.string(),
        income: z.number().optional().default(0),
        expense: z.number().optional().default(0),
        orderNo: z.string().optional(),
        remark: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiMutate<{ id: string }>(
          "/api/cashflow",
          "POST",
          input,
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] create API调用失败:", error);
        throw new Error("创建流水失败，请确认Java后端服务已启动");
      }
    }),

  /**
   * 更新流水
   * 操作：调用Java后端API更新记录
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        transactionDate: z.string().optional(),
        transactionTime: z.string().optional(),
        channel: z.string().optional(),
        type: z.string().optional(),
        income: z.number().optional(),
        expense: z.number().optional(),
        remark: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      try {
        const data = await callJavaApiMutate<{ success: boolean }>(
          `/api/cashflow/${id}`,
          "PUT",
          updateData,
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] update API调用失败:", error);
        throw new Error("更新流水失败，请确认Java后端服务已启动");
      }
    }),

  /**
   * 删除流水
   * 操作：调用Java后端API删除记录
   */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiMutate<{ success: boolean }>(
          `/api/cashflow/${input.id}`,
          "DELETE",
          undefined,
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] delete API调用失败:", error);
        throw new Error("删除流水失败，请确认Java后端服务已启动");
      }
    }),

  /**
   * 确认流水
   * 操作：调用Java后端API确认记录
   */
  confirm: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiMutate<{ success: boolean }>(
          `/api/cashflow/${input.id}/confirm`,
          "POST",
          undefined,
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] confirm API调用失败:", error);
        throw new Error("确认流水失败，请确认Java后端服务已启动");
      }
    }),

  /**
   * 批量确认流水
   * 操作：调用Java后端API批量确认记录
   */
  batchConfirm: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiMutate<{ confirmed: number }>(
          "/api/cashflow/batch-confirm",
          "POST",
          { ids: input.ids },
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] batchConfirm API调用失败:", error);
        throw new Error("批量确认流水失败，请确认Java后端服务已启动");
      }
    }),

  /**
   * 获取流水统计
   * 数据来源：Java后端 -> 数据库聚合统计
   */
  getStats: publicProcedure
    .input(
      z.object({
        shopId: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const data = await callJavaApiGet<CashflowStats>(
          "/api/cashflow/stats",
          {
            shopId: input.shopId,
            startDate: input.startDate,
            endDate: input.endDate,
          },
          ctx.user?.id?.toString()
        );
        return data;
      } catch (error) {
        console.error("[CashflowRouter] getStats API调用失败:", error);
        return emptyResponse.stats;
      }
    }),
});
